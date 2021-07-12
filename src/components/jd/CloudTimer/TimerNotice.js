import React from 'react';
import { injectIntl } from 'react-intl';
import style from './SDKTimer.less';
import {cmdName} from './util';
import {crossOut} from './icons';
import{ setNavbar } from "./api"

const NOTIFICATION_TYPE = {
    NOTICE: 1,
    NOTIFICATION_FAILURE: 0,
    NOT_NOTIFIED: -1,
  };
class TimerSetting extends React.PureComponent {

    state={
        noticeType:this.props.currentTimer.pmg_setting * 1
    }

    componentDidMount(){
        this.initNativeBarEvent();
    }

    initNativeBarEvent = () => {
        setNavbar("detailOther")
        window.updateTaskState = () => {
            this.submit();
        }
    }
    
    submit = () => {
        this.props.updateCurrentTimer(
            {pmg_setting:this.state.noticeType},
            ()=>this.props.history.goBack()      //callback
        )
    }

    noticeClick=(type)=>{
        this.setState({
            noticeType:type
        })
    }

    render() {
        const {noticeType} = this.state;
        const {NOTICE,NOTIFICATION_FAILURE,NOT_NOTIFIED} = NOTIFICATION_TYPE;
        const formatMessage=(mes)=>cmdName.call(this,"jd.timer."+mes)

        return <div>
            <div className={style.notice}>
                <div onClick={this.noticeClick.bind(this,NOTICE)}>{formatMessage("notifyAll")}<span style={{display:noticeType===NOTICE?"":"none"}}>{crossOut}</span></div>
                <hr></hr>
                <div onClick={this.noticeClick.bind(this,NOTIFICATION_FAILURE)}>{formatMessage("ExecutionOfFailureNotificationsOnly")}<span style={{display:noticeType===NOTIFICATION_FAILURE?"":"none"}}>{crossOut}</span></div>
                <hr></hr>
                <div onClick={this.noticeClick.bind(this,NOT_NOTIFIED)}>{formatMessage("noNotice")}<span style={{display:noticeType===NOT_NOTIFIED?"":"none"}}>{crossOut}</span></div>
            </div>
        </div>
    }
}

export default injectIntl(TimerSetting);