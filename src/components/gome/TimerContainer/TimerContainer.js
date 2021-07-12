import React from 'react';
import style from './TimerContainer.less';
import WeekdaysText from '../WeekdaysText';
import PropTypes from 'prop-types';

/**
 * 国美平台 开关按键
 */

class TimerContainer extends React.Component {
    render() {
        const weekdaysList=this.props.daysList;
        const timer=this.props.timer;
        return (
            <div className={style.box}>
                <span className={style.time}>定时：{timer.time} {timer.state==='on'?'开启':'关闭'}</span>
                <WeekdaysText daysList={weekdaysList} />
            </div>
        );
    }
}

export default TimerContainer;