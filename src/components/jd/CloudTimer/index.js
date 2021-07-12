import React from 'react';
import PropTypes from 'prop-types';
import {
    Route,
    Switch
} from 'react-router-dom'
// import Switch from '../../TransitionSwitch'
import TimerList from './TimerList'
import TimerDetail from './TimerDetail'
import TimerRepeat from './TimerRepeat'
import TimerSetting from './TimerSetting'
import TimerSetTaskName from './TimerSetTaskName'
import TimerNotice from './TimerNotice'
import TimerExecuteRecords from './TimerExecuteRecords'
import{
    initDeviceData,
    getTimerList,
    deleteTimer,
    to_or_stop,
    addOrEditTimer,
    setNavbar
} from "./api"
import {
    currentTimer,
    checkTimer,
    rejectToast
} from './util';
import { injectIntl } from 'react-intl';

export default injectIntl(class CloudTimer extends React.Component {
    
    static propTypes = {
        desc: PropTypes.func,//返回对执行命令表述 参数：(stream,type['list'|'detail'|'defalut'])
        setting: PropTypes.func,
        cmdPage: PropTypes.bool,     //命令设置（timerCmd）是否显示在单独路由  默认在detail界面
    }

    static defaultProps = {
        setting: TimerSetting,
    }
    
    constructor(props){
        super(props);
        this.state = {
            timers: [],
            currentTimer:null
        }
    }

    deviceInfo = {};

    componentDidMount() {
        this.initNavbar_initData_getTimers()  //获取定时接口需要的设备属性 如”feed_id“   以及查询定时列表 \  定时navbar功能
    }
   
    componentWillUnmount(){
        setNavbar("mainPage")
    }

    initNavbar_initData_getTimers = async() => {
        let that = this;
        //定义导航栏功能
        window.addTaskFn = function () {
            that.setState({
                currentTimer:new currentTimer()
            },()=>that.props.history.push("/timer/detail"))
        }
        window.goBackCustom = function () {
            window.history.back();
        }
        window.cancel_newTask = function () {
            window.history.back();
        }
        //开始获取设备feed_id以及定时列表
        const deviceInfo = await initDeviceData();
        that.deviceInfo = deviceInfo;
        try {
            that.setState({
                timers: await getTimerList()
            })
        } catch (err) {
            console.log(err,"errr")
            that.setState({
                timers: -1,
            })
        }
    }
   
    addOrEditTask = () => {                           //增或编辑
        const { currentTimer } = this.state;
        const { updateTimerList } = this;
        const { maxTimers, sameTiming } =checkTimer(currentTimer,this.state.timers);  //检测是否符合添加条件，例： 超出12个定时，相同时间的定时，定时是否需要加一天
       
        return new Promise((resolve, reject) => {
            if(maxTimers){
                rejectToast(reject,"定时已超过最大数量")
                return
            }
            if(sameTiming){
                rejectToast(reject,"已有相同时间的定时，请修改后再添加")
                return
            }
            addOrEditTimer(currentTimer).then((suc)=>{
                updateTimerList({...currentTimer,...JSON.parse( suc.result),task_status:1},currentTimer.task_id ? "edit" :"add");
                resolve(suc)
            }).catch((e)=> reject(e))
        } )
    }

    deleteTimer = (timer,callback) =>{    //删除
        deleteTimer(timer.task_id).then(()=>{
            this.updateTimerList(timer,"delete")
            callback&&callback()
        })
    }

    enableTimer = (timer)=>{   //启用和停用timer   和编辑timer不是同一个接口
        to_or_stop( timer.task_status*1===1 ? 0 : 1, timer.task_id, (success) => {
            if(success){
                this.updateTimerList(timer ,"check")
            }
        })
    }
   
    updateCurrentTimer=(property,callback)=>{     
        const newCurrentTimer = !this.state.currentTimer ? new currentTimer() : this.state.currentTimer.clone()
        this.setState({
            currentTimer: Object.assign(newCurrentTimer,property ) 
        })
        console.error('修改currentTimer属性:',property,"更新后的currentTimer:",{...newCurrentTimer,...property})
        callback && callback()
    }


    updateTimerList = (timer,action) =>{  
        let newTimers=[...this.state.timers];
        switch(action) {
            case "check":                                //开启或停用，这个操作与edit不同
                newTimers.forEach(function(indexTimer,i){
                    if(indexTimer.task_id === timer.task_id){
                        newTimers[i]={...newTimers[i], task_status:newTimers[i].task_status*1 === 1 ? 0 : 1}
                    }
                })
                break;
            case "delete":
                newTimers = newTimers.filter(obj => obj.task_id !== timer.task_id)
                break;
            case "edit":
                newTimers.forEach(function(indexTimer,i){
                    if(indexTimer.task_id === timer.task_id){
                        newTimers[i]={...timer}
                    }
                })
                break;
            default:  //action = "add"
                newTimers.push(timer)  
        }
        this.setState({
            timers:newTimers
        })
    }

    render() {
        const { setting: TimerSetting, cmdIsPage } = this.props;
        const descFunc = this.props.desc;
        const {timers, currentTimer} = this.state;
        const detailTimerSetting = ()=>{
            return <TimerSetting 
                        updateCmd={(cmd)=>{
                            this.updateCurrentTimer({cmd,task_name:descFunc(cmd)})}
                        }    
                        cmd={this.state.currentTimer.cmd}
                    />
        }
        return <Switch location={this.props.location} history={this.props.history} level={2} >

            <Route exact path='/timer' render={(props) =>
                <TimerList {...props} deleteTimer={this.deleteTimer} timers={timers} enableTimer={this.enableTimer}  updateCurrentTimer={this.updateCurrentTimer} />
            }
            />

            <Route exact path='/timer/detail' render={(props) =>
                <TimerDetail {...props} CmdComponent={cmdIsPage ? null : detailTimerSetting } deleteTimer={this.deleteTimer}  descFunc={descFunc} currentTimer={currentTimer} updateCurrentTimer={this.updateCurrentTimer} addOrEditTask={this.addOrEditTask} />
            }
            />

            <Route exact path='/timer/repeat' render={(props) => {
                return <TimerRepeat {...props} currentTimer={currentTimer} updateCurrentTimer={this.updateCurrentTimer} />
            } }
            
            />
            <Route exact path='/timer/setting' render={(props) =>
                <WrapTimerSetting {...props} cmdIsPage={cmdIsPage} descFunc= {descFunc} component={TimerSetting} updateCurrentTimer={this.updateCurrentTimer} currentTimer={currentTimer}/>
            }
            />
            <Route exact path='/timer/setTaskName' render={(props) =>
                <TimerSetTaskName {...props}  updateCurrentTimer={this.updateCurrentTimer} currentTimer={currentTimer}/>
            }
            />
            <Route exact path='/timer/notice' render={(props) =>
                <TimerNotice {...props} currentTimer={currentTimer} updateCurrentTimer={this.updateCurrentTimer} />
            }
            />
            <Route exact path='/timer/records' render={(props) =>
                <TimerExecuteRecords {...props} />
            }
            />

        </Switch>
    }
})

















// timerSetting的高级组件

class WrapTimerSetting extends React.Component{

    static defaultProps = {
        component: TimerSetting
    }

    constructor(props){
        super(props);
        this.state = {
            cmd: this.props.currentTimer.cmd
        }
    }
    
    componentDidMount() {
        this.initNativeBarEvent();
    }

    initNativeBarEvent = () => {
        setNavbar("detailOther")
        window.updateTaskState = () => {
            const {descFunc} = this.props
            this.props.updateCurrentTimer(
                {cmd: this.state.cmd,task_name:descFunc( this.state.cmd)},
                this.props.history.goBack()
            )
        }
    }
    
    updateCmd = (cmd)=>{
        this.setState({
            cmd
        })
    }
 
  
    render(){
        const { component: TimerSetting } = this.props;
        return <TimerSetting updateCmd={this.updateCmd} cmd={this.state.cmd}/>
    }
}
