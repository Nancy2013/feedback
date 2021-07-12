import React from 'react';
import style from './SwitchButton.less';
import PropTypes from 'prop-types';

export default class extends React.PureComponent {
    static propTypes = {
        checked:PropTypes.bool,
        onClick:PropTypes.func
    };

    static defaultProps = {

    };

    handleClick = (event)=>{
        const {onClick,checked} = this.props;
        onClick && onClick(checked,event);
    };

    render() {
        const {checked} = this.props;
        return (
            <div className={style.btn} onClick={this.handleClick}>
                <p className={checked?style.on : ''} ></p>
            </div>
        );
    }
}
