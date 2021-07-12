import React from 'react';
import style from './Top.less';

import PropTypes from 'prop-types';
/**
* 京东平台 顶部开关状态栏
* */
class Top extends React.PureComponent {
    render() {
        const {children,bgImage} = this.props;

        const inlineStyle = {
            backgroundImage : 'url(' + bgImage + ')'
        };
        return (
            <div style={inlineStyle} className={style.box}>
                {children}
            </div>
        )
    }
}

Top.propTypes= {
    children: PropTypes.element.isRequired,
    bgImage:PropTypes.string
};

export default Top;