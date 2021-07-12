import React from 'react';
import style from './PopupBox.less';

import PropTypes from 'prop-types';


class PopupBox extends React.Component {
    render() {
        const title=this.props.title;
        const left=this.props.left;
        const right=this.props.right;

        return (
            <div className={style.alert}>
                <div className={style.maskLayer}></div>
                <div className={style.alertBox}>
                    <div className={style.box}>
                        <div  className={style.main}>
                            <span onClick={left.onClick}  className={style.left}>{left.label}</span>
                            <span  className={style.center}>{title}</span>
                            <span onClick={right.onClick}  className={style.right}>{right.label}</span>
                        </div>
                    </div>

                    <div>
                        {this.props.children}
                    </div>

                </div>
            </div>
        );
    }
}

PopupBox.propTypes= {
    left:PropTypes.shape({
        label: PropTypes.string,
        onClick: PropTypes.func
    }).isRequired,
    right:PropTypes.shape({
        label: PropTypes.string,
        onClick: PropTypes.func
    }).isRequired,
    title:PropTypes.string
};
PopupBox.defaultProps ={
    left:{
        label:'取消'
    },
    right:{
        label:'确定'
    }
};

export default PopupBox;