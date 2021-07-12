import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment'
import Modal from '../../Modal';
import BottomButton from '../BottomButton'

import style from './SDKTimer.less'
import Toast from '../../Toast';
import NavBar from '../NavBar';
import Page from '../Page';
import {repeatDesc,defaultTimer} from './timer-util'
import { injectIntl, FormattedMessage } from 'react-intl';
import {isEmpty} from  '../../utils'
const DEFAULT_DURATION=1;    //默认持续时间为30分钟


function Top() {
    return (
        <div className={style["loop-top"]}>
            <div className={style["top-fir"]}>
                <div className={style["top-pwr"]}>
                    <div><FormattedMessage id="internal.SDKTimer.commandOn"/><i className={style.bckThemeColor}></i></div>
                    <div><FormattedMessage id="internal.SDKTimer.commandOff"/><i></i></div>
                    <div><FormattedMessage id="internal.SDKTimer.commandOn"/><i className={style.bckThemeColor}></i></div>
                    <div><FormattedMessage id="internal.SDKTimer.commandOff"/><i></i></div>
                    <div><FormattedMessage id="internal.SDKTimer.commandOn"/><i className={style.bckThemeColor}></i></div>
                    <div className={style["bg-div"]}></div>
                </div>
                <div className={style["top-path"]}></div>
            </div>
            <div className={style["top-sec"]}>
                <p><FormattedMessage id="internal.SDKTimer.recycleChangeText"/></p>
                <p><FormattedMessage id="internal.SDKTimer.setTowMost"/></p>
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

export default injectIntl(class extends React.PureComponent {
    static defaultProps = {
        timer: defaultTimer()    //0：定时任务，2：周期任务，循环定时？
    };

    constructor(props) {
        super(props);

        this.timeDesc = this.timeDesc.bind(this);    //显示开始结束时间
        this.commandDesc = this.commandDesc.bind(this);   //显示操作命令
        this.deleteTimer = this.deleteTimer.bind(this); //删除循环定时
        this.durationTimeDesc=this.durationTimeDesc.bind(this); //显示持续时间
        this.save = this.save.bind(this);
        this.init=this.init.bind(this);  //初始化;
    };

    componentDidMount(){
        this.init();
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
        const {timerHandler,history,timer,intl:{formatMessage}} =this.props;
        const type=3;   //type含义 0: 普通定时;   1: 延时;  2: 周期定时;    3: 循环定时;    4: 防盗
        if(isEmpty(timer.status)||isEmpty(timer.status2)){  //两个操作都必须设置
            Toast.info(formatMessage({id:'internal.SDKTimer.selectExecute'}));
            return ;
        }
        timerHandler('SAVE',{confirm :true,callback:()=>history.goBack(),type});
    };

    timeDesc = (time)=> {   //显示开始及结束时间
        if (time) {
            return time.format("HH:mm");    //编辑时返回已设置的时间
        } else {
            return moment().format("HH:mm");    //否则返回当前时间
        }

    };

    durationTimeDesc=(time)=>{  //格式化时间样式
        const {formatMessage} = this.props.intl;
        return formatMessage({id:'internal.SDKTimer.pickerMinute'},{minutes:moment.duration(time*1000).asMinutes()});
    };

    commandDesc(command) {  //执行开关的命令
        const {desc} = this.props;
        return desc(command, 'detail'); //后面的参数有何用？detail无用
    }

    repeatDesc() {   //重复设置
        const {timer:{repeat},intl:{formatMessage}} = this.props
        return repeatDesc(repeat, formatMessage)
    }

    deleteTimer = ()=> { //删除定时
        const {formatMessage} = this.props.intl        
        Modal.confirm(formatMessage({id:'internal.SDKTimer.confirmDelete'}), ()=> {
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
            if(!isEmpty(timer.status)){ //设置后才显示持续时间
                return this.commandDesc(timer.status)+','+this.durationTimeDesc(timer.cmd1duration);
                //return this.commandDesc(timer.status)+','+durationHumanize(moment.duration(timer.cmd1duration*1000));
            }else {
                return this.commandDesc(timer.status);
            }
        }else {
            if(!isEmpty(timer.status2)){
                return this.commandDesc(timer.status2)+','+this.durationTimeDesc(timer.cmd2duration);
            }else {
                return this.commandDesc(timer.status2);
            }
        }
    }

    render() {
        const {timer,history,intl:{formatMessage}} =this.props;  //如果是添加循环定，timer为定时设置界面时间插件设置的时间
        const repeatDesc = this.repeatDesc();   //重复类型
        return (
            <Page saveBottom>
                <NavBar title={formatMessage({id:'internal.SDKTimer.recycleTiming'})} right={[
                    {
                        text:formatMessage({id:'internal.SDKTimer.commonTiming'}),
                        handler:()=>history.replace('/timer/detail')
                    }
                ]}/>
                <Top/>
                <div className={style.listBox+" "+style.mt20}>
                    <SettingItem title={formatMessage({id:'internal.SDKTimer.startTime'})} content={this.timeDesc(timer.time)}
                                 onClick={()=>history.push('/timer/time/start')}/>
                    <SettingItem title={formatMessage({id:'internal.SDKTimer.endTime'})} content={this.timeDesc(timer.endtime)}
                                 onClick={()=>history.push('/timer/time/end')}/>
                </div>

                <div className={style.listBox+" "+style.mt20}>
                    <SettingItem title={formatMessage({id:'internal.SDKTimer.operateOne'})} content={this.contentDesc('cmd1')}
                                 onClick={()=>history.push('/timer/cycle-command/cmd1')}/>
                    <SettingItem title={formatMessage({id:'internal.SDKTimer.operateTwo'})} content={this.contentDesc('cmd2')}
                                 onClick={()=>history.push('/timer/cycle-command/cmd2')}/>
                </div>

                <div className={style.listBox+" "+style.mt20}>
                    <SettingItem title={formatMessage({id:'internal.SDKTimer.repeatSetting'})} content={repeatDesc}
                                 onClick={()=>history.push('/timer/repeat')}/>
                </div>

                {
                    timer.index != null &&timer.type===3&&
                    <div className={style.saveBox+' '+style.delBox} onClick={this.deleteTimer}><FormattedMessage id="internal.SDKTimer.delete"/></div>
                }
                <BottomButton text={formatMessage({id:'internal.SDKTimer.timerSave'})} onClick={this.save} enable={(!isEmpty(timer.status)&&(!isEmpty(timer.status2)))}/>
            </Page>
        );
    }
})