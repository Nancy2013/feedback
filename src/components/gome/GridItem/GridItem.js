import React from 'react';
import style from './GridItem.less';
import PropTypes from 'prop-types';
import classNames from 'classnames';
/**
 * 国美平台
 * 应用场景: Grid栅格组件下的子组件,针对国美平台底部按钮，底部弹窗中的按钮相关样式进行整合
 * */
export default class extends React.PureComponent{
    static propTypes = {
        on:PropTypes.bool,//按钮为无状态按钮时，不传该字段或只传false
        disable:PropTypes.bool,
        svg:PropTypes.object,/*svg应为svg对象,此处svg要求不带外围圆圈，按钮外围圆圈由组件自动添加*/
        text:PropTypes.string,
        pressingHighlight:PropTypes.bool,//true: 触摸高亮，离开恢复; false:正常点击
        onClick:PropTypes.func,
    };
    static defaultProps={
        on:false,//默认为off状态
        pressingHighlight:false //默认无触摸高亮效果
    };
    state={highLight:false};

    itemClick=()=>{
        let {onClick,disable,pressingHighlight}=this.props;
        let {highLight}=this.state;
        if(disable){
            return
        }
        if(!highLight&&!pressingHighlight){
            onClick&&onClick();
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
            onClick();
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
        let {on,disable,text,columns,svg:Svg}=this.props;
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
            <div className={classNames({[style['gome'+(columns&&columns<=4?columns:4)+'_standardClass']]:true,[style.onlyTextHeight]:!Svg,
                [style[on||highLight?'themeColor':'offColor']]:!disable,
                [style.disableStyle]:disable,
                [style.modeItem]:true}) }>
                {!Svg?
                    <div className={classNames({[style.onlyText]:true})}
                         onTouchStart={(e)=>this.TouchStart(e)}
                         onTouchMove={(e)=>this.TouchMove(e)}
                         onTouchEnd={(e)=>this.TouchEnd(e)}
                         onTouchCancel={(e)=>this.TouchCancel(e)}
                         onClick={() => this.itemClick()}>
                        <div>
                            <span >{text}</span>
                        </div>
                    </div> :
                    <div>
                        <a onTouchStart={(e)=>this.TouchStart(e)}
                           onTouchMove={(e)=>this.TouchMove(e)}
                           onTouchEnd={(e)=>this.TouchEnd(e)}
                           onTouchCancel={(e)=>this.TouchCancel(e)}
                           onClick={() => this.itemClick()}>
                            <i className={style.svgMasker}></i>
                            <div>
                                <Svg className={style[svgStyle]} />
                            </div>
                        </a>
                        <span className={style.text}>{text}</span>
                    </div>}
            </div>
        )
    }
}

