import React from 'react';
import PropTypes from 'prop-types';
import style from './FunctionBlock.less';
import classNames from 'classnames';
/**
 * 京东平台 控制
 * */
class FunctionBlock extends React.PureComponent {
    static propTypes = {
        disable:PropTypes.bool
    };
    static defaultProps = {
        disable:false
    };
    render() {
        const {children,disable} = this.props;
        const childrenWithProps = React.Children.map(children,(child)=>{
            if(child&&typeof child.type ==='function'){
                return React.cloneElement(child,{disable: disable})
            }else {
                return child
            }
        });
        return (
            <div className={classNames({[style.box]:true,[style.pwrOff]:disable})}>
                {disable && <div className={classNames({[style.maskLayer]:true})}></div>}
                {childrenWithProps}
            </div>
        );
    }
}
export default FunctionBlock;
