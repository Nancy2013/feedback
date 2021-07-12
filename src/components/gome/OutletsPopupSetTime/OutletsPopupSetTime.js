import React from 'react';
import PropTypes from 'prop-types';
import style from './OutletsPopupSetTime.less';
import PopupBox from '../PopupBox';
import SelectButton from '../SelectButton';
import List from '../List';

/**
 * 国美平台弹出框设置定时
 */
class OutletsPopupSetTime extends React.Component {
    render() {
        const outlets = this.props.setTimeList;
        return (
                <PopupBox left={{label:'取消'}} right={{label:'确定'}} title={'设置列表'}>
                    <Item openState={outlets.openState} closeState={outlets.closeState}/>
                    <div className={style.box}>
                        <div className={style.innerBox}>
                            <div className={style.timeBox}>

                            </div>
                        </div>
                    </div>
                    <BottomWeek/>
                </PopupBox>
        );
    }
}

function Item(props) {
    return (
        <div className={style.itemBox}>
            <div className={style.fatherBox}>
                <div className={style.childBox}>
                    <SelectButton type='check' state={props.openState} label='打开'/>
                </div>
                <div className={style.childBox}>
                    <SelectButton type='cancel' state={props.closeState} label='关闭'/>
                </div>
            </div>
        </div>
    );
}
function BottomWeek() {
    return (
        <div className={style.bottom}>
            <div className={style.fatherBox}>
                <div className={style.childBox}>周一</div><div className={style.childBox+" "+style.select}>周二</div><div className={style.childBox}>周三</div><div className={style.childBox}>周四</div><div className={style.childBox}>周五</div><div className={style.childBox}>周六</div><div className={style.childBox}>周日</div>
            </div>
        </div>
    );
}

export default OutletsPopupSetTime;