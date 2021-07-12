import React from 'react';
import PropTypes from 'prop-types';
import Swiper from '../../libs/swiper/swiper4.js';
import '../../libs/swiper/swiper4.css';
import '../../libs/swiper/hooks.css';

const ZOOMMAX = 5;    //最大缩放焦距（放大倍率）

export default class extends React.PureComponent {
    static propTypes = {
        /*initial properties*/
        autoplay: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),  //自动切换的时间间隔（单位ms），不设定该参数slide不会自动切换,用户操作后autoplay停止
        direction: PropTypes.oneOfType(['horizontal', 'vertical']),   //滑动方向
        zoom: PropTypes.bool,    //焦距功能：双击slide会放大，并且在手机端可双指触摸缩放
        paginationClickable: PropTypes.bool, //点击分页器的指示点分页器是否会控制Swiper切换
        //onInit: PropTypes.func,  //回调函数，初始化后执行
        slideTo:PropTypes.func, //滑动到指定slide,参数：index:slide的数字，speed :滑动速度，runCallbacks :回调函数
        slideChange:PropTypes.func, //滑动,slide发生改变

        /*add properties*/
        paginationStyle: PropTypes.oneOfType(['bullets', 'button', 'scrollbar']),    //分页器容器样式,点，按钮，滑动条
    };

    static defaultProps = {
        autoplay: false,
        direction: 'horizontal',
        zoom: false,
        paginationStyle: 'bullets',
        paginationClickable: true
    };

    componentDidMount() {
        let {slideChange,...options} = {...this.props};

        switch (options['paginationStyle']) {
            case 'button':
                options['navigation'] = {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                };
                break;
            case 'scrollbar':
                options['scrollbar'] ={
                    el: '.swiper-scrollbar',
                };
                break;
            default:
                options['pagination'] = {
                    el: '.swiper-pagination'
                };
        }

        const events={slideChange};
        let eventConfig={};
        Object.keys(events).forEach(e=>{
            eventConfig[e]=events[e];
        });

        let that = this;
        setTimeout(()=> {
            that.swiper = new Swiper(that.el, { //延迟是为了让下面的点加载出来
                ...options,
                on:eventConfig //监听事件
            });
        }, 500);
    }

    componentWillUnmount() {
        this.swiper.destroy(true, true); //deleteInstance:删除实例，cleanStyles:删除样式
    }

    componentWillReceiveProps(nextProps){
    }

    slideTo=(index,speed,callbacks)=>{  //滑动slide到固定slide,index从0开始
        this.swiper.slideTo(index,speed,callbacks);
    };

    render() {
        const {children,zoom,paginationStyle}=this.props;

        return (
            <div className="swiper-container" ref={el => this.el = el}>
                <div className="swiper-wrapper">
                    {React.Children.map(children, (item, i)=> {
                        return (
                            <div className="swiper-slide" key={i}>
                                {
                                    zoom &&
                                    <div className="swiper-zoom-container" data-swiper-zoom={ZOOMMAX}>
                                        {item}
                                    </div>
                                }

                                {
                                    zoom !== true &&
                                    item
                                }
                            </div>
                        );
                    })}
                </div>
                {
                    paginationStyle === "bullets" &&
                    <div className="swiper-pagination"></div>
                }
                {
                    paginationStyle === 'button' &&
                    <div className="swiper-button-prev"></div>
                }
                {
                    paginationStyle === 'button'&&
                    <div className="swiper-button-next"></div>
                }
                {
                    paginationStyle === 'scrollbar' &&
                    <div className="swiper-scrollbar"></div>
                }
            </div>
        )
    }
}