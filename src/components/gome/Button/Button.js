import React from 'react';
import style from './Button.less';
import PropTypes from 'prop-types';



const Button = function (props) {
    const image = props.image;

    return (
        <div className={style.childBox}>
            <div onClick={props.onClick}>
                <img src={image}/>
            </div>
            {props.label && <p>{props.label}</p>}
        </div>
    );
};

Button.propTypes = {
    image:PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]).isRequired,
    label:PropTypes.string,
    onClick:PropTypes.func,
    size:PropTypes.oneOf(['small', 'normal','large'])
};
Button.defaultProps ={
    size: 'normal'
};


export default Button;






