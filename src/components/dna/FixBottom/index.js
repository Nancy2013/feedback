import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import style from './FixBottom.less';
import {isIphoneX} from '../../device';
import sdk from 'broadlink-jssdk';

export default class extends React.PureComponent {
    static propTypes = {
        //适配iphonex的方案
        adaptToX:PropTypes.oneOf(['padding', 'margin']),
        className:PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array
        ])
    };
    render(){
        const {children,adaptToX,className} = this.props;
        //固定底部的css

        const adaptCss = {
            //增大底部外边距
            padding:style.paddingBottom,
            //整体上移
            margin:style.marginBottom
            // radius:[style.Radius]
        };

        const iphoneXCss = isIphoneX&&sdk.platform==='dna'?adaptCss[adaptToX]:null;
        const classes =Array.isArray(className)?className:[className];


        return (
            <div className={classNames(...[style.fixBottom],iphoneXCss,...classes)}>
                {children}
            </div>
        )
        // return React.cloneElement(children, {
        //     className:classNames(fixedToBottom,iphoneXCss)
        // })
    }
}