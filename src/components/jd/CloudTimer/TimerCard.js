import React from 'react';
import style from './SDKTimer.less';
import SwitchButton from '../SwitchButton';
import {listIcon} from './icons';
const TimerCard = ({ name, timeMH, date, desc, enable, rightClick, swichClick, rightIcon = listIcon, hasSwitch = true,descColor="#999999" ,expired=false,rightText="已过期"}) => {
    return <div className={style.timerCard}>
        <div >
            <div>{name}</div>
            <div onClick={rightClick}>{rightIcon}</div>
        </div>
        <hr></hr>
        <div>
            <div>
                <div>{timeMH} {date && <span>{date}</span>}</div>
                <div style={{color:descColor}}>{desc}</div>
            </div>
            <div>
                {hasSwitch &&(!expired?<SwitchButton checked={enable} onClick={swichClick} />:<span>{rightText}</span>)}
            </div>
        </div>
    </div>
}
export default TimerCard;