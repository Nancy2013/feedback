import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactDOM from 'react-dom';
import './index.css';


class Dialog extends Component {
    constructor (props) {
        super(props);
        this.state = {
            ...props
        }
    }
    static defaultProps = {
        className: '',
        visible: true,
        onConfirm: ()=>{},
        onCancel: ()=>{},
        confirmText: '确定',
        cancel: '',
        title: ""
    }
    static propTypes = {
        className: PropTypes.string, //自定义的className
        visible: PropTypes.bool, // 是否显示
        onConfirm: PropTypes.func, // 确认的回调函数
        onCancel: PropTypes.func, // 取消的回调函数
        confirmText: PropTypes.string, // 确认的文案
        cancelText: PropTypes.string, // 取消的文案
        text: PropTypes.string, //显示的内容
        title: PropTypes.string
    }
    componentWillReceiveProps(nextProps) {
        this.setState({...nextProps})
    }
    
    render () {
        const {confirmText, cancelText, text, className, visible, title} = this.state;
        return (
            <div className={classNames("dialog", {[className]: !!className, 'hidden': !visible, "dialogHaveTitle": title})} >
                <div className="mask"></div>
                <div className="content">
                    {
                        title ? <div className="dialogTitle tomit2">{title}</div> : null
                    }
                    <div className="dialogText">{ text ? text : (this.props.children && this.props.children)}</div>
                    <div className="btn FBH">
                        {
                            cancelText ? <div className="cancelBtn tomit" onClick={()=>{this.props.onCancel()}}>{cancelText}</div> : null
                        }
                        {
                            confirmText ? <div className="confirmBtn tomit" onClick={()=>{this.props.onConfirm()}}>{confirmText}</div> : null
                        }
                    </div>
                </div>
            </div>
        )
    }
}


export default Dialog;

