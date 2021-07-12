import React from 'react';
import style from './LogoTop.less';

import CurtainBg from './curtain-bg.png';
import CurtainProLogo from './curtain-product.png';
import PropTypes from 'prop-types';

/**
 * 国美平台头部
 */

class LogoTop extends React.Component {
    render() {
        const logo=this.props.logo;
        const prodImage=this.props.prodImage;
        const bgImage=this.props.bgImage;

        const bgStyle = {
            backgroundImage : 'url(' + bgImage+ ')'
        };
        const width = {
            width : this.props.width + 'rem'
        };
        const padTop = {
            paddingTop : this.props.top + 'rem'
        };
        return (
            <div className={style.top} style={bgStyle}>
                <div className={style.productLogo}  style={width}><img src={prodImage}/></div>
                <div className={style.logo} style={padTop}><img src={logo}/></div>
            </div>
        );
    }
}

LogoTop.propTypes= {
    /*底部商标图片*/
    logo:PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]),
    /*产品图片*/
    prodImage:PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]),
    /*背景图片*/
    bgImage:PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]),
    /*产品图片宽度*/
    width:PropTypes.number,
    /*产品图片paddingTop*/
    top:PropTypes.number
};

export default LogoTop;