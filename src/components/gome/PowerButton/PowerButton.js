import React from 'react';
import style from './PowerButton.less';

import Button from '../Button';
import PropTypes from 'prop-types';

import pwrOff from './pwr-off.svg';
import pwrOn from './pwr-on.svg';
/**
 * 国美平台 开关按键
 */
const PowerButton = function (props) {
    const { state, ...passThroughProps } = props;

    let label;
    if(state === 'on'){
        label ='ON'
    }else if(state === 'off'){
        label ='OFF'
    }

    const imgs = {
        'on':pwrOn,
        'off':pwrOff,
    };

    return <Button image={imgs[state]} label={label} {...passThroughProps}></Button>;
};

PowerButton.propTypes={
    state:PropTypes.oneOf(['on','off']).isRequired
};
export default PowerButton;


