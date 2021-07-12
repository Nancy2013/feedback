import React from 'react';
import style from './SwitchButton.less';
import switchOn from './switch-on.png';
import switchOff from './switch-off.png';
import PropTypes from 'prop-types';

class SwitchButton extends React.Component {
    render() {
        const { state ,onClick} = this.props;

        const icon = {
            'on':switchOn,
            'off':switchOff
        };
        return (
            <div className={style.btn} onClick={onClick}>
                <img src={icon[state]}/>
            </div>
        );
    }
}

SwitchButton.propTypes = {
    state:PropTypes.oneOf(['on', 'off']).isRequired,
    onClick:PropTypes.func
};

export default SwitchButton;
