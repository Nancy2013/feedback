import React from 'react';
import PropTypes from 'prop-types';
import style from './OutletsPopupSocket.less';
import List from '../List';
import PopupBox from '../PopupBox';
import SelectButton from "../SelectButton/SelectButton";
import SwitchButton from '../SwitchButton';

/**
 * 国美平台弹出框选择插座
 */
class OutletsPopupSocket extends React.Component {
    render() {
        const outlets=this.props.socketList;
        return (
            <PopupBox left={{label:'取消'}} right={{label:'确定'}} title={'子开关'}>
                <List>
                    {outlets && outlets.map((p, i) => {
                        return (
                            <Item key={p.key} state={p.state} name={p.name}
                                  onClick={() => {
                                      this.props.switchClick(p.key,p.state);
                                  }}/>)
                    })}
                </List>
            </PopupBox>
        );
    }
}

function Item(props) {
    return (
        <div className={style.box}>
            <i className={style.left}>{props.name}</i>
            <SelectButton type='check' state={props.state} label='选择'/>
        </div>
    );
}

export default OutletsPopupSocket;