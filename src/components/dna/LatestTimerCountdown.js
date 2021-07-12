import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import sdk from 'broadlink-jssdk'
import {nextUid} from '../utils';
import {nearestExecTime} from './SDKTimerV2/timer-util';
import FromNowDescription from './FromNowDescription'
import connect from "react-redux/es/connect/connect";
import {dnaSelectors} from "../reducers";
import {query} from "../actions/timer";

const {TYPE_CYCLE,TYPE_RAND} =sdk.platformSDK.taskV2;

const checkValid = timer =>!(!timer.en ||timer.type===TYPE_CYCLE ||timer.type===TYPE_RAND || ( !timer.isRepeated() && timer.time.moment.isBefore(moment())));

function getLatestTimer(timers,filter = ()=>true) {
    for(let i =0;i<timers.length;i++){
        let timer = timers[i];
        //过期或者disable的定时跳过
        if(checkValid(timer)&& filter(timer.cmd)){
            return timer;
        }
    }
}

class Countdown extends React.PureComponent {
    static propTypes = {
        timers:PropTypes.array,
        desc:PropTypes.func,
        //可选，该方法会被组件传入每个定时的定时内容。返回false则过滤这条定时
        filter:PropTypes.func
    };
    static defaultProps = {
        filter:()=>true,
        updateHash:nextUid(),
    };

    state={
        latestTimer:null
    };

    componentWillUnmount(){
        clearInterval(this.intervalID);
    }

    componentDidMount(){
        this.props.query({clear:false,keepTrying:true});
        this.updateLatestTimer();
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.timers !== prevProps.timers ||this.props.filter !== prevProps.filter) {
            this.updateLatestTimer();
        }
    }

    updateLatestTimer = ()=>{
        const timer = getLatestTimer(this.props.timers,this.props.filter);

        this.setState({latestTimer: timer},()=>{
            if(timer){
                this.startLoop()
            }else {
                clearInterval(this.intervalID);
                this.intervalID = null;
            }
        });

    };

    startLoop = ()=>{
        if(!this.intervalID ){
            console.warn('latestTimer:',JSON.stringify(this.state.latestTimer));
            this.intervalID = setInterval(()=>{
                const {latestTimer} = this.state;
                if(latestTimer && checkValid(latestTimer)){
                    //刷新界面倒计时
                    this.setState({uid:new Date().getTime()});
                }else{
                    clearInterval(this.intervalID);
                    this.intervalID = null;
                    this.updateLatestTimer();
                }
            },5000)
        }
    };


    render() {
        const {desc} = this.props;
        const {latestTimer} = this.state;

        return  (
            <React.Fragment>
                {
                    latestTimer && checkValid(latestTimer) ?
                        <FromNowDescription time={nearestExecTime(latestTimer.time)} action={desc(latestTimer.cmd)}/>:
                        null
                }
            </React.Fragment>
        )
    }
}

export default connect((state,ownProps)=>({
    timers:dnaSelectors.getAllTimerList(state),
}),{query})(Countdown);