import React from 'react';
import style from './WeekdaysText.less';
import PropTypes from 'prop-types';

/**
 * 国美平台 开关按键
 */

class WeekdaysText extends React.Component {
    render() {
        const weekdays=['周日','周一','周二','周三','周四','周五','周六'];
        const weekdaysList=this.props.daysList;
        const item=weekdaysList.map((num,index)=>{
            return(<span  key={index}>{weekdays[num]}</span>)
        })
        return (
            <p className={style.week}>
                {item}
            </p>
        );
    }
}

export default WeekdaysText;