import React from 'react';
import style from './GridItem.less';
import PropTypes from 'prop-types';
import classNames from 'classnames';
/**
 * 智慧星平台
 * 应用场景: Grid栅格组件下的子组件，主要正对智慧星底部栅格按钮，底部弹窗栅格按钮等
 * */
export default class extends React.PureComponent{
    static propTypes = {
        on:PropTypes.bool,//按钮为无状态按钮时，不传该字段或只传false
        disable:PropTypes.bool,
        svg:PropTypes.object,/*svg应为svg对象. 此处 svg 要求: 1.不带外围圆圈(按钮外围圆圈由组件自动添加) 2.svg的颜色属性为fill属性控制 */
        text:PropTypes.string,
        textFontSize:PropTypes.oneOfType(['small','big']),//按钮底部文字大小，主页面控制面板底部按钮大小为大文字样式。
        pressingHighlight:PropTypes.bool,//true: 点击高亮，离开恢复; false:正常点击
        onClick:PropTypes.func,
    };
    static defaultProps={
        on:false,//默认为off状态
        pressingHighlight:false, //默认无触摸高亮效果
        textFontSize:'big',//默认底部文字大字样
    };
    state={highLight:false};

    itemClick=()=>{
        let {onClick,disable,pressingHighlight}=this.props;
        let {highLight}=this.state;
        if(disable){
            return
        }
        if(!highLight&&!pressingHighlight){
            onClick && onClick();
        }
    };

    TouchStart=(e)=>{
        e.stopPropagation();
        let {disable,pressingHighlight}=this.props;
        if(disable||!pressingHighlight){
            return false
        }
        if(pressingHighlight){
            this.setState({
                highLight: true
            })
        }
    };
    TouchMove=(e)=>{
        e.stopPropagation();
        let {disable,pressingHighlight}=this.props;
        if(disable||!pressingHighlight){
            return false
        }
        if(pressingHighlight){
            this.setState({
                highLight: false
            })
        }
    };
    TouchEnd=(e)=>{
        e.stopPropagation();
        let {onClick,disable,pressingHighlight}=this.props;
        let {highLight}=this.state;
        if(disable||!pressingHighlight){
            return false
        }
        if(pressingHighlight&&highLight){
            this.setState({
                highLight: false
            });
            onClick&&onClick();
        }
    };
    TouchCancel=(e)=>{
        e.stopPropagation();
        let {pressingHighlight}=this.props;
        if(pressingHighlight){
            this.setState({
                highLight: false
            })
        }
    };

    render(){
        let {on,disable,text,columns,textFontSize,svg:Svg}=this.props;
        let {highLight}=this.state;
        let svgStyle;
        if(disable){
            svgStyle='fillDisable'
        }else{
            if(on){
                svgStyle='fillOn';
            }else{
                svgStyle='fillOff';
            }
        }
        return (
            <div className={classNames({[style['dna'+(columns&&columns<=4?columns:4)+'_standardClass']]:true,[style.onlyTextHeight]:!Svg,
                [style[on?'themeColor':'offColor']]:!disable,
                [style.disableStyle]:disable,
                [style.modeItem]:true}) }>
                {!Svg?
                    <div className={classNames({[style.onlyText]:true,[style.textLight]:highLight})}
                         onTouchStart={(e)=>this.TouchStart(e)}
                         onTouchMove={(e)=>this.TouchMove(e)}
                         onTouchEnd={(e)=>this.TouchEnd(e)}
                         onTouchCancel={(e)=>this.TouchCancel(e)}
                         onClick={() => this.itemClick()}>
                        <div>
                            <span >{text}</span>
                        </div>
                    </div> :
                    <React.Fragment>
                        <a
                            onTouchStart={(e)=>this.TouchStart(e)}
                            onTouchMove={(e)=>this.TouchMove(e)}
                            onTouchEnd={(e)=>this.TouchEnd(e)}
                            onTouchCancel={(e)=>this.TouchCancel(e)}
                            onClick={() => this.itemClick()}>
                            <div className={highLight?style.maskLayerHighLight:style.maskLayerNormal}></div>
                            <div>
                                <Svg className={style[svgStyle]}/>
                            </div>
                        </a>
                        <span className={classNames({[style.text]:true,[style.smallText]:textFontSize==='small'})}>{text}</span>
                    </React.Fragment>}
            </div>
        )
    }
}

