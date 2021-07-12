import React from 'react';
import style from './Bottom.less';
import PropTypes from 'prop-types';

import './swiper.css';
import $ from 'jquery'
import Swiper from './swiper.jquery.umd'
/**
 * 国美平台底部
 * */
const MAX_NUMBER = 4;

class Bottom extends React.Component {

    componentDidMount(){

        if(React.Children.count(this.props.children)>MAX_NUMBER){
            new Swiper(this.el, {
                slidesPerView: MAX_NUMBER,
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev'
            });
        }
    }

    shouldComponentUpdate(){
        return false;
    }

    render() {
        const children = this.props.children;
        const needSwipe = React.Children.count(children)>4 ;

        return(
            <div className={style.btn}>
                <div className="swiper-container" ref={el => this.el = el}>
                    <div className={style.fatherBox + ' swiper-wrapper'}>
                        {React.Children.map(children,(item)=>{
                            return (
                                <div className={(!needSwipe?style.childBox:" ") + ' swiper-slide'}>
                                    {item}
                                </div>
                            );
                        })}
                    </div>
                    {
                        needSwipe&&
                        [
                            <div key='next' className="swiper-button-next"></div>,
                            <div key='prev' className="swiper-button-prev"></div>
                        ]
                    }

                </div>
            </div>
        )
    }
}

Bottom.propTypes= {

};
Bottom.defaultProps ={
};

export default Bottom;