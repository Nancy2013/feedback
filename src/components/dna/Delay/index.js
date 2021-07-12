import React from 'react';
import PropTypes from 'prop-types';
import Toast from '../../Toast/index'
import moment from 'moment';
import Delay from './Delay';
import sdk from 'broadlink-jssdk'
import PickerPage from '../../PickerPage/index'
import {injectIntl} from 'react-intl'
import connect from "react-redux/es/connect/connect";
import {query,deleteTimer, addOrUpdateTimer} from '../../actions/timer';
import {dnaSelectors} from '../../reducers';

const {Timer,TYPE_DELAY} =sdk.platformSDK.taskV2;

let timerContent ;//存储定时内容

function isInclude(compareCmd,timeCmd){
    let include = true;
    Object.keys(compareCmd).forEach(key=>{
        if(timeCmd[key] !== compareCmd[key]){
            include = false;
        }
    });
    return include;
}

const getLastDelayTime = (timers, compareCmd) =>{
    if(!Array.isArray(timers))
        return null;

    var soredTimers = timers.filter(time=>{
        return time.cmd && time.type === TYPE_DELAY && isInclude(compareCmd,time.cmd);
    }).sort((a,b)=>{
        if(a.time.moment.isBefore(b.time.moment)){
            return -1;
        }
        return 1;
    });

    return soredTimers[0];
};


const addOrUpdateDelayTimer = (delayMinutes, delay, addOrUpdateTimer, callback) => {
    const delayTimer =  delay || new Timer(TYPE_DELAY);

    delayTimer.time.moment =  moment().add(delayMinutes, 'minutes');
    delayTimer.cmd = delayTimer.cmd || timerContent;
    delayTimer.en = 1;


    addOrUpdateTimer({timer: delayTimer, callback: callback});
};


class ShortcutDelay extends React.PureComponent {
    static propTypes = {
        //标题
        title:PropTypes.string.isRequired,
        //关闭定时组件回调函数
        closeSelf:PropTypes.func.isRequired,
        //当前需要的定时内容，格式如：{pwr:1}，必须传入
        timerContent:PropTypes.object.isRequired,
        //PropTypes.oneOf(['cross', 'back'])
        leftButton:PropTypes.oneOf(['cross', 'back']),
        //是否正在刷新
        isFetching:PropTypes.bool,
        //是否有错误
        error:PropTypes.object,
        //注入的定时列表
        delay: PropTypes.instanceOf(Timer)
    };

    componentDidMount(){
        const {query}=this.props;
    	query({clear:true,keepTrying:false});

    }
    static getDerivedStateFromProps(nextProps, prevState) {
            timerContent=nextProps.timerContent;
            return null;
    }

    addTimer = (delayMinutes) =>{
        const {delay,addOrUpdateTimer}=this.props;
        addOrUpdateDelayTimer(delayMinutes,delay,addOrUpdateTimer,()=>{
            this.props.closeSelf && this.props.closeSelf();
            Toast.success('internal.Delay.delayStarted');
         })
    };
    deleteTimer = (timer) => {
        const {deleteTimer,delay} = this.props;
        deleteTimer(delay.uuid);
    };

    render() {
        const {delay} = this.props;
        const lastTime = delay?delay:null
        return (
            <div>
                <Delay {...this.props} timer={lastTime} addTimer={this.addTimer} deleteTimer={this.deleteTimer}/>
            </div>
        )

    }
}

class CustomDelay extends React.PureComponent {


    defaultDelay = moment({ hour:0, minute:10 }).toDate();
    minDate = moment().startOf('day').add(1, "m").toDate();

    state={
        loading:false
    };

    save = (date)=>{
        const delayMoment = moment(date);
        const delayMinutes =delayMoment.hours()*60 + delayMoment.minutes();
        const {delay,addOrUpdateTimer}=this.props;
        addOrUpdateDelayTimer(delayMinutes,delay,addOrUpdateTimer,()=>{
                this.setState({loading:false});
                this.props.history.goBack();
         })

    };

    render(){
        let {formatMessage} = this.props.intl
        const lang = formatMessage({id:'internal.Delay.delaySet'});
        return (
            <div>
                <PickerPage type="time"
                            date={this.defaultDelay}
                            minDate={this.minDate}
                            save={this.save}
                            title={lang}
                            isDuration={true}
                            {...this.props}
                />
            </div>
        );
    }


}






const mapStateToProps = (state,ownProps) => {
    const {getIsFetching,getError} = dnaSelectors.timerSelectors;
    if(ownProps.timerContent){//CustomDelay不需要传入所需定时内容
        timerContent=ownProps.timerContent
    }
    return {
        isFetching:getIsFetching(state),
        error:getError(state),
        delay:getLastDelayTime(dnaSelectors.getAllTimerList(state),timerContent),
    };
};

ShortcutDelay = connect(mapStateToProps,{query,addOrUpdateTimer,deleteTimer})(injectIntl(ShortcutDelay));
CustomDelay = connect(mapStateToProps,{query,addOrUpdateTimer,deleteTimer})(injectIntl(CustomDelay));

export {ShortcutDelay,CustomDelay};



