/*
 * @Author: your name
 * @Date: 2021-02-22 09:49:33
 * @LastEditTime: 2021-03-04 11:23:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \integrated-stove\src\components\Scroller\Scroller.js
 */
import React from 'react';
import PropTypes from 'prop-types';

import $ from 'jquery'
import  '../libs/mobiscroll/mobiscroll.2.13.2'
import  '../libs/mobiscroll/mobiscroll.2.13.2.css'
import  './scroller.css'

/*
* https://docs.mobiscroll.com/2-17-3/jquery/scroller
* */
export default class extends React.Component {
    static propTypes = {
        defaultValue:PropTypes.string,
        onChange:PropTypes.func
    };

    static defaultProps = {
    };

    componentDidMount(){
        console.error(this.props)
        this.handleChange = this.handleChange.bind(this);
        const {defaultValue,onChange,...passthrough} = this.props;

        const dpr={
            '1':43,
            '2':80,
            '3':129
        };
        const height = dpr[$("html").attr("data-dpr")]||50;

        const config = {
            theme: 'android-ics light', //皮肤样式
            display: 'inline', //显示方式 Inline
            onChange: this.handleChange,
            height:height,
            ...passthrough
        };
        const length = {'1':"oneColumn",'2':"twoColumn",'3':"threeColumn"};
        let cssClass = length[config.wheels[0].length+''];

        $(this.el).mobiscroll().scroller({
            ...config,cssClass
        });

        if (this.props.defaultValue) {
            $(this.el).mobiscroll('setValue', this.props.defaultValue)
        }
    }

    componentWillUnmount() {
        const inst =$(this.el).mobiscroll("getInst");
        if(inst && inst.destroy){
            inst.destroy();
        }
    }

    handleChange(valueText, inst){
        console.error('valueText:'+valueText)
        this.props.onChange && this.props.onChange(valueText);
    }


    render() {

        return(
            <div ref={el => this.el = el}>

            </div>
        )
    }
}
