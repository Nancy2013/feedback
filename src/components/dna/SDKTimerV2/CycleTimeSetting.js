import React from 'react';
import PropTypes from 'prop-types';
import TimePicker from '../../TimePicker'
import moment from 'moment'
import BottomButton from '../BottomButton'
import NavBar from '../NavBar';
import Page from '../Page';
import { injectIntl } from 'react-intl';
import connect from "react-redux/es/connect/connect";
import {dnaSelectors} from "../../reducers";
import {updateCurrentTimer} from "../../actions/timer";
import sdk from "broadlink-jssdk/jssdk";
import TimePickerAdvanced from './TimePickerAdvanced'

const {Timer} =sdk.platformSDK.taskV2;

class Duration extends React.PureComponent {
    static propTypes = {
        //当前定时
        timer:PropTypes.instanceOf(Timer),
    };

    state={};

    timeUpdate = (date)=> {

        this.setState({
            currentTime:date
        });

        console.error("******timeUpdate******" + this.state.currentTime);
        console.error(this.state.currentTime);
    };

    save =()=> { //保存时间设置
        const {update,history} =this.props;
        let result; //时间判断后，是否跳转
        const flag = this.props.match.params.flag;
        const current = this.state.currentTime;
        if(!current){
            history.goBack();
            return;
        }

        if (flag === 'start') {  //开始时间
            result=update({stime: current});
         } else if (flag === 'end') {  //结束时间
            result=update({etime: current});
         } else if (flag === 'cmd1') { //操作一持续时间
            result=update({time1: current});
         } else if (flag === 'cmd2') { //操作二持续时间
            result=update({time2: current});
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
        if(timer.etime.moment.isBefore(timer.stime.moment)){   //如果结束时间早于或等于开始时间，则结束时间加1天
            timer.etime.moment.add(1,'day');
        }
        const sum=timer.time1.clone().add(timer.time2);  //计算持续时间一与持续时间二的和
        if(flag === 'cmd1'||flag === 'cmd2'){   //设置操作一与操作二的持续时间
            minTime=moment.duration(60,"seconds");   //传递续的时间段，以秒为精确度，设备上返回的为秒
        }
        if(flag === 'start'){   //设置开始时间
            minTime=timer.etime.moment.clone().add(60,'seconds');
        }
        if(flag === 'end'){ //设置结束时间
            minTime=timer.stime.moment.clone().add(sum);
        }
        return minTime;
    };

    getMaxTime=()=>{    //获得最大时间值
        const {timer}=this.props;
        const flag = this.props.match.params.flag;
        let maxTime,surplus;
        if(timer.etime.moment.isBefore(timer.stime.moment)){   //如果结束时间早于或等于开始时间，则结束时间加1天
            timer.etime.moment.add(1,'day');
        }
        const difference=timer.etime.moment.diff(timer.stime.moment, 'seconds'); //计算开始时间与结束时间的差值
        const sum=timer.time1.clone().add(timer.time2);    //计算持续时间一与持续时间二的和
        if(flag === 'cmd1'){   //设置操作一与操作二的持续时间
            surplus=difference-timer.time2.asSeconds()+60;   //应该可以包含边界
            maxTime=moment.duration(surplus,"seconds");
        }
        if(flag === 'cmd2'){   //设置操作一与操作二的持续时间
            surplus=difference-timer.time1.asSeconds()+60;   //应该可以包含边界
            maxTime=moment.duration(surplus,"seconds");
        }
        if(flag === 'start'){   //最大值可跨天
            maxTime=timer.etime.moment.clone().subtract(sum.asSeconds()-60,'seconds');
        }
        if(flag === 'end'){
            maxTime=timer.stime.moment;
        }
        return maxTime;
    };

    render() {
        const {timer,intl:{formatMessage}}=this.props;
        const flag = this.props.match.params.flag;
        const TIMES = [timer.stime,timer.etime,timer.time1, timer.time2 ];
        //开始结束时间有值时显示，否则，开始时间为当前时间+1，结束时间为开始时间+2h，持续时间有值时显示，否则为30分钟
        const currentTime = TIMES[['start', 'end', 'cmd1', 'cmd2'].indexOf(flag)]; //获得当前时间
        const isDuration= !(flag === 'start'||flag === 'end'); //时间段时时间插件显示：小时、分钟，时间段时显示时、分
        const minTime=this.getMinTime();    //获得时间插件的最小值
        const maxTime=this.getMaxTime();    //获得时间插件的最大值
        return (
            <Page saveBottom>
                <NavBar title={(flag === 'cmd1' ||flag === 'cmd2')?formatMessage({id:'internal.SDKTimerV2.durationTime'}):formatMessage({id:'internal.SDKTimerV2.selectTime'}) }  right={[]}/>
                {
                    isDuration ?
                        <TimePicker onChange={this.timeUpdate} defaultValue={currentTime} isDuration={isDuration} min={minTime} max={maxTime}/> :
                        <TimePickerAdvanced isCycle supportSunriseAndSunset={this.props.supportSunriseAndSunset} onChange={this.timeUpdate} time={currentTime} min={minTime} max={maxTime}></TimePickerAdvanced>
                }
                <BottomButton text={formatMessage({id:'internal.SDKTimerV2.timerSave'})} onClick={this.save}/>
            </Page>
        )
    }
}

export default connect(
    (state) => {
        return {
            /*
            *TODO?
            *
            export const getCurrentTimer = createSelector(
                timerSelectors.getCurrent, timerSelectors.getSunTable,
                (timer={}, table) => overrideSunMoment(timer, table, 'time', 'stime', 'etime')
            );
            * */
            timer: dnaSelectors.timerSelectors.getCurrent(state),
        }
    },
    {
        update: updateCurrentTimer
    })(injectIntl(Duration));