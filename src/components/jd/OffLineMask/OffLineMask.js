import React from 'react';
import ReactDOM from 'react-dom';
import style from './OffLineMask.less';
/**
*京东平台 离线蒙版
* */
//渲染挂载dom元素对象
let offlineElement;
offlineElement=document.createElement('div');
document.body.appendChild(offlineElement);
class OffLineMask extends React.Component {
    constructor(props){
        super(props);
        this.el = document.createElement('div');
    };
    componentDidMount() {
        offlineElement.appendChild(this.el);
    }
    componentWillUnmount() {
        offlineElement.removeChild(this.el);
    }
    render() {
        return ReactDOM.createPortal(<div className={style.offlineMask}></div>,this.el)
    }
}
export default OffLineMask;
