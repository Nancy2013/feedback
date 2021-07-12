import React, { Component } from 'react';
import style from './SwitchBlock.less';
import FunctionBlock from '../FunctionBlock'
import SwitchButton from '../SwitchButton'
import PropTypes from 'prop-types';

class SwitchBlock extends React.Component {
    static propTypes = {
        text:PropTypes.string,
        checked:PropTypes.bool,
        disable:PropTypes.bool,
        onClick:PropTypes.func
    };
    static defaultProps = {
        disable:false
    };
    render() {
        const {disable,text,onClick} = this.props;
        let checked = this.props.checked;
        if(disable){
            checked = null;
        }
        return (
            <FunctionBlock disable={disable}>
                <div className={style.box} style={disable?{color:"#c8c8c8"}:null}>
                    <span>{text}</span>
                    <SwitchButton checked={checked} disable={disable} onClick={onClick}/>
                </div>
            </FunctionBlock>
        );
    }
}
export default SwitchBlock;
