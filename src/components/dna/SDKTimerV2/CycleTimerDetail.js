import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment'
import Modal from '../../Modal';
import BottomButton from '../BottomButton'
import style from './SDKTimer.less'
import Toast from '../../Toast';
import NavBar from '../NavBar';
import Page from '../Page';
import {repeatDesc, calDelta} from './timer-util'
import { injectIntl, FormattedMessage } from 'react-intl';
import {isEmpty} from  '../../utils'
import sdk from "broadlink-jssdk/jssdk";
import connect from "react-redux/es/connect/connect";
import {dnaSelectors} from "../../reducers";
import {addOrUpdateTimer, setCurrentType, updateCurrentTimer} from "../../actions/timer";

const DEFAULT_DURATION=1;    //默认持续时间为30分钟
const {TYPE_COMMON,TYPE_PERIOD,Timer} =sdk.platformSDK.taskV2;

function Top() {
    return (
        <div className={style["loop-top"]}>
            <div className={style["top-fir"]}>
                <div className={style["top-pwr"]}>
                    <div><FormattedMessage id="internal.SDKTimerV2.commandOn"/><i className={style.bckThemeColor}></i></div>
                    <div><FormattedMessage id="internal.SDKTimerV2.commandOff"/><i></i></div>
                    <div><FormattedMessage id="internal.SDKTimerV2.commandOn"/><i className={style.bckThemeColor}></i></div>
                    <div><FormattedMessage id="internal.SDKTimerV2.commandOff"/><i></i></div>
                    <div><FormattedMessage id="internal.SDKTimerV2.commandOn"/><i className={style.bckThemeColor}></i></div>
                    <div className={style["bg-div"]}></div>
                </div>
                <div className={style["top-path"]}></div>
            </div>
            <div className={style["top-sec"]}>
                <p><FormattedMessage id="internal.SDKTimerV2.recycleChangeText"/></p>
                <p><FormattedMessage id="internal.SDKTimerV2.setTowMost"/></p>
            </div>
        </div>

    );
}

function SettingItem({title,content,onClick}) {

    return (
        <div onClick={onClick} className={style.list}>
            <span>{title}</span>
            <p>
                <span>{content}</span>
                <i className={style.arrow}></i>
            </p>
        </div>

    );
}

class CycleTimerDetail extends React.PureComponent {
    static propTypes = {
        //当前定时
        timer:PropTypes.instanceOf(Timer),
        //定时内容描述方法
        desc:PropTypes.func,
        //是否显示常规定时入口
        showCommonEntry:PropTypes.bool
    };

    static defaultProps = {
        desc:cmd=>JSON.stringify(cmd)
    };

    constructor(props) {
        super(props);

        this.commandDesc = this.commandDesc.bind(this);   //显示操作命令
        this.deleteTimer = this.deleteTimer.bind(this); //删除循环定时
        this.durationTimeDesc=this.durationTimeDesc.bind(this); //显示持续时间
    };

    componentDidMount(){
        //不需要初始化，SDK中已做
        // this.init();
    }

    init=()=>{  //初始化timer默认值
        const {timer,timerHandler} =this.props;
        if(!timer.endtime){ //结束时间
            timer.endtime=timer.time.clone().add(2,'hour'); //结束时间默认为开始时间加2小时
            timerHandler('UPDATE', {endtime: timer.endtime});
        }
        if(timer.cmd1duration==null){    //操作一默认时间为30分钟,时间可为0
            timer.cmd1duration=DEFAULT_DURATION*60;
            timerHandler('UPDATE', {cmd1duration:timer.cmd1duration});
        }
        if(timer.cmd2duration==null){    //操作二默认时间为30分钟
            timer.cmd2duration=DEFAULT_DURATION*60;
            timerHandler('UPDATE', {cmd2duration:timer.cmd2duration});
        }
    };

    save = ()=> {  //保存循环定时
        const {save,history,timer,intl:{formatMessage}} =this.props;
        if(isEmpty(timer.cmd1)||isEmpty(timer.cmd2)){  //两个操作都必须设置
            Toast.info(formatMessage({id:'internal.SDKTimerV2.selectExecute'}));
            return ;
        }
        save({callback:()=>history.goBack()});
    };

    formatTime = (time) => {
        const {intl:{formatMessage}} = this.props
        let timeText = '';
        if (time.sun) {
            const minutes = time.duration.asMinutes();
            timeText = formatMessage({id: 'internal.SDKTimerV2.sunDelta'}, {sun: time.sun.split('')[0], delta: calDelta(parseInt(time.sun.split('')[1] + minutes)), minutes});
        } else {
            timeText = time.moment.format("HH:mm");
        }
        return timeText
    }

    timeDesc = (time)=> {   //显示开始及结束时间
        if (time) {
            return this.formatTime(time) ;
        } else {
            return moment().format("HH:mm");    //否则返回当前时间
        }

    };

    durationTimeDesc=(time)=>{  //格式化时间样式
        const {formatMessage} = this.props.intl;
        return formatMessage({id:'internal.SDKTimerV2.pickerMinute'},{minutes:Math.floor(time.asMinutes())});
    };

    commandDesc(command) {  //执行开关的命令
        const {desc} = this.props;
        return desc(command, 'detail'); //后面的参数有何用？detail无用
    }

    repeatDesc() {   //重复设置
        const {timer,intl:{formatMessage}} = this.props;
        return repeatDesc(timer.stime.repeat, formatMessage)
    }

    deleteTimer = ()=> { //删除定时
        const {formatMessage} = this.props.intl;
        Modal.confirm(formatMessage({id:'internal.SDKTimerV2.confirmDelete'}), ()=> {
            const {timerHandler,timer,history} =this.props;
            timerHandler('DELETE', {
                type: timer.type,
                index: timer.index,
                callback: ()=> history.goBack()
            });
            return true;
        });
    };

    contentDesc(flag){  //操作命令显示
        const {timer} =this.props;
        if(flag==='cmd1'){
            if(!isEmpty(timer.cmd1)){ //设置后才显示持续时间
                return this.commandDesc(timer.cmd1)+','+this.durationTimeDesc(timer.time1);
                //return this.commandDesc(timer.status)+','+durationHumanize(moment.duration(timer.cmd1duration*1000));
            }else {
                return this.commandDesc(timer.cmd1);
            }
        }else {
            if(!isEmpty(timer.cmd2)){
                return this.commandDesc(timer.cmd2)+','+this.durationTimeDesc(timer.time2);
            }else {
                return this.commandDesc(timer.cmd2);
            }
        }
    }

    render() {
        const {timer,history,intl:{formatMessage},showCommonEntry,setCurrentType,commonType} =this.props;  //如果是添加循环定，timer为定时设置界面时间插件设置的时间
        const repeatDesc = this.repeatDesc();   //重复类型
        const right = showCommonEntry ? [
            {
                text:formatMessage({id:'internal.SDKTimerV2.commonTiming'}),
                handler:()=>{
                    setCurrentType(commonType);
                    history.replace('/timer/detail');
                }
            }
        ]:[];
        return (
            <Page saveBottom>
                <NavBar title={formatMessage({id:'internal.SDKTimerV2.recycleTiming'})} right={right}/>
                <Top/>
                <div className={style.listBox+" "+style.mt20}>
                    <SettingItem title={formatMessage({id:'internal.SDKTimerV2.startTime'})} content={this.timeDesc(timer.stime)}
                                 onClick={()=>history.push('/timer/time/start')}/>
                    <SettingItem title={formatMessage({id:'internal.SDKTimerV2.endTime'})} content={this.timeDesc(timer.etime)}
                                 onClick={()=>history.push('/timer/time/end')}/>
                </div>

                <div className={style.listBox+" "+style.mt20}>
                    <SettingItem title={formatMessage({id:'internal.SDKTimerV2.operateOne'})} content={this.contentDesc('cmd1')}
                                 onClick={()=>history.push('/timer/cycle-command/cmd1')}/>
                    <SettingItem title={formatMessage({id:'internal.SDKTimerV2.operateTwo'})} content={this.contentDesc('cmd2')}
                                 onClick={()=>history.push('/timer/cycle-command/cmd2')}/>
                </div>

                <div className={style.listBox+" "+style.mt20}>
                    <SettingItem title={formatMessage({id:'internal.SDKTimerV2.repeatSetting'})} content={repeatDesc}
                                 onClick={()=>history.push('/timer/repeat')}/>
                </div>

                {
                    timer.id>=0 &&
                    <div className={style.saveBox+' '+style.delBox} onClick={this.deleteTimer}><FormattedMessage id="internal.SDKTimerV2.delete"/></div>
                }
                <BottomButton text={formatMessage({id:'internal.SDKTimerV2.timerSave'})} onClick={this.save} enable={(!isEmpty(timer.cmd1)&&(!isEmpty(timer.cmd2)))}/>
            </Page>
        );
    }
}

export default connect(state => {
        const common = dnaSelectors.timerSelectors.pickAvailableType(state,TYPE_COMMON,TYPE_PERIOD);
        const timer = dnaSelectors.timerSelectors.getCurrent(state);
        return {
            timer,
            showCommonEntry:!!common && !(timer.id>=0),
            commonType:common
        }
    },
    {
        setCurrentType,
        updateTimer: updateCurrentTimer,
        save:addOrUpdateTimer
    })(injectIntl(CycleTimerDetail));
