import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../../Modal';
import moment from 'moment'
import SwitchButton from '../SwitchButton'
import png from './images/add-time.png'
import style from './SDKTimer.less'
import {repeatDesc,calDelta} from './timer-util'
import NavBar from '../NavBar';
import LoadingPage from '../LoadingPage';
import FixBottom from '../FixBottom';
import Page from '../Page';
import failIcon from './images/load-fail.png';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect} from 'react-redux';
import { dnaSelectors} from '../../reducers';
import * as actions from '../../actions/timer';
import sdk from 'broadlink-jssdk'
import MutexSlipItem from './MutexSlipItem';

const {TYPE_COMMON,TYPE_PERIOD,TYPE_CYCLE,TYPE_RAND,Timer} =sdk.platformSDK.taskV2;

function EmptyList({add}) {

    return (
        <div className={style.addTime}>
            <div className={style.topBox}>
                <img src={png} alt=""/>
                <p><FormattedMessage id="internal.SDKTimerV2.noTimer"/></p>
            </div>
            <div onClick={add} className={style.radiusBox}>
            <FormattedMessage id="internal.SDKTimerV2.addTimer"/>
            </div>
        </div>
    );
}

function LoadFailed({reload}){
    return (
        <div className={style.failBox}>
            <div className={style.topBox}>
                <img src={failIcon} alt=""/>
                <p><FormattedMessage id="internal.SDKTimerV2.getTimerFailed"/></p>
            </div>
            <div onClick={()=>reload()} className={style.radiusBox}>
                <FormattedMessage id="internal.SDKTimerV2.reload"/>
            </div>
        </div>
    );
}

const TimerItem = injectIntl(({timer, toggle, onClick, desc, intl: {formatMessage},deleteTimer}) => {
    const enable = (()=>{
        let enable ;
        if(!timer.isRepeated()){
            let time = timer.time || timer.etime;
            enable = timer.en && time.moment.isAfter(moment());
        }else{
            enable = timer.en;
        }
        return enable;
    })();

    const switchClick = (enable,event)=>{
        event.stopPropagation();
        const clone = timer.clone();
        clone.en = !enable;
        toggle(clone);
    };

    const formatTime = (time) => {
        let timeText = '';
        if (time.sun) {
            const minutes = time.duration.asMinutes();
            timeText = formatMessage({id: 'internal.SDKTimerV2.sunDelta'}, {sun: time.sun.split('')[0], delta: calDelta(parseInt(time.sun.split('')[1] + minutes)), minutes});
        } else {
            timeText = time.moment.format("HH:mm");
        }
        return timeText;
    };

    return (
        <li onClick={onClick} className={style["list-li"]}>
            <div className={style.leftBox}>
                {
                    timer.type === TYPE_RAND || timer.type === TYPE_CYCLE ?
                    <span>{formatTime(timer.stime) + '-' + formatTime(timer.etime)}</span> :
                    <span>{formatTime(timer.time)}</span>
                }

                {
                    timer.type === TYPE_RAND || timer.type === TYPE_CYCLE ?
                        <p>
                            {formatMessage({id: 'internal.SDKTimerV2.recycleTiming'})}
                            {timer.stime.isRepeated() &&
                                <i>, {repeatDesc(timer.stime.repeat, formatMessage)}</i>}
                        </p>
                        :
                        <p>
                            {desc(timer.cmd, 'list')}
                            { (timer.time.isRepeated() && <i>, {repeatDesc(timer.time.repeat, formatMessage)}</i>)||
                            <i>,{formatMessage({id: 'internal.SDKTimerV2.onceRepeat'})}</i>}
                        </p>
                }
            </div>
            <div className={style.rightBox}>
                <SwitchButton checked={enable} onClick={switchClick} />
            </div>
            <DeleteTimer onClick={deleteTimer} text={formatMessage({ id: 'internal.SDKTimerV2.delete' })}/>
        </li>
    )
})

const DeleteTimer=({onClick,text})=>{
    return  <div className={style.deleteTimer} onClick={(event) => {
        event.preventDefault(); event.stopPropagation(); onClick();
    }}> {text}</div>
}

function AddIcon({isAddable}) {
    return (
        <div className={style.addIconTop}>
            <div className={isAddable?style.borderStyle:style.addIcon}>
                <p className={isAddable?style.firstStyle:style.firstP}></p><p className={isAddable?style.lastStyle:style.lastP}></p>
            </div>
        </div>
    );
}
const TimerMutexSlipItem=MutexSlipItem(TimerItem,style.deleteTimer)

class TimerList extends React.PureComponent {
    static propTypes = {
        //定时列表
        timers:PropTypes.array,
        //定时内容描述方法
        desc:PropTypes.func,
        //是否还能添加定时
        addableType:PropTypes.string,
        //是否真正加载定时
        isFetching:PropTypes.bool

    };
    static defaultProps = {
        //定时列表
        timers:[],
        desc:cmd=>JSON.stringify(cmd)
    };

    detail(index){
        const {history,setCandidateTimers} =this.props;
        const timer = this.props.timers[index];
        const clone = timer.clone();
        //默认都为打开状态
        clone.en = true;
        setCandidateTimers({
            //克隆一个新timer
            [timer.type]:clone
        },timer.type);

        timer.type===TYPE_RAND|| timer.type===TYPE_CYCLE?
            history.push('/timer/recycle'):
            history.push('/timer/detail');
    }

    toggle = (timer)=>{
        this.props.addOrUpdateTimer({timer});
    };

    newTimer = ()=>{
        const {history,setCandidateTimers,intl:{formatMessage},addableType} =this.props;
        if (addableType) {

            setCandidateTimers([TYPE_COMMON,TYPE_PERIOD,TYPE_CYCLE].reduce(
                (total,cur)=>{
                    total[cur] = new Timer(cur);
                    return total
                },{}),
                addableType
            );

            if(addableType === TYPE_COMMON || addableType === TYPE_PERIOD ){
                //优先进入普通定时界面
                history.push('/timer/detail');
            }else if(addableType === TYPE_CYCLE){
                history.push('/timer/recycle');
            }
        } else {
            Modal.alert(formatMessage({id:'internal.SDKTimerV2.reachMaximum'}));
        }
    };
    
    render() {
        let {timers,desc,addableType:isAddable,error,isFetching,query,intl:{formatMessage},deleteTimer} = this.props;
        let component;
        if(timers && Array.isArray(timers)){
            component = timers.length===0?
                <EmptyList add={this.newTimer}/>:
                (
                    <React.Fragment>
                        <ul className={style["list-ul"]}>
                            {timers.map((timer,i) =>
                                <TimerMutexSlipItem
                                    key={timer.type + '-' + timer.id}
                                    toggle={this.toggle}
                                    timer={timer}
                                    desc={desc}
                                    onClick={()=>this.detail(i)}
                                    itemIndex={i}
                                    deleteTimer={()=>deleteTimer(timer.uuid)}
                                />
                                )}
                        </ul>
                        <FixBottom adaptToX='padding' className={style.background}>
                            <div onClick={this.newTimer} className={isAddable?style.btnTime2:style.btnTime}><AddIcon isAddable={isAddable}/> <FormattedMessage id="internal.SDKTimerV2.addTimer"/></div>
                        </FixBottom>
                    </React.Fragment>
                )
        }else if(!timers && error){
            component = <LoadFailed reload={query}/>
        }else if(!timers && isFetching){
            component = <LoadingPage />
        }


        return (
            <Page saveBottom>
                <NavBar title={formatMessage({ id: 'internal.SDKTimerV2.timingSet' })} right={[]} />
                {component}
            </Page>

        )

    }

}

const mapStateToProps = (state, ownProps) => {
    const {pickAvailableType, getIsFetching, getError} = dnaSelectors.timerSelectors;
    const types = ownProps.supportCycle ? [TYPE_COMMON, TYPE_PERIOD, TYPE_CYCLE] : [TYPE_COMMON, TYPE_PERIOD];
    return {
        // addableTypes:ownProps.supportCycle ?
        //     canAddTimer(state,TYPE_COMMON,TYPE_PERIOD,TYPE_CYCLE):
        //     canAddTimer(state,TYPE_COMMON,TYPE_PERIOD),
        addableType: pickAvailableType(state, ...types),
        timers: dnaSelectors.getTimerList(state),
        isFetching: getIsFetching(state),
        error: getError(state)
    };
};
TimerList = connect(
    mapStateToProps,
    {
        setCandidateTimers: actions.setCandidateTimers,
        query: actions.query,
        addOrUpdateTimer: actions.addOrUpdateTimer,
        deleteTimer: actions.deleteTimer
    })(TimerList);
export default injectIntl(TimerList)
