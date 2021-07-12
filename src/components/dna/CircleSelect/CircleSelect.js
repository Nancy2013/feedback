import React from 'react';
import PropTypes from 'prop-types';
import style from './circle.less';
import Scroller from './Scroller'
import upimg from './image/up-f.svg'
import downimg from './image/down-f.svg'
import {isIOS}from '../../device'
export default class CircleSelect extends React.Component {


    static propTypes = {
        value: PropTypes.number,
        onSelected: PropTypes.func,
        min: PropTypes.number,
        max: PropTypes.number,
        disable: PropTypes.bool,
        unit: PropTypes.string,
        up: PropTypes.func,
        down: PropTypes.func,

    };
    static defaultProps = {
        value: 25,
        onSelected: () => {
            return this.props.value
        },
        disable: false,//默认开启
        min: 20,
        max: 30,
        unit: "℃",
        up: () => {
            console.log("请添加事件逻辑")
            //  alert(CircleSelect.defaultProps.value)
        },
        down: () => {
            console.log("请添加事件逻辑")
        },

    };
    state = {
        isShow: false
    }
    
    componentDidMount() {

        this.refs.middleNumber && this.refs.middleNumber.addEventListener("touchstart", this.touchStart, false);
        // let wheels = this.props.wheels
        // let index = wheels.indexOf(this.props.value)
        // this.props.wheels = wheels.slice(index, wheels.length).concat(wheels.slice(0, index))
        // console.log(this.props.wheels, "wheels")
    }
    componentDidUpdate() {
        this.refs.middleNumber && this.refs.middleNumber.addEventListener("touchstart", this.touchStart, false);
        // let wheels = this.props.wheels
        // let index = wheels.indexOf(this.props.value)
        // this.props.wheels = wheels.slice(index, wheels.length).concat(wheels.slice(0, index))
    }

    touchStart = () => {
        if (this.props.disable) return

        this.setState({
            isShow: !this.state.isShow
        })
        this.initTimeNum = setTimeout(() => {
            this.setState({
                isShow: false
            })
        }, 1200)
    }
    middleClick = () => {
        this.setState({
            isShow: !this.state.isShow
        })
        this.initTimeNum = setTimeout(() => {
            this.setState({
                isShow: false
            })

        }, 1200)


    }
    isTouch=(flag)=>{
        if(flag){
            clearTimeout(this.initTimeNum)
            clearTimeout(this.timenumber)
        }
    }
    onClick = (type) => {
        // console.log(this)
        // this.props.value&&(this.props.value=this.props.value+1)
        // alert(this.props.value)
        const prop = this.props[type];

        prop()
    }

    timeNum = []
    timenumber//定时号
    initTimeNum//第一次 定时号
    predata = this.props.value
    circleLinkChange = (data) => {
        console.log("circleLinkChange", data)
        // console.log("timeNum",this.timeNum) 
        //  console.log("length",this.timeNum.length)
        clearTimeout(this.initTimeNum)
        if (this.timeNum.length == 1) {

            // console.log("clearTimeout")
            clearTimeout(this.timenumber)
            this.timeNum.pop(this.timenumber)

        }
        // console.log("create time")
        this.timenumber = setTimeout(() => {
            this.setState({
                isShow: false
            })
            this.props.changeTemp(data)
        }, 1200)
        this.timeNum.push(this.timenumber)

    }
    onTouchStart=(type)=>{
        this.onClick(type)
    }
    render() {

        return (
            <div>
                {this.state.isShow == false && <div className={style.outBox} >
                    <div className={style.circle} >
                        <div className={style.up} onClick={this.props.disable||isIOS? null : this.onClick.bind(this, "up")} onTouchStart={isIOS&&this.onTouchStart.bind(this, "up")}>
                        {this.props.disable ?null:<img src={upimg} />}
                        </div>
                        <span ref="middleNumber" onClick={this.props.disable ? null : this.middleClick.bind(this)}>{this.props.value}</span>
                        <span className={style.degree}>{this.props.unit}</span>
                        <div className={style.down} onClick={this.props.disable||isIOS ? null : this.onClick.bind(this, "down")} onTouchStart={isIOS&&this.onTouchStart.bind(this, "down")}>
                        {this.props.disable ? null : <img src={downimg} />}
                        </div>
                    </div>
                </div>}
                <div className={style.scroller}>
                    {this.state.isShow}{this.state.isShow && <Scroller {...this.props} wheels={this.props.wheels} onChange={this.circleLinkChange} isTouch={this.isTouch}></Scroller>}
                </div>
            </div>

        )
    }
}