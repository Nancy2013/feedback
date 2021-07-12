import React from 'react';
import style from './List.less';
import PropTypes from 'prop-types';

/**
 * 国美平台列表
 */
export default function (props) {
    const lined=props.lined;

    return (
        <ul className={lined?(style.content+' '+style.splitLine):style.content}>
            {React.Children.map(props.children,(child,i)=>{
                return <li className={style.box}>{child} </li>
            })}
        </ul>
    );

}
