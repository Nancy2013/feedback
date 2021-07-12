
import React from 'react';
import style from './SocketContainer.less';

//import lightOn from './light-on.png';
//import lightOff from './light-off.png';

import PropTypes from 'prop-types';
/**
 * 插件顶部状态栏
 * */
class SocketContainer extends React.Component {
    render() {
        const plugs = this.props.outlets;
        var content ;
        if(plugs.length>3&&plugs.length<7){
            let first;
            if(plugs%2 ===0){
                first=  plugs.length/2;
            }else{
                first= Math.ceil(plugs.length/2);
            }
            content =[
                <PlugLine  plugs={plugs.slice(0,first)}/>,
                <PlugLine  plugs={plugs.slice(first,plugs.length)}/>
            ];
        }else if(plugs.length>=7){
            let first;
            if(plugs%3 ===0){
                first=  plugs.length/3;
            }else{
                first= Math.ceil(plugs.length/3);
            }
            content =[
                <PlugLine key='1' plugs={plugs.slice(0,first)}/>,
                <PlugLine key='2' plugs={plugs.slice(first,first*2)}/>,
                <PlugLine key='3' plugs={plugs.slice(first*2,plugs.length)}/>
            ];
        }else{
            content = <PlugLine plugs={plugs}/>;
        }

        return <div className ={style.socketBox}>{content}</div>;
    }
}

SocketContainer.propTypes= {
    outlets:PropTypes.arrayOf(PropTypes.shape({
        color: PropTypes.string,
        fontSize: PropTypes.number
    })).isRequired
};
SocketContainer.defaultProps ={
    outlets:[]
};


function PlugItem(props){
    const text={
        'on':'开',
        'off':'关'
    };

    return (
        <div className={style.childBox}>
            <p>{props.name} <span>{text[props.state]}</span></p>
        </div>
    );
}

function PlugLine(props){
    const plugs = props.plugs;
    const items = plugs.map((p,i) =>{
            return <PlugItem key={i} name={p.name} state={p.state}/>
        }

    );
    return (
        <div className={style.fatherBox}>{items}</div>
    );
}

export default SocketContainer;