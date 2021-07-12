import React from 'react';
import {
    Route,
    // Switch,
    Redirect
} from 'react-router-dom'
import Switch from '../../TransitionSwitch'
import moment from 'moment'
import sdk from 'broadlink-jssdk';
import {defaultTimer} from './timer-util'
import PropTypes from 'prop-types';

import TimerList from './TimerList';
import TimerDetail from './TimerDetail';
import RepeatSetting from './RepeatSetting';
import DaySetting from './DaySetting';
import DateSetting from './DateSetting';
import CommandSetting from './GeneralCommand';
import CycleCommand from './CycleCommand';

import TimerRecycle from './TimerRecycle';
import TimeSetting from './TimeSetting';
import Loading from '../../ActivityIndicator';
import Modal from '../../Modal';
import Toast from '../../Toast';
import {notifyError} from '../../utils';
import {sortTimers, ONCE_MAX_NUM, PERIOD_MAX_NUM,CYCLE_MAX_NUM} from './timer-util'
import Runable from '../../Runable';
import style from './SDKTimer.less';
import { injectIntl } from 'react-intl';

moment.fn.toJSON = function() { return this.format("YYYY-MM-DD HH:mm:ss"); };

const SUPPORT_TYPES = [0,2,3];

const isValidElement = function(object) {

    const REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
        Symbol.for &&
        Symbol.for('react.element')) ||
        0xeac7;

    return typeof object === 'object' &&
        object !== null &&
        object.$$typeof === REACT_ELEMENT_TYPE;
};

export default injectIntl(class extends React.Component {

    static propTypes = {
        //命令设置界面
        setting:PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.element,
        ]).isRequired,
        //定时内容的描述
        desc:PropTypes.func.isRequired,
        //命令设置为标准交互，还是完全自定义
        settingType:PropTypes.oneOf(['inline'/*未实现*/, 'standard','custom']),
        //是否支持循环定时
        supportRecycle:PropTypes.bool
    };

    static defaultProps = {
        settingType:'standard',

        /*desc:(status,type)=>{
            if(type === 'list'){
                //列表界面
                return status? (status.pwr === 1 ? '插座开启':'插座关闭'):'未知';
            }else if(type === 'detail'){
                //详情界面
                return status && status.pwr != null? (status.pwr === 1? '开启': '关闭'):'未设置';
            }
        }*/
    };

    constructor(props) {
        super(props);
        this.state ={
            timers:null,
            loading:false
        };
        this.updateTimers = this.updateTimers.bind(this);

        this.updateTimers();
    }

    updateTimers(timerList){
        const that = this;
        if(this.updateTask){
            this.updateTask.stop();
        }
        this.setState({timers:null});

        this.updateTask = new class extends Runable{

            run(){
                const setState =(...args)=>{
                    if(!this.isStopped){
                        that.setState.apply(that,args);
                    }else{
                        console.error('old task is stopped ,will not setState!');
                    }
                };

                const {task} = sdk.platformSDK;
                const listPromise = timerList?Promise.resolve(timerList):task.listTask();

                const failedIndexes = [];
                const getDetailByList = (list) => {

                    const getDetailByIndex = (index = 0)=>{
                        if(this.isStopped){
                            console.error('old task is stopped !index:'+index);
                            return ;
                        }
                        const timer = list[index];
                        if(!timer){
                            return ;
                        }
                        if((timer.type===1 || timer.type===0) && timer.enable && timer.time.isBefore(moment())){
                            timer.enable = false;
                        }

                        if(!timer.status || timer.status===-1){
                            return task.queryTask(timer.type, timer.index)
                                .then(detail => {
                                    timer.status = detail.status;
                                    if(timer.type ===3 || timer.type ===4){
                                        timer.status2 = detail.status2;
                                    }
                                    setState((prevState, props) => {
                                        const newTimers = [...prevState.timers];
                                        newTimers[index] = {...timer};
                                        return {timers: newTimers};
                                    });
                                })
                                .catch(e => {
                                    failedIndexes.push(index);
                                    console.error(e);
                                })
                                .then(() => {
                                    return getDetailByIndex(++index);
                                });
                        }else{
                            return getDetailByIndex(++index);
                        }

                    };

                    return getDetailByIndex();
                };

                return listPromise.then((timers) => {
                    if(this.isStopped){
                        return ;
                    }
                    //过滤
                    timers = timers.filter(timer=>SUPPORT_TYPES.indexOf(timer.type)>=0);
                    //排序
                    timers = sortTimers(timers);

                    that.setState({timers:timers});
                    getDetailByList(timers).then(()=>{
                        setState((prevState, props) => {
                            const newTimers = [...prevState.timers];
                            failedIndexes.forEach(index => newTimers[index] = {...newTimers[index],status:-1})
                            return {timers: newTimers};
                        });
                    });
                },e=>{
                    if(!this.isStopped){
                        notifyError(e);
                        setState({timers:-1});
                    }else{
                        console.error(e);
                    }
                });
            }
        }();

        this.updateTask.start();
    }

    componentWillUnmount(){
        if(this.updateTask){
            this.updateTask.stop();
        }
        const {timers} =this.state;
        if(timers && Array.isArray(timers)){
            //更新缓存,countdown-timer.js需要使用
            let cache = window.__dnaTimersCache__||[];
            let unsupported = cache.filter(timer=>SUPPORT_TYPES.indexOf(timer.type)<0);
            window.__dnaTimersCache__ = [...timers,...unsupported];
        }

    }

    timerCounts = type => {
        let total =0;
        const {timers} = this.state;
        if(timers && Array.isArray(timers)){
            timers.forEach((timer)=>{
                if(type == null || timer.type ===type){
                    total++;
                }
            });
        }

        return total;
        
    };

    deleteFromState = (type,index)=>{
        this.setState((prevState, props) => {
            let newTimers= [...prevState.timers];
            newTimers&&newTimers.map((time,i)=>{
                if(time.type===type&&time.index===index){
                    newTimers.splice(i,1);
                }
            });
            return {timers: newTimers};
        });
    };

    alreadyDeletedAlert = (e,confirm)=>{
        const {formatMessage} = this.props.intl
        if(e.code == -9){
            Modal.alert(formatMessage({id:'internal.SDKTimer.alreadyDeleted'}),()=>{
                confirm();
                return true;
            });
        }else{
            throw e;
        }
    };




    timerHandler = (actionType,param ={})=>{
        const {formatMessage} = this.props.intl
        
        const taskSdk = sdk.platformSDK && sdk.platformSDK.task;
        if(actionType === 'EDIT'){
            let timer = this.state.timers[param.index];
            this.setState({
                currentTimer:{...timer,enable:true}
            });
        }else if(actionType === 'REFRESH'){
            this.updateTimers();
        }else if(actionType === 'RELOAD'){
            let {timers} = this.state;
            let newTimers = [];
            timers.forEach(timer =>{
                if(timer.status === -1){
                    newTimers.push({...timer,status:null})
                }else{
                    newTimers.push(timer)
                }
            });
            this.updateTimers(newTimers);
        }else if(actionType === 'NEW'){
            this.setState({
                currentTimer: this.timerCounts(0) < ONCE_MAX_NUM ? defaultTimer(0) : defaultTimer(2)
            });
        }else if(actionType === 'UPDATE'){
            //those tow are generated by auto,do not accept updates
            let {index,type,...updates} = param;
            updates.repeat && updates.repeat.sort();
            let newTimer ={...this.state.currentTimer, ...updates};
            console.error(`updateCurrent : ${JSON.stringify(newTimer)}`);
            this.setState({
                currentTimer:newTimer
            });
        }else if(actionType === 'DELETE'){
            let {type,index,callback,refresh} = param;


            this.syncTask(()=>{
                return taskSdk.deleteTask(type,index).then((taskList)=>{
                    callback && callback();
                    if(refresh){   //如果是定时详情界面执行的删除操作，则更新数据
                        return this.updateTimers(taskList);   //定时列表界面删除时会全部刷新因此不执行
                    }else { //定时列表界面长按只更新该条数据不刷新界面
                        this.deleteFromState(type,index)
                    }
                }).catch(e=> this.alreadyDeletedAlert(e,()=>this.deleteFromState(type,index)));
            });
        }else if(actionType === 'TOGGLE'){
            let timer = this.state.timers[param.index];
            if((timer.type===1 || timer.type===0) && !timer.enable){
                let time =  moment({hour: timer.time.hour(), minute: timer.time.minute()});
                if(time.isBefore(moment())){
                    time.add(1,'days')
                }
                timer.time = time;
            }
            this.syncTask(()=>{
                const toggleTimer = {...timer,enable:!timer.enable};
                return taskSdk.addTask(toggleTimer).then((taskList)=>{
                    this.setState((prevState, props) => {
                        const newTimers = [...prevState.timers];
                        newTimers[param.index] = toggleTimer;
                        return {timers: newTimers};
                    });

                    // return this.updateTimers(taskList);
                }).catch(e=>
                    this.alreadyDeletedAlert(e,
                        ()=>this.deleteFromState(toggleTimer.type,toggleTimer.index)));
            })

        }else if(actionType === 'SAVE'){
            const currentTimer = {...this.state.currentTimer};
            let {repeat,index,status} = currentTimer;

            if(param.type == null){
                Modal.alert(formatMessage({id:'internal.SDKTimer.dateError'}));
                return ;
            }

            //如果类型被改变，需要删除以前定时
            let deleteTimer;
            if(currentTimer.type !== param.type && index!=null){
                deleteTimer = {index:currentTimer.index,type:currentTimer.type};
                delete currentTimer.index;
            }
            //reset type
            currentTimer.type = param.type;

            //数据结构整理
            if(currentTimer.type !== 3 &&　currentTimer.type !==　4){
                delete currentTimer.endtime;
                delete currentTimer.cmd1duration;
                delete currentTimer.cmd2duration;
                delete currentTimer.data2;
            }
            if(currentTimer.type === 0){
                delete currentTimer.repeat;
            }

            //定时数量检查
            if(currentTimer.index == null){
                let count = this.timerCounts(currentTimer.type);
                if(currentTimer.type===0 && count>=ONCE_MAX_NUM){
                    Modal.alert(formatMessage({id:'internal.SDKTimer.reachLimit0'}));
                    return;
                }else if(currentTimer.type===2 && count>=PERIOD_MAX_NUM){
                    Modal.alert(formatMessage({id:'internal.SDKTimer.reachLimit2'}));
                    return;
                }else if(currentTimer.type===3 && count>=CYCLE_MAX_NUM){
                    //TODO
                    Modal.alert(formatMessage({id:'internal.SDKTimer.reachLimit3'}));
                    return;
                }
            }

            //单次定时时间有效性检查
            if(currentTimer.type === 0 && currentTimer.time.isBefore(moment())){
                Toast.info(formatMessage({id:'internal.SDKTimer.timeInvalid'}));
                return ;
            }

            //循环定时有效性检查
            //todo
            if(currentTimer.type === 3){
                if(!currentTimer.repeat){    // 1-7 分别代表周一到周日，若为空([])，表示仅执行一次
                    currentTimer.repeat=[];
                }
            }

            const {callback,confirm} = param;

            const save = ()=>{
                this.syncTask(()=>{
                    return taskSdk
                        .addTask(currentTimer).then((taskList)=>{
                            if(deleteTimer){
                                return taskSdk.deleteTask(deleteTimer.type, deleteTimer.index)
                            }else{
                                return taskList;
                            }
                        }).then((taskList) => {
                            callback &&　callback();
                            //恢复默认值 TODO
                            return this.updateTimers(taskList);
                        }).catch(e=>{
                            
                            if(currentTimer.index != null){
                                this.alreadyDeletedAlert(e,()=>this.deleteFromState(currentTimer.type,currentTimer.index))
                            }else{
                                throw e;
                            }
                        })
                })
            };

            save();
        }
    };

    syncTask = task=>{
        this.setState({loading:true});

        task().catch(e=>
            notifyError(e)
        ).then(()=>
            this.setState({loading:false})
        );
    };

    route = ({path, exact, component:Component,props})=>
        <Route exact={exact} path={this.props.match.url+path} render={(routeProps) =>
            <Component {...routeProps} timerHandler={this.timerHandler} {...props}/>
        }/>
    ;

    render() {

        const {timers,currentTimer,loading} =this.state;
        const {match,setting,desc,location,supportRecycle,settingType} =this.props;
        const {index,repeat,time,status,status2,cmd1duration,cmd2duration} = (currentTimer || {});

	    const isAddable = this.timerCounts() < ONCE_MAX_NUM +PERIOD_MAX_NUM+CYCLE_MAX_NUM ;

	    const propsConfig = new Map(
	        [
	            [TimerList,{timers,isAddable,desc}],
                [TimerDetail,{timer:currentTimer,desc,supportRecycle}],
                [RepeatSetting,{repeat}],
                [DaySetting,{repeat}],
                [DateSetting,{time,edit:index != null}],

                // [CommandSetting,{command={status} status={this.props.status} content={setting} }]

                [TimeSetting,{timer:currentTimer,desc}],
                [TimerRecycle,{timer:currentTimer,desc}],
                [CycleCommand,{command:status,command2:status2,content:setting,cmd1duration:cmd1duration,cmd2duration:cmd2duration}],
            ]
        );

        return (
            <div className={style.ScreenHeight}>
                <Switch location={this.props.location} history={this.props.history} level={2}>

                    {
                        routes.map(config=>this.route({...config,props:propsConfig.get(config.component)}))
                    }
                    {
                        (()=>{
                            const path = `/command`;
                            if(settingType==='custom'){
                                if(isValidElement(setting)){
                                    return (
                                        //注入部分逻辑
                                        <Route path={match.url+path} render={(props) =>
                                            <setting.type {...setting.props} {...props} command={status} timerHandler={this.timerHandler}/>
                                        }/>
                                    )

                                }else if(typeof setting === 'function'){
                                    return this.route({path, component:setting,props:{command:status}});
                                }
                            }else{
                                //嵌入到已经写好的部分逻辑（界面）中
                                return this.route({path, component:CommandSetting,props:{command:status,content:setting}});
                            }
                        })()
                    }

                </Switch>

                {loading && <Loading />}
            </div>
        )

    }
})

const routes = [
    /*定时列表界面*/
    {
        path: '',
        exact: true,
        component:TimerList
    },
    /*循环定时详情界面*/
    {
        path: "/recycle",
        component:TimerRecycle
    },
    /*普通定时详情界面（周期与单次）*/
    {
        path: "/detail",
        component:TimerDetail
    },
    /*重复设置界面*/
    {
        path: "/repeat",
        component:RepeatSetting
    },
    /*day of weeks 选择（周几选择）*/
    {
        path: "/day",
        component:DaySetting
    },
    /*具体日期选择*/
    {
        path: "/date",
        component:DateSetting
    },
    /*普通定时（周期与单次）命令设置*/
    // {
    //     path: "/command",
    //     component:CommandSetting
    // },
    /*循环定时命令设置*/
    {
        path: "/cycle-command/:flag",
        component:CycleCommand
    },
    {
        path: "/time/:flag",
        component:TimeSetting
    }
];