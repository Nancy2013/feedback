import React from 'react';
import PropTypes from 'prop-types';
import style from './OutletsListPopup.less';

import PopupBox from '../PopupBox';
import List from '../List';
import SwitchButton from '../SwitchButton';
/**
 * 国美平台弹出框子开关
 */
class OutletsListPopup extends React.PureComponent {
    render() {
        const {outlets,onConfirm,onCancel,switchClick}=this.props;
        return (
            <PopupBox left={{label:'取消',onClick:onCancel}} right={{label:'确定',onClick:onConfirm}} title={'子开关'}>
                <List>
                    {outlets && outlets.map((p, i) => {
                        return (
                            <Item key={p.key} state={p.state} name={p.name}
                                  onClick={() => {
                                      switchClick(p.key,p.state);
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
            <span>{props.name}</span>
            <SwitchButton state={props.state} onClick={props.onClick} />
        </div>
    );
}


OutletsListPopup.propTypes = {
    outlets: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        state: PropTypes.string,
        key: PropTypes.string,
    })).isRequired,

    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    switchClick: PropTypes.func
};


export default OutletsListPopup;