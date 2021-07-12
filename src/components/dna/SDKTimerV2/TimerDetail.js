import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment'
import Modal from '../../Modal';
import Toast from '../../Toast';
import BottomButton from '../BottomButton'
import Page from '../Page';
import style from './SDKTimer.less'
import {repeatDesc} from './timer-util'
import NavBar from '../NavBar';
import { injectIntl, FormattedMessage } from 'react-intl';
import {isEmpty} from  '../../utils'
import sdk from 'broadlink-jssdk';
import connect from "react-redux/es/connect/connect";
import { setCurrentType,updateCurrentTimer,addOrUpdateTimer} from "../../actions/timer";
import {dnaSelectors} from "../../reducers";
import TimePickerAdvanced from './TimePickerAdvanced'

const {TYPE_CYCLE,Timer} =sdk.platformSDK.taskV2;

function SettingItem({title,content,onClick}) {
    
    return (
      <div onClick={onClick} className={style.list}>
          <span>{title}</span>
          <p>
              <span>{content}</span>
              <i  className={style.arrow}></i>
          </p>
      </div>

    );
}

class TimerDetail extends React.PureComponent {
    static propTypes = {
        //当前定时
        timer:PropTypes.instanceOf(Timer),
        //是否支持循环定时
        showCycleEntry:PropTypes.bool,
        //定时内容描述方法
        desc:PropTypes.func,
    };

    static defaultProps = {
        desc:cmd=>JSON.stringify(cmd)
    };

    constructor(props) {
        super(props);
        this.save= this.save.bind(this);
    }

    save(){
        const {save,history,timer,intl:{formatMessage}} =this.props;

        if(!isEmpty(timer.cmd)){
            save({callback:()=>history.goBack()});
        }else {
            Toast.info(formatMessage({id:'internal.SDKTimerV2.selectExecute'}));
        }

    }

    commandDesc(){
        const {timer,desc} = this.props;
        return desc(timer.cmd,'detail');
    }

    repeatDesc(){
        const {timer, intl:{formatMessage}} = this.props;
        return repeatDesc(timer.time.repeat, formatMessage);
    }

    dateDesc(){
        const {timer,intl:{formatMessage}} =this.props;
        if(timer.time.moment.isSame(moment(),'day')){
            return formatMessage({id:'internal.SDKTimerV2.today'});
        } else if (timer.time.moment.isSame(moment().add(1, 'days'),'day')) {
            return formatMessage({id:'internal.SDKTimerV2.tomorrow'});
        } else {
            return timer.time.moment.format('MM-DD');
        }
    }

    deleteTimer = ()=>{
        const {formatMessage} = this.props.intl;
        Modal.confirm(formatMessage({id:'internal.SDKTimer.confirmDelete'}),()=>{
            const {timerHandler,timer,history} =this.props;
            timerHandler('DELETE',{
                type:timer.type,
                index:timer.index,
                callback:()=> history.goBack(),
                refresh:true
            });
            return true;
        });
    };

    timeUpdate = (timeObj) => {
        this.props.updateTimer(
            {
                time: timeObj
            }
        )
    }

    render() {
        const {timer,history,intl:{formatMessage},setCurrentType,currentLocation} =this.props;
        const repeatDesc = this.repeatDesc();
        const dateDesc = this.dateDesc();
        const rightBtn=!this.props.showCycleEntry?[]:[{
            text:formatMessage({id:'internal.SDKTimerV2.recycleTiming'}),
            handler:()=>{
                setCurrentType(TYPE_CYCLE);
                history.replace('/timer/recycle');
            }
        }];  //是否显示循环按钮
        const canSave = !isEmpty(timer.cmd) && !(timer.time.sun && (!currentLocation.longitude || !currentLocation.latitude))
        return (
            <Page saveBottom>
                <NavBar title={formatMessage({id:'internal.SDKTimerV2.timingSet'})} right={rightBtn}/>

                <TimePickerAdvanced supportSunriseAndSunset={this.props.supportSunriseAndSunset} onChange={this.timeUpdate} time={timer.time}></TimePickerAdvanced>

                <div className={style.listBox+" "+style.mt20}>
                    <SettingItem title={formatMessage({id:'internal.SDKTimerV2.repeatSetting'})} content={repeatDesc} onClick={()=>history.push('/timer/repeat')}/>
                    {
                        false &&
                        <SettingItem title={formatMessage({id:'internal.SDKTimerV2.date'})} content={dateDesc} onClick={()=>history.push('/timer/date')}/>
                    }
                    <SettingItem onClick={()=>history.push('/timer/command')} title={formatMessage({id:'internal.SDKTimerV2.operation'})}  content={this.commandDesc()}/>
                </div>
                {
                    timer.index !=null &&
                    <div className={style.saveBox+' '+style.delBox} onClick={this.deleteTimer}><FormattedMessage id="internal.SDKTimerV2.delete"/></div>
                }
                <BottomButton text={formatMessage({id:'internal.SDKTimerV2.timerSave'})}  onClick={this.save} enable={canSave}/>
            </Page>
        )
    }
}

TimerDetail = connect((state,ownProps)=>{
    const cycle = dnaSelectors.timerSelectors.pickAvailableType(state,TYPE_CYCLE);
    /*
            *TODO?
            *
            export const getCurrentTimer = createSelector(
                timerSelectors.getCurrent, timerSelectors.getSunTable,
                (timer={}, table) => overrideSunMoment(timer, table, 'time', 'stime', 'etime')
            );
            * */
    const timer = dnaSelectors.timerSelectors.getCurrent(state);
    return {
        timer,
        showCycleEntry:ownProps.supportCycle && cycle && !(timer.id>=0),
        currentLocation: dnaSelectors.timerSelectors.getCurrentLocation(state),
    }
},{setCurrentType,updateTimer:updateCurrentTimer,save:addOrUpdateTimer})(TimerDetail);

export default injectIntl(TimerDetail);