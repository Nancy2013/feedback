import React from 'react';
import style from './GridItem.less';
import PropTypes from 'prop-types';
import classNames from 'classnames';
/**
 * 京东平台
 * 应用场景: Grid栅格组件下的子组件，主要正对京东模式栅格，档位栅格等
 * */
export default class extends React.PureComponent{
    static propTypes = {
        on:PropTypes.bool,
        disable:PropTypes.bool,
        text:PropTypes.string,
        svg:PropTypes.object,/*svg应为svg对象,此处svg要求带外围圆圈*/
        pressingHighlight:PropTypes.bool,//true: 点击高亮，离开恢复; false:正常点击
        onClick:PropTypes.func,
    };
    static defaultProps={
        on:false,//默认为关闭状态
        disable:false,//默认为可点击
        pressingHighlight:false, //默认无触摸高亮效果
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
            <div className={classNames({[style['jd'+(columns&&columns<=4?columns:4)+'_standardClass']]:true,
                [style[on||highLight?'themeColor':'offColor']]:!disable,
                [style.disableStyle]:disable,
                [style.modeItem]:true}) }
                 onTouchStart={(e)=>this.TouchStart(e)}
                 onTouchMove={(e)=>this.TouchMove(e)}
                 onTouchEnd={(e)=>this.TouchEnd(e)}
                 onTouchCancel={(e)=>this.TouchCancel(e)}
                 onClick={() => this.itemClick()}>
                {!Svg?<span className={style.onlyText}>{text}</span>:
                    <React.Fragment>
                        <a>
                            <div>
                                <Svg className={style[svgStyle]}/>
                            </div>
                        </a>
                        <span className={style.text}>{text}</span>
                    </React.Fragment>}
            </div>
        )
    }
}

