import React from 'react';
import { injectIntl } from 'react-intl';
import TimePicker from '../../../components/TimePicker';
import style from './SDKTimer.less';
import moment, { isMoment } from 'moment';
import {
    cmdName,
} from './util';
import{ setNavbar } from "./api"

const DeletTimer = ({ show, onClick, formatMessage }) => {
    return <div className={style.deletTimer} style={{ display: show ? "" : "none" }} onClick={onClick}>{formatMessage("deleteTimer")}</div>
}

const simplePannelDate = ({ history, currentTimer, formatMessage, descFunc, CmdComponent }) => {
    return[
        {
            name: formatMessage("repeat"), desc:currentTimer.weekDesc(), onClick: () => {
                history.push("/timer/repeat")
            }
        },
        {
            name: formatMessage("timerTask"), desc:descFunc(currentTimer.cmd), onClick: () => {
                if(CmdComponent) return;
                history.push("/timer/setting")
            },
            CmdComponent
        },
        {
            name: formatMessage("timerName"), desc: currentTimer.task_name, onClick: () => {
                history.push("/timer/setTaskName")
            }
        },
        {
            name: formatMessage("executionResultNotification"), desc: currentTimer.pmgDesc(), onClick: () => {
                history.push("/timer/notice")
            }
        }
    ]
}

const SimplePannel = ({ name, desc, onClick, CmdComponent }) => {
    return <div style={{borderRadius:"0.2rem",margin:"0.2rem 0.2rem",overflow:"hidden"}}>
                <div className={style.simplePannel} onClick={ CmdComponent ? null : onClick }>
                    <div><span>{name}</span></div> 
                    { !CmdComponent && <div><span>{desc}</span>{backIcon}</div> }
                </div>
                {CmdComponent && <CmdComponent/>}
            </div>
}

const backIcon = (
    <svg t="1513131888484" className="icon" viewBox="0 0 1024 1024" version="1.1" p-id="35302" width="200" height="200">
        <path
            d="M451.265164 837.818182l-330.472728-325.818182 330.472728-325.818182a46.545455 46.545455 0 0 0 0-69.818182 50.269091 50.269091 0 0 0-70.749091 0L14.6688 477.090909a48.872727 48.872727 0 0 0 0 69.818182l365.847273 361.192727a49.803636 49.803636 0 0 0 35.374545 14.429091 49.803636 49.803636 0 0 0 35.374546-14.429091 46.545455 46.545455 0 0 0 0-69.818182z"
            fill={'#999999'} p-id="35303"></path>
    </svg>
);

class TimerDetail extends React.PureComponent {

    adding = false;

    componentDidMount() {
        this.initNativeBarEvent();
    }
  
    initNativeBarEvent = () => {
        const { currentTimer } = this.props;
        setNavbar("timerDetail",currentTimer.task_id ? true : false )
        window.saveOrUpdateTask = () => {
            this.submit()    
        }
    }

    submit = () => {
        if(this.adding){
            return
        }
        this.adding = true;
        this.props.addOrEditTask().then(()=> this.props.history.goBack()).finally(()=> this.adding = false);
    }
    
    changeTimerPickerVal = (value) => {
        if (!isMoment(value)) return
        if (value.isBefore(moment())) { value.add(1, 'day') };
        const { updateCurrentTimer } = this.props;
        updateCurrentTimer({time:value})
    }

    deleteClick = () => {
        const { currentTimer, deleteTimer,history } = this.props;
        deleteTimer(currentTimer,()=>history.goBack())
    }
   
    render() {
        const { history, currentTimer, descFunc, CmdComponent } = this.props;
        const formatMessage = (mes) => cmdName.call(this, "jd.timer." + mes);
        return <div >
            <div style={{ padding: "0.2rem" }}>
                <TimePicker onChange={this.changeTimerPickerVal} defaultValue={currentTimer.time} hourText="" minuteText=""/>
            </div>
            {
                simplePannelDate({ history, currentTimer, formatMessage, descFunc, CmdComponent  }).map((data, key) => {
                    return <SimplePannel {...data} key={key} desc={data["desc"]} />
                })
            }
            <DeletTimer show={currentTimer.task_id} onClick={this.deleteClick} formatMessage={formatMessage} />
        </div>
    }
}

export default injectIntl(TimerDetail);