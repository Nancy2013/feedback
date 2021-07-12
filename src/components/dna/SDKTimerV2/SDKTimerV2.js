

import React from 'react';
import {
    Route,
} from 'react-router-dom'
import Switch from '../../TransitionSwitch'
import moment from 'moment'
import PropTypes from 'prop-types';

import TimerList from './TimerList';
import TimerDetail from './TimerDetail';
import RepeatSetting from './RepeatSetting';
import DaySetting from './DaySetting';
import CommandSetting from './GeneralCommand';
import CycleCommand from './CycleCommand';

import TimerRecycle from './CycleTimerDetail';
import TimeSetting from './CycleTimeSetting';
import SelectRegion from './SelectRegion';
import connect from "react-redux/es/connect/connect";
import { query } from "../../actions/timer";

moment.fn.toJSON = function() { return this.format("YYYY-MM-DD HH:mm:ss"); };

class TimerV2 extends React.Component {

    static propTypes = {
        /*
         命令设置界面
         React组件，注意不是实例
         组件应接收2个prop：
            cmd  ：plain object，当前命令
            updateCmd  ：func，更新当前命令的方法，接受cmd作为参数。
         */
        setting: PropTypes.func.isRequired,
        /*
            定时内容的描述
            desc(cmd, type) ,返回对当前命令的文字描述
            type 有2个值'list'/'detail',表示列表界面/详情界面
         */
        desc:PropTypes.func.isRequired,
        //命令设置为标准交互，还是完全自定义
        // settingType:PropTypes.oneOf(['inline'/*未实现*/, 'standard','custom']),
        //是否支持循环定时
        supportCycle:PropTypes.bool,
        supportSunriseAndSunset: PropTypes.bool,
    };

    static defaultProps = {
        supportCycle:true,
        supportSunriseAndSunset: false
    };


    componentDidMount(){
        //清除当前定时列表
        //出错后不在进行重试
        const {supportSunriseAndSunset} = this.props;
        this.props.query({clear:true,keepTrying:false,supportSunriseAndSunset});
    }

    render() {
        const {setting,desc,supportCycle,supportSunriseAndSunset} = this.props;

        return (
            <Switch location={this.props.location} history={this.props.history} level={2}>
                <Route exact path='/timer' render={(props) =>
                    <TimerList {...props} desc={desc} supportCycle={supportCycle}/>
                }
                />
                <Route path='/timer/detail' render={(props) =>
                    <TimerDetail {...props} desc={desc} supportCycle={supportCycle} supportSunriseAndSunset={supportSunriseAndSunset}/>
                }/>
                <Route path='/timer/command' render={(props) =>
                    <CommandSetting {...props} content={setting} />
                }/>
                <Route path='/timer/repeat' component={RepeatSetting}/>
                <Route path='/timer/day' component={DaySetting}/>
                {/*循环定时详情界面*/}
                <Route path='/timer/recycle' render={(props) =>
                    <TimerRecycle {...props} desc={desc} />
                }/>
                {/*循环定时命令设置*/}
                <Route path='/timer/cycle-command/:flag' render={(props) =>
                    <CycleCommand {...props} content={setting}/>
                }/>
                {/*循环定时时间设置*/}
                <Route path='/timer/time/:flag' render={(props) => 
                    <TimeSetting {...props} supportSunriseAndSunset={supportSunriseAndSunset}/>
                }/>
                <Route path='/timer/region' render={(props) => 
                    <SelectRegion {...props}/>
                }/>

            </Switch>
        )

    }
}

export default connect(null,{query})(TimerV2);