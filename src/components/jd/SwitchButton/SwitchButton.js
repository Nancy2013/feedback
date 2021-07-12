import React from 'react';
import style from './SwitchButton.less';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class extends React.PureComponent {
    static propTypes = {
        checked:PropTypes.bool,
        disable:PropTypes.bool,
        onClick:PropTypes.func
    };

    static defaultProps = {
        disable:false
    };

    handleClick = (event)=>{
        const {onClick,checked} = this.props;
        onClick && onClick(checked,event);
    };

    render() {
        const {disable} = this.props;
        let checked = this.props.checked;
        if(disable){
            checked = null;
        }
        return (
            <div  className={classNames({[style.btn]:true,[style.pwrOff]:disable})} onClick={this.handleClick}>
                <p className={checked?style.on:null}>
                    <i></i>
                </p>
            </div>
        );
    }
}

