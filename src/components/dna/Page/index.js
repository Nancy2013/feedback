import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {statusBarHeight,isIOS,isIphoneX} from '../../device'
import style from './page.less'
import sdk from 'broadlink-jssdk'

export default class extends React.PureComponent {
    static propTypes = {
        //保留头部区域（防止导航栏遮挡到内容）
        saveTop:PropTypes.bool,
        //保留底部区域（防止底部的操作按钮遮挡到内容）
        saveBottom:PropTypes.bool,
        className: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
        ])
    };

    static defaultProps = {
        saveTop:true,
        saveBottom:false
    };
    state ={
        statusBarHeight:statusBarHeight
    };

    componentDidMount(){
        if( sdk.platform === 'dna'){
            sdk.platformSDK.callNative('getSystemSettings').then(setting => {
                if (setting && setting.statusBarHeight > 0) {
                    this.setState({
                        statusBarHeight: (isIOS?setting.statusBarHeight:(setting.statusBarHeight/window.devicePixelRatio))
                    })
                }
            })

        }
    }

    render(){
        const {saveTop,saveBottom,className,children} = this.props;

        const bottomCss = saveBottom?
            (isIphoneX?style.saveBottomX:style.saveBottom)
            :
            null;

        return (
            <div className={className}>
                <div style={{paddingTop:this.state.statusBarHeight+'px'}}>
                    <div className={classNames({[style.navbarHeight]:saveTop},bottomCss)}>
                        {children}
                    </div>
                </div>
            </div>
        )
    }
}
