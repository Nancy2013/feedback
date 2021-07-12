import React from 'react';
import PropTypes from 'prop-types';
import TimePicker from '../../TimePicker'

import moment from 'moment'
import Modal from '../../Modal';
import Toast from '../../Toast';
import BottomButton from '../BottomButton'
import Page from '../Page';

import style from './SDKTimer.less'

import {repeatDesc,defaultTimer} from './timer-util'
import NavBar from '../NavBar';
import { injectIntl, FormattedMessage } from 'react-intl';
import {isEmpty} from  '../../utils'

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

export default injectIntl(class extends React.PureComponent {
    static defaultProps = {
        timer:defaultTimer()
    };

    constructor(props) {
        super(props);

        this.timeUpdate= this.timeUpdate.bind(this);
        this.save= this.save.bind(this);
    }

    timeUpdate(date){
        // const {timer,timerHandler} =this.props;
        //
        // const justTime = moment(date).format("HH:mm:ss");
        // const justDate = timer.time.format("YYYY-MM-DD");
        //
        // timerHandler('UPDATE',{time:moment(justDate+' '+justTime,"YYYY-MM-DD HH:mm:ss")});

        const {timer,timerHandler} =this.props;
        date = moment(date);
        const time = moment({hour: date.hour(), minute: date.minute()});
        if(time.isBefore(moment())){
            time.add(1,'days');
        }
        timerHandler('UPDATE',{time});
    }

    save(){
        const {timerHandler,history,timer,intl:{formatMessage}} =this.props;
        const {repeat} = timer||{};
        const type= repeat && repeat.length>0 ? 2:0;

        if(!isEmpty(timer.status)){
            timerHandler('SAVE',{confirm :true,callback:()=>history.goBack(),type});
        }else {
            Toast.info(formatMessage({id:'internal.SDKTimer.selectExecute'}));
        }

    }

    commandDesc(){
        const {timer,desc} = this.props;
        return desc(timer.status,'detail');
    }

    repeatDesc(){
        const {timer:{repeat}, intl:{formatMessage}} = this.props
        return repeatDesc(repeat, formatMessage);
    }

    dateDesc(){
        const {timer,intl:{formatMessage}} =this.props;

        if(timer.time.isSame(moment(),'day')){
            return formatMessage({id:'internal.SDKTimer.today'});
        } else if (timer.time.isSame(moment().add(1, 'days'),'day')) {
            return formatMessage({id:'internal.SDKTimer.tomorrow'});
        } else {
            return timer.time.format('MM-DD');
        }
    }

    deleteTimer = ()=>{
        const {formatMessage} = this.props.intl
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

    render() {
        const {timer,history,match,intl:{formatMessage}} =this.props;
        const isOnlyOnce = !timer.repeat || timer.repeat.length===0;
        const repeatDesc = this.repeatDesc();
        const dateDesc = this.dateDesc();
        const rightBtn=!this.props.supportRecycle?[]:[{
            text:formatMessage({id:'internal.SDKTimer.recycleTiming'}),
            handler:()=>history.replace('/timer/recycle')
        }];  //是否显示循环按钮
        return (
            <Page saveBottom>
                <NavBar title={formatMessage({id:'internal.SDKTimer.timingSet'})} right={rightBtn}/>
                <TimePicker onChange={this.timeUpdate} defaultValue={(timer.time||moment().add(1,'minutes'))}/>

                <div className={style.listBox+" "+style.mt20}>
                    <SettingItem title={formatMessage({id:'internal.SDKTimer.repeatSetting'})} content={repeatDesc} onClick={()=>history.push('/timer/repeat')}/>
                    {
                        false &&
                        <SettingItem title={formatMessage({id:'internal.SDKTimer.date'})} content={dateDesc} onClick={()=>history.push('/timer/date')}/>
                    }
                    <SettingItem onClick={()=>history.push('/timer/command')} title={formatMessage({id:'internal.SDKTimer.operation'})}  content={this.commandDesc()}/>
                </div>
                {
                    timer.index !=null &&
                    <div className={style.saveBox+' '+style.delBox} onClick={this.deleteTimer}><FormattedMessage id="internal.SDKTimer.delete"/></div>
                }
                <BottomButton text={formatMessage({id:'internal.SDKTimer.timerSave'})}  onClick={this.save} enable={!isEmpty(timer.status)}/>
            </Page>
        )
    }
})