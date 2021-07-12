import React, { Component } from 'react';
import style from './MainButton.less';

import PowerButton from '../PowerButton';
import PropTypes from 'prop-types';

class MainSwitch extends React.PureComponent {

    render() {
        const sole=this.props.sole;
        var pwrState=this.props.state;

        return (
            <div className={style.box}>
                <div className={style.fatherBox}>
                    {
                        sole?
                            <PowerButton size='big' state={sole} onClick={this.props.powerClick}/>:
                            [
                                <PowerButton key="on" state='on' size='large'  onClick={this.props.allOnClick}/>,
                                <PowerButton key="off" state='off' size='large' onClick={this.props.allOffClick}/>
                            ]
                    }
                </div>
            </div>
        );
    }
}
MainSwitch.propTypes= {
    sole:PropTypes.oneOf(['on', 'off',false]),
    allOnClick:PropTypes.func,
    allOffClick:PropTypes.func,
    powerClick:PropTypes.func
};

export default MainSwitch;