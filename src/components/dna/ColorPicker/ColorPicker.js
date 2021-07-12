import React from 'react';
import PropTypes from 'prop-types';
import changeCase from 'change-case';
import '../../libs/boostrap-slider/bootstrap-slider.css'
import './ColorPicker.css'
import Slider from './../../libs/boostrap-slider/bootstrap-slider';

export default class extends React.Component {
    static propTypes = {
        type: PropTypes.oneOf(["color", "saturation"]),  //类型，亮度，色温
        value: PropTypes.oneOfType([ //默认值
            PropTypes.array,
            PropTypes.number
        ]),
        min: PropTypes.number,   //最小值
        max: PropTypes.number,   //最大值
        ticks: PropTypes.array,  //刻度的value
        ticksLabels: PropTypes.array,    //刻度对应的标签
        step: PropTypes.number,  //步长
        trackColor: PropTypes.string    //滑块颜色
    };

    static defaultProps = {
        type:'color',
        value:50,
        min: 0,
        max: 100,
        step:1,
        ticks:[0,100],
        ticksLabels:['0','100']
    };

    componentDidMount(){
        const {slide,slideStart,slideStop,change,slideEnabled,slideDisabled,...config} = this.props;
        const options = {};
        Object.keys(config).forEach(prop=> { //将属性骆峰规则转化成下划线
            options[changeCase.snakeCase(prop)] = this.props[prop];
        });

        console.log("******options******");

        //TODO 为什么一定要配置labels，否则slider不加载
        this.slider = new Slider(this.el, {
            ...options
        });

        const events = {
            slide, slideStart, slideStop, change, slideEnabled, slideDisabled
        };
        Object.keys(events).forEach(e=> {    //监听滑块事件
            if (events[e]) {
                this.slider.on(e, events[e]);
            }
        });

        this.slideStyle(this.props);//修改滑块样式
    }

    componentWillReceiveProps(nextProps){
        const slider = this.slider;
        const variable = {
            value: value => slider.setValue(value)
            //enabled: enabled => enabled ? slider.enable():slider.disable()
        };
        Object.keys(variable).forEach(prop=> {
            if (this.props[prop] !== nextProps[prop] && nextProps[prop] != null) {
                variable[prop](nextProps[prop]);
            }
        });
        if(this.props.type==='saturation'&&this.props.trackColor!==nextProps.trackColor){ //RGB值改变
            this.slideStyle(nextProps);
        }
    }

    componentWillUnmount() {
        this.slider.destroy();
    }

    slideStyle = (props)=> {    //设置滑块样式
        const {type,trackColor}=props;
        if (type&&type==='saturation') { //饱和度选择
            $(this.el).parent().addClass('saturation');
            const saturationStyle='linear-gradient(to right, #fff 0%, '+trackColor+' 100%)';
            $(".colorPicker.saturation .slider-track").css('background-image',saturationStyle);
        }
    };

    setValue=(value)=>{  //设置插件value
        this.slider.setValue(value);
    };

    render() {

        return(
            <div className="colorPicker">
                <input ref={el => this.el = el}  type="text" />
            </div>
        )
    }

}



