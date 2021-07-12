import React from 'react';
import style from './PowerButton.less';
import pwrOn from './pwr-on.svg';
import pwrOff from './pwr-off.svg';
import PropTypes from 'prop-types';

/**
 * 京东平台 开关按键
 */
class PowerButton extends React.Component {
    render() {
        const icon = {
            'on':pwrOn,
            'off':pwrOff,
        };
        return (
            <div className={style.btn} onClick={this.props.onClick}>
                <img src={icon[this.props.state]}/>
            </div>
        );
    }
}

PowerButton.propTypes = {
    /** state of power */
    state:PropTypes.oneOf(['on', 'off']).isRequired,
    onClick:PropTypes.func
};

export default PowerButton;