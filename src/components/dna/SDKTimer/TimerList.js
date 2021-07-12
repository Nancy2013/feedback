import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../../Modal';
import moment from 'moment'
import SwitchButton from '../SwitchButton'
import png from './images/add-time.png'
import style from './SDKTimer.less'
import timePng from './images/add-time.svg'
import refreshIcon from './images/refresh.png'
import {repeatDesc} from './timer-util'
import NavBar from '../NavBar';
import LoadingPage from '../LoadingPage';
import FixBottom from '../FixBottom';
import Page from '../Page';

import failIcon from './images/load-fail.png';
import { injectIntl, FormattedMessage } from 'react-intl';
function EmptyList({add}) {

    return (
        <div className={style.addTime}>
            <div className={style.topBox}>
                <img src={png} alt=""/>
                <p><FormattedMessage id="internal.SDKTimer.noTimer"/></p>
            </div>
            <div onClick={add} className={style.radiusBox}>
            <FormattedMessage id="internal.SDKTimer.noTimer"/>
            </div>
        </div>
    );
}

function LoadFailed({reload}){
    return (
        <div className={style.failBox}>
            <div className={style.topBox}>
                <img src={failIcon} alt=""/>
                <p><FormattedMessage id="internal.SDKTimer.getTimerFailed"/></p>
            </div>
            <div onClick={()=>reload()} className={style.radiusBox}>
                <FormattedMessage id="internal.SDKTimer.reload"/>
            </div>
        </div>
    );
}

const TimerItem = injectIntl(({timer,toggle,onClick,desc,onTouchStart,onTouchEnd,intl:{formatMessage}})=>
    (
        <li onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onClick={onClick}>
            {
                (timer.status && timer.status !== -1) &&
                <div>
                    <div className={style.leftBox}>
                        {
                            timer.type===3|| timer.type===4?
                                <span>{timer.time.format("HH:mm")+'-'+timer.endtime.format("HH:mm")}</span>:
                                <span>{timer.time.format("HH:mm")}</span>
                        }

                        {
                            timer.type===3|| timer.type===4?
                                <p>
                                    {formatMessage({id:'internal.SDKTimer.recycleTiming'})}
                                    {timer.repeat&&timer.repeat.length>0&&<i>, {repeatDesc(timer.repeat,formatMessage)}</i>}
                                </p>
                                :
                                <p>
                                    {desc(timer.status,'list')}
                                    {timer.repeat&&timer.repeat.length>0&&<i>, {repeatDesc(timer.repeat,formatMessage)}</i>}
                                </p>
                        }
                    </div>
                    <div className={style.rightBox}>
                        <SwitchButton checked={timer.enable} onClick={toggle}/>
                    </div>
                </div>
            }
            {
                !timer.status &&
                <div className={style.liLoad}>
                    <div className={style.topDiv}></div>
                    <div className={style.bottomDiv}></div>
                </div>
            }
            {
                (timer.status === -1) &&
                <div className={style.liFailLoad}>
                    <span><FormattedMessage id="internal.SDKTimer.getTimingFail"/></span>
                    <p><img src={refreshIcon} alt=""/></p>
                </div>
            }
        </li>
    )
);

let delTimer;   //监听长按删除定时器
export default injectIntl(class extends React.PureComponent {
    static propTypes = {
        timers:PropTypes.any,
    };
    static defaultProps = {
        timers:[],
    };

    detail(index){
        const {history,timerHandler,timers} =this.props;
        const timer = timers[index];
        if(timer.status===-1){
            timerHandler('RELOAD');
        }else if(timer.status){
            timerHandler('EDIT',{index});
            timer.type===3|| timer.type===4?history.push('/timer/recycle'):history.push('/timer/detail');
        }
    }

    toggle(index,enable,event){
        event.stopPropagation();
        this.props.timerHandler('TOGGLE',{index});
    }

    newTimer = ()=>{
        const {history,timerHandler,timerCount,intl:{formatMessage}} =this.props;
        if (this.props.isAddable) {
            timerHandler('NEW');
            history.push('/timer/detail');
        } else {
            Modal.alert(formatMessage({id:'internal.SDKTimer.reachMaximum'}));
        }  
    };

    touchStart=(timer)=>{    //监听长按事件，长按唤出弹窗时间为1s
        const {formatMessage} = this.props.intl
        let that=this;
        delTimer=setTimeout(()=>{
            Modal.confirm(formatMessage({id:'internal.SDKTimer.delConfirm'}),()=>{
                that.deleteTimer(timer);
                return true;    //返回true可隐藏confirm弹窗
            });
        },1000);
    };

    touchEnd=()=>{  //停止长按时，取消
        clearTimeout(delTimer);
    };

    deleteTimer = (timer)=>{
        const {timerHandler} =this.props;
        timerHandler('DELETE',{
            type:timer.type,
            index:timer.index,
            callback:()=> {
            }
        });
    };


    render() {
        let {timers,desc,isAddable,timerHandler,intl:{formatMessage}} = this.props;

        let component;
        if(timers && Array.isArray(timers)){
            component = timers.length===0?
                <EmptyList add={this.newTimer}/>:
                (
                    <div>
                        <ul>
                            {timers.map((timer,i) =>
                                <TimerItem
                                    key={timer.type + '-' + timer.index}
                                    onClick={this.detail.bind(this, i)}
                                    toggle={this.toggle.bind(this, i)}
                                    timer={timer}
                                    desc={desc}
                                    onTouchStart={()=>{this.touchStart(timer)}}
                                    onTouchEnd={this.touchEnd}
                                />)}
                        </ul>
                        <FixBottom adaptToX='padding' className={style.background}>
                            <div onClick={this.newTimer} className={isAddable?style.btnTime2:style.btnTime}><AddIcon isAddable={isAddable}/> <FormattedMessage id="internal.SDKTimer.addTimer"/></div>
                        </FixBottom>
                    </div>
            )
        }else if(timers === -1){
            component = <LoadFailed reload={()=>timerHandler('REFRESH')}/>
        }else{
            component = <LoadingPage />
        }


        return (
            <Page saveBottom>
                <div className={style.timeList}>
                    <NavBar title={formatMessage({id:'internal.SDKTimer.timingSet'})} right={[]}/>
                    {component}
                </div>
            </Page>

        )

    }
    
})
function AddIcon({isAddable}) {
    return (
        <div className={style.addIconTop}>
            <div className={isAddable?style.borderStyle:style.addIcon}>
                <p className={isAddable?style.firstStyle:style.firstP}></p><p className={isAddable?style.lastStyle:style.lastP}></p>
            </div>
        </div>
    );
}