import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ReactDOM from 'react-dom';
import './Toast.css';
import error from './image/error.png';
import success from './image/success.png';
let globalInstance;

class Toast extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      hasMask: props.hasMask,
    };
  }
  componentDidMount(){
    const t = this;
    const { visible, type } = t.props;
    if(visible){
      t.toastTimer = setTimeout(()=>{
        t.setState({
          visible: true
        })
      },type === 'loading' ? 500 : 0)
    }
  }
  componentWillReceiveProps(nextProps) {
    const t = this;
    if(nextProps.visible === false){
       t.toastTimer && clearTimeout(t.toastTimer);
       t.setState({
          visible: nextProps.visible,
          hasMask: nextProps.hasMask,
        })
    }else{
      t.toastTimer = setTimeout(()=>{
        t.setState({
          visible: true,
          hasMask: nextProps.hasMask,
        })
      }, nextProps.type === "loading" ? 500 : 0)
    }
  }
  componentWillUnmount() {
  }
  hide(fn) {
    this.toastTimer && clearTimeout(this.toastTimer);
    this.setState({
      visible: false,
      hasMask: false,
    }, () => {
      if (typeof fn === 'function') {
        fn();
      }
    });
  }
  startCountdown() {
    const t = this;
    t.timer = setTimeout(() => {
      t.hide(t.props.onDidHide);
      clearTimeout(t.timer);
    }, t.props.duration);
  }
  renderIcon() {
    const{type, icon} = this.props;
    if(!type && !icon){
      return null;
    }
    if(type){
      switch(type){
        case 'success': 
          return <img src={success} className="success-svg toast-icon" />;
          break;
        case 'loading': 
          return <div className={"loading-svg toast-icon Spinner"}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>;
          break;
        case 'error':
          return <img src={error} className="warning-svg toast-icon" />;
          break;
        default: 
          return null;
          break; 
      }
    }
    return null;
  }
  render() {
    const t = this;
    const { className, hasMask, autoHide, content, type } = t.props;
    const { visible } = t.state;
    if (visible && autoHide) {
      t.startCountdown();
    }
    if(visible){
      return (<div className={classnames('toast', { [className]: !!className })}>
          <div className={classnames("toast-mask", {"toast-mask-hide": hasMask})}></div>
          <div className="toast-box">
            <div className={classnames("toast-content", {"toast-no-icon": !type})}>
            {
              type ? <div className="toast-icon-wrap">
                {
                  this.renderIcon()
                }
              </div> : null
            }
              
              <div className={classnames("toast-text")}>{content}</div>
            </div>
          </div>
          
      </div>);
    }
    return  <div></div>;
  }
}
Toast.propTypes = {
   className: PropTypes.string,
   visible: PropTypes.bool,
   hasMask: PropTypes.bool,
   autoHide: PropTypes.bool,
   onDidHide: PropTypes.func,
   width: PropTypes.oneOfType([
     PropTypes.string,
     PropTypes.number,
   ]),
   content: PropTypes.string,
   duration: PropTypes.number,
   transitionName: PropTypes.string,
   type: PropTypes.string,
};

Toast.defaultProps = {
    className: '',
    hasMask: true,
    onDidHide: ()=>{},
    visible: true,
    autoHide: true,
    content: '',
    duration: 1500,
    width: undefined,
    transitionName: undefined,
    type: '',
};
const WRAPPER_ID = '_BroadLinkToastGlobal';
const doc = document;
let wrapper = doc.getElementById(WRAPPER_ID);
if (!wrapper) {
  wrapper = doc.createElement('div');
  wrapper.id = WRAPPER_ID;
  doc.body.appendChild(wrapper);
}
ReactDOM.render(<Toast visible={false} />, wrapper);

Toast.show = (props) => {
  ReactDOM.render(<Toast visible={true} {...props} ref={(c) => { globalInstance = c; }} />, wrapper);
};

Toast.hide = (fn) => {
  if (globalInstance) {
    globalInstance.hide(fn);
  }
};

export default Toast;