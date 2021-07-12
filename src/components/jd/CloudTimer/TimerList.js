import React from 'react';
import { injectIntl } from 'react-intl';
import TimerCard from './TimerCard';
import style from './SDKTimer.less';
import { cmdName, getTaskExpired, weekChinese } from './util';
import{ setNavbar } from "./api"
import { search,backIcon } from './icons';


class TimerList extends React.PureComponent {

    state = {
        layer: false,
    }
    editTimer=null;

    componentDidMount() {
        setNavbar('timerList')
    }

    changeLayerState = () => {
        this.setState({
            layer: !this.state.layer
        })
    }

    rightTimerCardClick = (timer) => {
        this.changeLayerState()
        this.editTimer= timer;
    }

    editClick = () => {
        const { history } = this.props;
        this.props.updateCurrentTimer(this.editTimer,()=>history.push("/timer/detail"))
    }

    deleteClick = () => {
        this.changeLayerState();
        this.props.deleteTimer(this.editTimer)
    }

    swichClick = (timer) => {
        this.props.enableTimer(timer)
    }

    simplePannelClick = () => {
        this.setState({
            layer: false
        }, () => {
            setTimeout(() => {
                this.props.history.push("/timer/records")
            }, 0)
        })
    }

    render() {
        const {timers} = this.props;
        const formatMessage=(mes)=>cmdName.call(this,"jd.timer."+mes)
        return <div>
            <SimplePannel name={formatMessage("executeRecords")} onClick={this.simplePannelClick} />
            {
                timers && timers.map((timer, key) => {
                    const expired=getTaskExpired(timer.next_left_minutes,timer.isPeriod);
                    return <TimerCard 
                                {...timer}
                                timeMH={timer.time.format("HH:mm")} 
                                desc={weekChinese(timer.repeat)}
                                name = {timer.task_name}
                                key={key} 
                                rightClick={this.rightTimerCardClick.bind(this, timer)}
                                swichClick={this.swichClick.bind(this, timer, timer.task_status === "1")}
                                enable={timer.task_status*1 == 1} 
                                expired={expired}
                            />
                })
            }
            {timers.length===0 && <div className={style.search}>
                {search}
                <div>
                    {formatMessage("noTimingIsSetForTheTime")}
                </div>
                <div>
                    {formatMessage("addNewTimer")}
                </div>
            </div>}
            {this.state.layer && <SaveOrUpdatePanel cancelClick={this.changeLayerState} editClick={this.editClick} deleteClick={this.deleteClick} formatMessage={formatMessage}/>}
        </div>
    }
}


const SimplePannel = ({ name, desc, onClick,back=backIcon }) => {
    return <div className={style.simplePannel} onClick={onClick} style={{borderRadius:"0.2rem",margin:"0.2rem 0.2rem",overflow:"hidden"}}>
        <div><span>{name}</span></div>
        <div><span>{desc}</span>{back}</div>
    </div>
}


const SaveOrUpdatePanel = ({ editClick, deleteClick, cancelClick,formatMessage }) => {
    return <React.Fragment>
        <div className={style.saveOrUpdatePanel}>
            <div onClick={deleteClick}>{formatMessage("delete")}</div>
            <div onClick={editClick}>{formatMessage("edit")}</div>
            <div onClick={cancelClick}>{formatMessage("cancel")}</div>
        </div>
        <div className={style.layer}></div>
    </React.Fragment>
}

export default injectIntl(TimerList);