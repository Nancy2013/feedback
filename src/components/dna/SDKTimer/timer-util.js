import moment from 'moment'
import sdk from 'broadlink-jssdk';
import Runable from '../../Runable';
export const ONCE_MAX_NUM = 16;
export const PERIOD_MAX_NUM = 16;
export const CYCLE_MAX_NUM = 2;
export const defaultTimer = (type = 0)=>(
    type === 0 ? {
        type: 0,
        enable: true,
        time: moment().startOf('minute').add(1,'minutes'),
        // status:{pwr:1}
    } : {
        type: 2,
        enable: true,
        time: moment().startOf('minute').add(1,'minutes'),
        repeat: [1,2,3,4,5,6,7]
    }
    
);

const periodDesc = (repeat, formatMessage)=>{
    if(repeat && repeat.length>0){
        return repeat.map(r=>formatMessage({id:'internal.SDKTimer.isoWeekday'},{index: r})).join('、 ');
    }else{
        return formatMessage({id:'internal.SDKTimer.onceRepeat'});
    }
};

export const timerPeriods = ()=>[
    {
        name: 'internal.SDKTimer.onceRepeat',
        match: repeat => !repeat||repeat.length===0,
        choose:()=>({repeat:[]})
    },
    {
        name: 'internal.SDKTimer.everydayRepeat',
        match:repeat => repeat.length===7,
        choose:()=>({repeat:[1,2,3,4,5,6,7]})
    },
    {
        name:'internal.SDKTimer.weekdayRepeat',
        match:repeat => {
            const weekday = [1,2,3,4,5];
            let containsAll = true;
            for(let i=0;i<weekday.length;i++){
                if(repeat.indexOf(weekday[i])<0){
                    containsAll = false;
                    break;
                }
            }
            return containsAll&& weekday.length===repeat.length;
        },
        choose:()=>({repeat:[1,2,3,4,5]})
    },
    {
        name:'internal.SDKTimer.weekendRepeat',
        match:repeat => {
            const weekend = [6,7];
            let containsAll = true;
            for(let i=0;i<weekend.length;i++){
                if(repeat.indexOf(weekend[i])<0){
                    containsAll = false;
                    break;
                }
            }
            return containsAll&& weekend.length===repeat.length;
        },
        choose:()=>({repeat:[6,7]})
    },
    {
        name:'internal.SDKTimer.customRepeat',
        match:repeat => {
            return repeat && repeat.length>0;
        },
        desc:(repeat, formatMessage) =>periodDesc(repeat, formatMessage),
    },
];


export const repeatDesc = (repeat, formatMessage)=>{

    const periods =  timerPeriods();
    for(let i =0;i<periods.length;i++){
        let period=periods[i];
        if(period.match(repeat)){
            return period.desc?period.desc(repeat, formatMessage):formatMessage({id:period.name});
        }
    }
};

export function nearestExecTime(timer){
    if(timer.type === 2||timer.type === 3||timer.type === 4){
        const sameWeek = timer.repeat.map(day => timer.time.clone().isoWeekday(day));
        const afterNow = sameWeek.filter( m => m.isAfter(moment()));

        let finalExecTime = afterNow;
        if(finalExecTime.length === 0){
            finalExecTime = timer.repeat.map(day =>timer.time.clone().isoWeekday(day+7));
        }
        return moment.min(...finalExecTime)
    }else{
        return timer.time;
    }
}


export function sortTimers(timers) {
    if(!timers || timers.length === 0){
        return [];
    }

    const invalid = [];
    const valid = [];

    timers.forEach(timer =>{
        if((timer.type === 2 ||timer.type === 3||timer.type === 4 || timer.time.isAfter(moment())) && timer.enable){
            valid.push(timer)
        }else{
            invalid.push(timer)
        }
    });
    
    valid.sort((a,b)=> {

        const aTime = nearestExecTime(a);
        const bTime = nearestExecTime(b);

        if(aTime.isBefore(bTime)){
            return -1;
        }
        return 1;
    });

    invalid.sort((a,b)=> {

        if(a.time.isBefore(b.time)){
            return -1;
        }
        return 1;
    });
    return [...valid,...invalid];
}

export function latestTimer(filter = ()=>true,list) {

    return new class extends Runable{

        run(){
            const listPromise = list?Promise.resolve(list):sdk.platformSDK.task.listTask();

            return listPromise.then(timers=>{
                timers = sortTimers(timers);
                const getLatestTimer = i => {
                    if(this.isStopped){
                        return ;
                    }
                    const task =  timers[i];
                    if(!task){
                        return Promise.resolve();
                    }
                    const {time,status,type,index,enable} = task;
                    //过期或者disable的定时跳过
                    if(!enable || ((type===1 || type===0) && time.isBefore(moment())) || type===4 || type===3){
                        return getLatestTimer(++i);
                    }
                    if(!status){
                        return sdk.platformSDK.task.queryTask(type,index).then(detail=>{
                            //mutable
                            task.status = detail.status;
                            if(!filter(task.status)){
                                return getLatestTimer(++i);
                            }else{
                                console.log('getLatestTimer:'+JSON.stringify(task));
                                return task
                            }
                        });
                    }
                    console.warn(`index ${i}  already has a detail structure`);
                    if(!filter(status)){
                        return getLatestTimer(++i);
                    }else{
                        console.log('getLatestTimer:'+JSON.stringify(task));
                        return Promise.resolve(task);
                    }
                };
                return getLatestTimer(0);
            }).then(task=>{
                return task;
            })
        }
    }();
    // .catch(e=>{
    //     notifyError(e)
    // });
}

export function getTimerDetail(types=[0,2],list){

    return new class extends Runable{
        run(){
            const {task} = sdk.platformSDK;

            const listPromise = list?Promise.resolve(list):task.listTask();

            const getDetailByList = (list) => {

                function getDetailByIndex(index = 0){
                    const timer = list[index];
                    if(!timer){
                        return Promise.resolve(list);
                    }
                    if(!timer.status){
                        return task.queryTask(timer.type,timer.index).then(detail=>{
                            timer.status = detail.status;
                            return getDetailByIndex(++index);
                        });
                    }else{
                        return getDetailByIndex(++index);
                    }
                }

                return getDetailByIndex();
            };

            return listPromise.then((timers) => {
                timers = timers.filter(timer=>types.indexOf(timer.type)>=0);
                console.error('getTimerDetail result:'+JSON.stringify(timers));
                return getDetailByList(timers);
            })
        }
    }();
}



