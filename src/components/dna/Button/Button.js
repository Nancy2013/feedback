import React from 'react';
import style from './Button.less';
import PropTypes from 'prop-types';
import Image from '../../Image';

export default class extends React.PureComponent {
    
    static propTypes = {
        //图片按钮
        image: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ]),
        //disabled状态下的图片，如果不传，则在disable时把透明度设为50%
        disabledImage: PropTypes.string,
        //图片下方文字
        label: PropTypes.string,
        onClick: PropTypes.func,
        //按压图片
        pressingImage: PropTypes.string,
        //是否放置在白色的背景上，字体黑色、disable需要换图片
        onWhiteBg: PropTypes.bool,
        disable: PropTypes.bool
    };

    state = {
        pressing:false
    };
   
    onClick = () => {
        const { disable, onClick } = this.props;
        if (!disable && onClick) {
            onClick();
        }
    };
    onTouchStart = () => {
        this.setState({
            pressing: true
        });
    };
    onTouchEnd = () => {
        this.setState({
            pressing: false
        });
    };

    onTouchCancel= () =>{
       this.onTouchEnd()
    };

    render(){
        const {image,pressingImage,label,disable,onWhiteBg,disabledImage} = this.props;
        const {pressing} = this.state;

        let textStyle;
        if(onWhiteBg){
            textStyle=disable ?{color:"#bfbfbf"}:{color:"#555"};
        }else{
            textStyle = null;
        }
        const src= disable&&disabledImage?
            disabledImage
            :
            (pressing&&pressingImage?pressingImage:image);

        return (
            <div className={style.childBox} style={!disabledImage&&disable?{opacity: 0.5}:null}>
                <p className={style.btn} onClick={this.onClick} onTouchStart={this.onTouchStart} onTouchEnd={this.onTouchEnd} onTouchCancel={this.onTouchCancel}>
                    <Image src={src}/>
                </p>
                {label && <span style={textStyle}>{label}</span>}
            </div>
        );
    }
}






