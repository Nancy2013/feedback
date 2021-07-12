import React from 'react';
import PropTypes from 'prop-types';
import style from './OutletsPopupTimers.less';
import List from '../List';
import PopupBox from '../PopupBox';
import SelectButton from "../SelectButton/SelectButton";
import SwitchButton from '../SwitchButton';
import deleteBtn from './delete-btn.svg';
import Button from '../Button';

/**
 * 国美平台弹出框底部星期
 */
class OutletsPopupTimers extends React.Component {
    render() {
        const outlets=this.props.timerList;
        return (
                <PopupBox left={{label:'取消'}} right={{label:'确定'}} title={'定时列表'}>
                    <List>
                        {outlets && outlets.map((p, i) => {
                            return (
                                <Item key={p.key} state={p.state} name={p.name} time={p.time} timeState={p.timeState} weekdays={p.weekdays}/>
                            );
                        })}
                    </List>
                </PopupBox>
        );
    }
}

function Item(props) {
    return (
            <div className={style.box}>
                <div className={style.left}>
                    <p className={style.leftTop}>
                        <span className={style.timeShow}>{props.time}</span>
                        <span className={style.switchShow}>{(props.timeState==='on'?'打开':'关闭')+props.name}</span>
                    </p>
                    <PopupSelectWeek  daysList={props.weekdays}/>
                </div>
                <div className={style.right}>
                    <Button image={deleteBtn}/>
                    <SwitchButton state={props.state}/>
                </div>
            </div>
    );
}

function PopupSelectWeek(props){
    const weekdays=['周日','周一','周二','周三','周四','周五','周六'];
    const weekdaysList=props.daysList;
    const item=weekdaysList.map((num,index)=>{
        return(<div  key={index}>{weekdays[num]}</div>)
    });
    return (
        <div className={style.weekBox}>
            {item}
        </div>
    );
}

export default OutletsPopupTimers;