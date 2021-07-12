import { delay } from 'redux-saga'
import { put, takeEvery, fork, take ,select,call,} from 'redux-saga/effects'
import sdk from 'broadlink-jssdk'
import {TIMER_QUERY,TIMER_ADD,TIMER_DELETE, SUN_CONFIGURE,} from './actions/action-constants'
import {dnaSelectors} from "./reducers";
import {
    querySuccess,
    queryFail,
    queryStart,
    addTimerSuccess,
    deleteTimerSuccess,
    editTimerSuccess,
    setCurrentLocation,
    setLocationEnable,
} from "./actions/timer";
import {loading} from "./actions";
import {notifyError} from "./utils";
import moment from "moment";
import Toast from "./Toast";
import {clacTable, fixSunMoment} from './dna/SDKTimerV2/timer-util'

const {taskV2} = sdk.platformSDK;
// const taskV2 = {};
const {TYPE_COMMON,TYPE_DELAY,TYPE_PERIOD,TYPE_CYCLE,TYPE_RAND,TYPE_ALL} = taskV2;
const {getTimerList, timerSelectors,entitiesSelectors} = dnaSelectors;

const LATITUDE = 'latitude';
const LONGITUDE = 'longitude';
const EAST = 'E';
const WEST = 'W';
const NORTH = 'N';
const SOUTH = 'S';

function callWithRetry(retry = 3,waitMsec = 1000) {

    return function* (fn, ...args){
        let error ;
        for(let i = 0; i < retry; i++) {
            try {
                return yield call(fn, ...args);
            } catch(err) {
                console.error(`调用API出错，${waitMsec}秒后重试，错误信息：${err.message}`);
                error = err;
                if(i < retry-1) {
                    yield delay(waitMsec);
                }
            }
        }
        // 重试 X 次后失败
        throw error;
    }

}

const retryCall = callWithRetry();

const generateUuid = ({id,type})=>id+'-'+type;

const formatLnglat = (type, origin) => {  
    let formated;
    if (typeof origin === 'number') {   // -90 => W90
        if (type === LATITUDE) {
            formated = (origin < 0 ? SOUTH : NORTH) + Math.abs(origin);
        } else {
            formated = (origin < 0 ? WEST : EAST) + Math.abs(origin);
        }
    } else {    //  W90 => -90
        let sym = origin.substr(0,1);
        let num = origin.substr(1);
        formated = (sym === WEST || sym === SOUTH) ? -num : +num;
    }
    return formated;
};

const loadLocation = function* (){
    const {sun = []} = yield retryCall(taskV2.getLimitation, {type: TYPE_ALL});
    const [en, _longitude, _latitude] = sun;
    let longitude, latitude;
    if (en && _longitude && _latitude) {
        longitude = formatLnglat(LONGITUDE ,_longitude);
        latitude = formatLnglat(LATITUDE ,_latitude)  ;
    } else {  // 没有配置表的时候 默认使用当前定位
        const loc = yield call(sdk.platformSDK.callNative, 'gpsLocation');
        if (loc && loc.longitude && loc.latitude) {
            longitude = loc.longitude;
            latitude = loc.latitude;
        }
    }
    const location = {
        en,
        longitude,
        latitude,
    };

    yield put(setCurrentLocation(location));

    return location;
};

const loadTimers = (function () {

    let tryAgain = false;

    function overrideSunMoment(timer, table, ...fields) {
        const _timer = timer.clone();
        const fix = fixSunMoment.bind(null, table);
        fields.forEach(field=>{
            if(_timer[field] != null){
                _timer[field].moment = fix(_timer[field]);
            }
        });
        return _timer;
    }

    function* loadAll(action) {
        yield put(queryStart(action.clear));

        const allTimers = [];
        const count = 10;
        let index = 0;

        while (true){

            try {
                const {total,timerlist:list,...rest} = yield retryCall(taskV2.list,{index,count});
                list.forEach(timer=> {
                    timer.uuid = generateUuid(timer);
                    allTimers.push(timer);
                });

                index = index+list.length;
                if(index>=total || list.length===0 ){
                    //加载完所有定时
                    return  {
                        total,
                        list:allTimers,
                        limits:{
                            [TYPE_COMMON]:rest.comm_limits,
                            [TYPE_DELAY]:rest.delay_limits,
                            [TYPE_PERIOD]:rest.period_limits,
                            [TYPE_CYCLE]:rest.cycle_limits,
                            [TYPE_RAND]:rest.rand_limits,
                        }
                    };

                }
                //防止在JSSDK的任务队列中占据控制命令
                yield delay(100);
            }catch (err) {
                if(tryAgain){
                    console.error(`查询定时出错，${1}秒后重试，错误信息：${err.message}`);
                    yield delay(1000);
                }else{
                    throw err;
                    // yield put(queryFail(err));
                    // return;
                }
            }
        }

    }

    return function* (action) {
        const lastUpdateTime = yield select(timerSelectors.getLastUpdateTime);
        const isFetching = yield select(timerSelectors.getIsFetching);
        //5分钟过期
        const needUpdate = !lastUpdateTime || new Date().getTime() - lastUpdateTime.getTime()>5*60*1000;
        if(needUpdate){
            if(isFetching){
                //如果正在获取，只改变循环参数
                //在定时组件中，查询失败则停止查询，显示出定时列表
                //在最新定时组件中，如何查询失败则不停重试
                tryAgain = action.keepTrying;
                console.error('正在查询定时列表，设置出错重查为：'+tryAgain);
            }else{
                try {
                    let timerInfo = yield call(loadAll,action);
                    //获取模块上日出日落配置，如果未配置则使用手机定位信息
                    if(action.supportSunriseAndSunset){
                        let location = yield call(loadLocation);
                        let table = clacTable(location);
                        timerInfo.list = timerInfo.list.map(timer => overrideSunMoment(timer, table, 'time', 'stime', 'etime'));
                    }
                    //排序
                    yield put(querySuccess(timerInfo,false));
                } catch(err) {
                    console.error(err);
                    yield put(queryFail(err));
                }  
            }
        }else{
            console.warn('当前定时列表还未过期，不进行重新查询');
        }
    }


})();

/*
* 检查单次定时的时间是否在当前时间之后。
* 检查单次循环定时的时间有效性，并予以修正
* */
function fixTime(timer) {
    if(!timer.isRepeated()){
        if(timer.type === TYPE_COMMON||timer.type === TYPE_PERIOD){
            let time = moment({hour: timer.time.moment.hour(), minute: timer.time.moment.minute()});
            if(time.isBefore(moment())){
                time.add(1,'days');
            }
            timer.time.moment = time
        }else{
            const endTime = moment({hour: timer.etime.moment.hour(), minute: timer.etime.moment.minute()});
            const startTime = moment({hour: timer.stime.moment.hour(), minute: timer.stime.moment.minute()});
            if(endTime.isBefore(startTime)){
                //如果结束时间在开始时间之前
                endTime.add(1,'days');
            }else if(endTime.isBefore(moment())){
                //如果结束时间在开始时间之后，而且小于当前时间
                endTime.add(1,'days');
                startTime.add(1,'days');
            }
            timer.etime.moment = endTime;
            timer.stime.moment = startTime;
        }
    }
}

function checkDuplicate(list,{type,time,id}) {
    if(type === TYPE_COMMON||type === TYPE_DELAY||type === TYPE_PERIOD){
        for(let i =0;i<list.length;i++){
            let timer = list[i];

            if( !(timer.id===id && timer.type===type) /*非当前定时*/ &&
                timer.time &&/*不比较循环定时*/
                time.toString() === timer.time.toString() ){
                return true
            }
        }
    }
}


/**
 * 检查循环定时可选区间有效性
 * d1 + d2 <= et - st
 */
function validateInterval(timer) {
    if (timer.type === TYPE_CYCLE) {
        const maxDuration = timer.etime.moment.diff(timer.stime.moment, 'minutes');
        const sumDuration = timer.time1.asMinutes() + timer.time2.asMinutes();
        return sumDuration <= maxDuration;
    } else {
        return true;
    }
}

function* setSunConfigIfNeeded(timer) {
    // 如果添加的是日出日落格式，才判断是否需要先配置table
    if ((timer.time && timer.time.sun) || (timer.stime && timer.stime.sun) || (timer.etime && timer.etime.sun)) {
        const {en, currentLocation: {longitude, latitude}} = yield select(timerSelectors.getLocation);
        if (!en && longitude && latitude) {
            console.error('配置日出日落：',JSON.stringify({longitude, latitude}));
            yield call(configureSun, {config: {longitude, latitude}});
        }
    }
}
const limitationWarningTexts = {
    [TYPE_COMMON]:'internal.SDKTimerV2.commReachLimit',
    [TYPE_PERIOD]:'internal.SDKTimerV2.periodReachLimit',
    [TYPE_CYCLE]:'internal.SDKTimerV2.cycleReachLimit',
};
function* watchTimerAdd() {
    while (true){
        try {
            const {callback,timer:timerFromArg} = yield take(TIMER_ADD);
            yield put(loading(true));
            /*
            *TODO ?
            export const getCurrentTimer = createSelector(
                timerSelectors.getCurrent, timerSelectors.getSunTable,
                (timer={}, table) => overrideSunMoment(timer, table, 'time', 'stime', 'etime')
            );
            * */
            const timer = timerFromArg || (yield select(timerSelectors.getCurrent));
            const timerList = yield select(getTimerList);
            console.error('待添加timer：',JSON.stringify(timer));

            //获取其真实type
            const realType = timer.type === TYPE_COMMON || timer.type === TYPE_PERIOD ?
                timer.isRepeated()?TYPE_PERIOD:TYPE_COMMON:
                timer.type;
            //判断数量上限
            if(realType !== timer.type || timer.id == null){
                let remain =  yield select(timerSelectors.getRemainByType,realType);
                if(remain<=0){
                    //定时数量已经达到上限
                    Toast.info(limitationWarningTexts[realType]);
                    continue ;
                }
            }
            //修正定时type
            let deleteTimer;
            if(realType !== timer.type && timer.id != null){
                deleteTimer = {id:timer.id,type:timer.type,uuid:timer.uuid};
                //变成添加定时
                delete timer.id;
            }
            timer.type = realType;
            //修正定时时间的有效性
            if(timer.type !== TYPE_DELAY){
                fixTime(timer);
            }

            //判断时间是否重复
            const duplicate =  checkDuplicate(timerList,timer);
            if(duplicate){
                Toast.info('internal.SDKTimerV2.duplicatedWarning');
                continue;
            }
            // 检查循环定时可选区间有效性
            if (timer.type === TYPE_CYCLE && !validateInterval(timer)) {
                Toast.info('internal.SDKTimerV2.intervalWarning');
                continue;
            }
            //设置日出日落table
            yield setSunConfigIfNeeded(timer);
            //删除类型被转换的定时
            if(deleteTimer){
                console.error('删除timer：',JSON.stringify(deleteTimer));
                const {status} = yield call(taskV2.del,deleteTimer);
                if (status === 0){
                    yield put(deleteTimerSuccess(deleteTimer));
                }
            }
            console.error('添加timer：',JSON.stringify(timer));
            const {status,idlist} = yield call(taskV2.add,timer);
            if (status === 0){
                if(timer.id != null){
                    //编辑
                    yield put(editTimerSuccess(timer));
                }else{
                    timer.id = idlist[0];
                    timer.uuid = generateUuid(timer);
                    yield put(addTimerSuccess(timer));
                }

                //后退
                if(callback){
                    callback();
                }

                //根据需求可以从新加载定时列表
                //重新加载定时列表
                // yield call(queryList,true);
            }else{
                notifyError({code:status});
            }
        }catch (e) {
            notifyError(e);
        }finally {
            yield put(loading(false));
        }
    }
}


function* watchDelete() {
    while (true){
        try {
            const {ids,callback} = yield take(TIMER_DELETE);
            yield put(loading(true));

            const timers = [];
            for (let i=0;i<ids.length;i++){
                let {uuid,id,type} = yield select(entitiesSelectors.getTimerById,ids[i]);
                timers.push({uuid,id,type});
            }

            const {status} = yield call(taskV2.del,...timers);
            if (status === 0){
                yield put(deleteTimerSuccess(...timers));
                //后退
                if(callback){
                    callback();
                }

                //根据需求可以从新加载定时列表
                //重新加载定时列表
                // yield call(queryList,true);
            }else{
                notifyError({code:status});
            }
        }catch (e) {
            notifyError(e);
        }finally {
            yield put(loading(false));
        }
    }
}

function* configureSun(action) {
    yield put(loading(true));
    try {
        const {longitude, latitude} = action.config;
        const table = clacTable({latitude, longitude});
        const configResult = yield retryCall(taskV2.sunSetting, {latitude: formatLnglat(LATITUDE, latitude),longitude: formatLnglat(LONGITUDE ,longitude), fmt: 0, table});
        if (configResult.status !== 0) {
            throw new Error('configure sun failed.');
        } else {
            yield put(setLocationEnable());
            yield put(setCurrentLocation({longitude, latitude, table}));
            action.callback && action.callback();
        }
        yield put(loading(false));
    } catch(err) {
        notifyError(err);
        yield put(loading(false));
    }  
}

export default function* rootSaga() {
    yield fork(watchTimerAdd);
    yield fork(watchDelete);
    yield takeEvery(TIMER_QUERY,loadTimers);
    yield takeEvery(SUN_CONFIGURE, configureSun);
}