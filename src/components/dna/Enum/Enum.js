import React from 'react';
import style from './Enum.less';
import PropTypes from 'prop-types';
import classNames from 'classnames';
/**
* 枚举属性的布局排列
* */
export default class Enum extends React.PureComponent {
    static propTypes = {
        className:PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array
        ])

    };

    static defaultProps = {
    };

    render() {
        const {children,className} = this.props;
        const count = React.Children.count(children);
        let boxClass;
        if(count===2){
            boxClass=style.twoStyle
        }else if(count===3){
            boxClass=style.threeStyle
        }else{
            boxClass=style.normalStyle
        }
        const classes = Array.isArray(className)?className:[className];
        return (
            <div className={classNames({[boxClass]:true,[style.box]:true},...classes)}>
                {children}
            </div>
        );
    }
}