import React from 'react';
import PropTypes from 'prop-types';
import TimePicker from '../../TimePicker'

import moment from 'moment'
import BottomButton from '../BottomButton'

import {defaultTimer} from './timer-util'
import NavBar from '../NavBar';
import Page from '../Page';
import { injectIntl } from 'react-intl';

export default injectIntl(class extends React.PureComponent {
    static defaultProps = {
        timer: defaultTimer()
    };

    state={};

    timeUpdate = (date)=> {
        let time;
        const flag = this.props.match.params.flag;
        if(flag === 'start'||flag === 'end'){   //时间点，返回moment对象
            time = date.format("HH:mm:ss");
        }else { //持续时间段，转换成分钟
            let hours,minutes;
            hours=date.hours();
            minutes=date.minutes();
            time=hours*60+minutes;
        }
        this.setState({
            currentTime:time
        });

        console.log("******timeUpdate******" + this.state.currentTime);
    };

    save =()=> { //保存时间设置
        const {timerHandler,history} =this.props;
        let result; //时间判断后，是否跳转
        const flag = this.props.match.params.flag;

        if (flag === 'start') {  //开始时间
            result=timerHandler('UPDATE', {time: moment(this.state.currentTime, "HH:mm:ss")});
         } else if (flag === 'end') {  //结束时间
            result=timerHandler('UPDATE', {endtime: moment(this.state.currentTime, "HH:mm:ss")});
         } else if (flag === 'cmd1') { //操作一持续时间
            const seconds=this.state.currentTime*60;
            result=timerHandler('UPDATE', {cmd1duration: seconds});
         } else if (flag === 'cmd2') { //操作二持续时间
            const seconds=this.state.currentTime*60;
            result=timerHandler('UPDATE',  {cmd2duration: seconds});
         }
        if(result===false){

        }else {
            history.goBack();
        }
    };

    getMinTime=()=>{ //获得最小时间值
        const {timer}=this.props;
        const flag = this.props.match.params.flag;
        let minTime;
        if(timer.endtime.isBefore(timer.time)){   //如果结束时间早于或等于开始时间，则结束时间加1天
            timer.endtime=timer.endtime.add(1,'day');
            console.log(timer.endtime.isSame(timer.time));
        }
        const difference=timer.endtime.diff(timer.time, 'seconds'); //计算开始时间与结束时间的差值
        const sum=timer.cmd1duration+timer.cmd2duration;    //计算持续时间一与持续时间二的和
        if(flag === 'cmd1'||flag === 'cmd2'){   //设置操作一与操作二的持续时间
            minTime=moment.duration(60,"seconds");   //传递续的时间段，以秒为精确度，设备上返回的为秒
        }
        if(flag === 'start'){   //设置开始时间
            minTime=timer.endtime.clone().add(60,'seconds');
        }
        if(flag === 'end'){ //设置结束时间
            minTime=timer.time.clone().add(sum,'seconds');
        }
        return minTime;
    };

    getMaxTime=()=>{    //获得最大时间值
        const {timer}=this.props;
        const flag = this.props.match.params.flag;
        let maxTime,sum,surplus;
        if(timer.endtime.isBefore(timer.time)){   //如果结束时间早于或等于开始时间，则结束时间加1天
            timer.endtime=timer.endtime.add(1,'day');
        }
        const difference=timer.endtime.diff(timer.time, 'seconds'); //计算开始时间与结束时间的差值
        sum=timer.cmd1duration+timer.cmd2duration;    //计算持续时间一与持续时间二的和
        if(flag === 'cmd1'){   //设置操作一与操作二的持续时间
            surplus=difference-timer.cmd2duration+60;   //应该可以包含边界
            maxTime=moment.duration(surplus,"seconds");
        }
        if(flag === 'cmd2'){   //设置操作一与操作二的持续时间
            surplus=difference-timer.cmd1duration+60;   //应该可以包含边界
            maxTime=moment.duration(surplus,"seconds");
        }
        if(flag === 'start'){   //最大值可跨天
            maxTime=timer.endtime.clone().subtract(sum-60,'seconds');
        }
        if(flag === 'end'){
            maxTime=timer.time;
        }
        return maxTime;
    };

    render() {
        const {timer,intl:{formatMessage}}=this.props;
        const flag = this.props.match.params.flag;
        const TIMES = [timer.time,timer.endtime,
            moment.utc(timer.cmd1duration*1000).format("YYYY-MM-DD HH:mm:ss"),
            moment.utc(timer.cmd2duration*1000).format('YYYY-MM-DD HH:mm:ss')
        ];  //开始结束时间有值时显示，否则，开始时间为当前时间+1，结束时间为开始时间+2h，持续时间有值时显示，否则为30分钟
        const currentTime = TIMES[['start', 'end', 'cmd1', 'cmd2'].indexOf(flag)]; //获得当前时间
        const isDuration= !(flag === 'start'||flag === 'end'); //时间段时时间插件显示：小时、分钟，时间段时显示时、分
        const minTime=this.getMinTime();    //获得时间插件的最小值
        const maxTime=this.getMaxTime();    //获得时间插件的最大值
        return (
            <Page saveBottom>
                <NavBar title={(flag === 'cmd1' ||flag === 'cmd2')?formatMessage({id:'internal.SDKTimer.durationTime'}):formatMessage({id:'internal.SDKTimer.selectTime'}) }  right={[]}/>
                <TimePicker onChange={this.timeUpdate} defaultValue={moment(currentTime)} isDuration={isDuration}  min={minTime} max={maxTime}/>
                <BottomButton text={formatMessage({id:'internal.SDKTimer.timerSave'})} onClick={this.save}/>
            </Page>
        )
    }
})