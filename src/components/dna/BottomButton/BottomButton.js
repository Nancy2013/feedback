import React from 'react';
import PropTypes from 'prop-types';
import style from './BottomButton.less';
import FixBottom from '../FixBottom';
import {isIphoneX} from '../../device'
import classNames from 'classnames';

export default class extends React.PureComponent {
    static propTypes = {
        enable:PropTypes.bool,
        text:PropTypes.string,
        onClick:PropTypes.func
    };

    static defaultProps = {
        enable:true
    };

    handleClick = ()=>{
        const {onClick,enable} = this.props;
        onClick && onClick(enable);
    };

    render(){
        const {text,enable} = this.props;
        return (
            <FixBottom adaptToX='margin'>
                <div className={classNames(style.box,{[style.radius]:isIphoneX,[style.enable]:enable})}  onClick={this.handleClick}>{text}</div>
            </FixBottom>

        )
    }

}