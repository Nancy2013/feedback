import React from 'react';
import style from './SelectButton.less';
import closeOff from './close-off.svg';
import closeOn from './close-on.svg';
import openOff from './open-off.svg';
import openOn from './open-on.svg';
import PropTypes from 'prop-types';


/**
 * 国美平台选择按钮
 */

class SelectButton extends React.Component {
    render() {
        var icon = {
            check:{
                on:openOn,
                off:openOff
            },
            cancel:{
                on:closeOn,
                off:closeOff
            }
        };
        return (
            <div className={style.box}>
                <div className={style.imgBtn}>
                    <img src={icon[this.props.type][this.props.state]}/>
                </div>
                {this.props.label && <span>{this.props.label}</span>}
            </div>
        );
    }
}

SelectButton.propTypes = {
    state:PropTypes.oneOf(['on','off']).isRequired,
    type:PropTypes.oneOf(['check','cancel']).isRequired,
    label:PropTypes.string

};

export default SelectButton;
