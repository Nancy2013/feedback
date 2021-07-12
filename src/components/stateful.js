import React from 'react';
import PropTypes from 'prop-types';

export default function (Component,propsMap,immutableProps/*固定不变的props*/) {

    return class extends React.PureComponent {

        static propTypes = {
            //负载类型
            state:PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
            onClick:PropTypes.func,
        };


        handleClick = () => {
            const { onClick, state } = this.props;
            if (onClick) {
                onClick(state);
            }
        };


        render() {
            const {state,onClick,...rest} = this.props;
            const props = propsMap.get(state) || propsMap.values().next().value;

            return <Component {...immutableProps} {...rest} {...props} onClick={this.handleClick} />
        }
    }
}
