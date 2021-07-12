import React from 'react';
import PropTypes from 'prop-types';

import $ from 'jquery'
import moment from 'moment'
import '../../../libs/mobiscroll/mobiscroll.2.13.2'
import '../../../libs/mobiscroll/mobiscroll.2.13.2.css'

const FORMAT = 'HH:mm:ss';    //格式化时间样式

export default class extends React.Component {
    static propTypes = {
        onChange: PropTypes.func,
        value: PropTypes.string,
        wheels:PropTypes.array
    };

    static defaultProps = {
        cssClass: "",
        value: 25,
        showLabel:false
    };

    componentDidMount() {
        console.dir(this.el, "wheels")
        this.el.addEventListener("touchstart", this.touchStart, true);

        const { type, onChange, ...passthrough } = this.props;

        const dpr = {
            '1': 84,
            '2': 168,
            '3': 252
        };
        const height = dpr[$("html").attr("data-dpr")] || 50;
        const config = {
            theme: 'android-ics light',
            display: 'inline',
            showLabel: this.props.showLabel,
            cssClass: this.props.cssClass,
            wheels: [
                [{
                    label: " ",
                    values: this.props.wheels,
                    keys: this.props.wheelsKeys,

                }]
            ],
            height: height,
            rows: 3
        }



        $(this.el).mobiscroll().scroller({
            ...config,
            onChange: (event, inst) => {
                // console.log("onChange",inst.values)
                // console.log("get",inst.getValue())
                onChange(inst.values[0])
            },
            onBeforeShow:(inst)=>{
                inst.setValue([this.props.value])
            }
        });

    }


    touchStart = () => {

        this.props.isTouch(true)
        console.log("touchStart")
    }
    componentWillUnmount() {
        const inst = $(this.el).mobiscroll("getInst");
        if (inst && inst.destroy) {
            inst.destroy();
        }
    }

    render() {

        return (
            <div ref={el => this.el = el}>

            </div>
        )
    }
}
