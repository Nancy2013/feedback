import React from 'react';
import sdk from 'broadlink-jssdk';
import { getNearTime } from './api';
import moment from "moment";

export default function higherOrderLastTimer(WrappedTimer){
    return class extends React.PureComponent{
        interval=null;
        state={
            lastTimer:{}
        }
        componentDidMount(){
           const {ready} = this.props;
           if (sdk.platformSDK && sdk.platformSDK.io&&ready) {
                this.getLastTimer();
                !this.interval &&this.loopGetLastTimer();
           }
        }

        componentWillReceiveProps(nextProps){
           const {ready} = nextProps;
            if( !this.props.ready && ready ){
                this.getLastTimer();
                !this.interval &&this.loopGetLastTimer();
            }
        }

        componentWillUnmount(){
            if(this.interval){
                clearInterval(this.interval);
                this.interval= null;
            }
        }

        loopGetLastTimer=()=>{
            if(this.interval){
                clearInterval(this.interval);
                this.interval= null;
            }
            this.interval=setInterval(()=>{ 
                this.getLastTimer();
            },6000)
        }

        getLastTimer=()=>{
            getNearTime( (response)=> {
                if(response&&response.result){
                    const timer=response.result;
                    let cmd = {}
                    timer.task_express&&timer.task_express[0].stream.forEach(Key_Value  => {    
                        for(let param in Key_Value){
                            cmd[param] = parseInt(Key_Value[param]) 
                        }
                    });
                    const {task_name, task_status, next_left_minutes, next_excute_time,} = timer;
                    const minDuration = moment.duration({'minute' : parseInt(next_left_minutes) +1})
                    const showCountdown =`${minDuration.days() > 0 ?  minDuration.days()+"天" : " "}${minDuration.hours()}小时${minDuration.minutes()}分钟后 `;  //显示倒计时
                    const showTime = next_excute_time;
                    const cmdDesc = this.props.desc(cmd);
                    if(timer.next_excute_time){
                        this.setState({
                            lastTimer:{
                                task_name,
                                task_status,
                                cmdDesc,
                                showTime,
                                showCountdown
                            },
                        })
                    }
                }else{
                    this.setState({
                        lastTimer:{}
                    })
                }
            })
        }
        render(){
            return <WrappedTimer lastTimer={this.state.lastTimer} {...this.props}/>
        }
    }
}