/*
 * @Author: your name
 * @Date: 2021-03-04 17:19:55
 * @LastEditTime: 2021-03-25 10:58:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \integrated-stove\src\components\dna\ErrorBar\ErrorBar.js
 */
import React from 'react';
import PropTypes from 'prop-types';
import style from './Message.less';
import error from './images/error.svg';
import close from './images/close.svg';
import { getStatusBar } from 'utilsPath';


class Message extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            statusHeight:0,
        };
    };
    static propTypes = {
        msg: PropTypes.string, //标题
        code: PropTypes.number, // 错误码
        message:PropTypes.bool, // 是否显示message
    };

    static defaultProps = {
        msg: "",
        code: 0,
        message:false,
    };

    componentDidMount() {
        this.setStatusHeight();
    }

    // 报警提示
    showMsg = () => { 
        const { code, message } = this.props;
        const localStorage =JSON.parse(window.localStorage.getItem('hidden'));
        return code!==0 && localStorage===false && message;
    }
    // 获得状态栏高度
    async setStatusHeight() { 
        const height = await getStatusBar();
        this.setState({
            statusHeight:height,
        })
    }
    close = () => {
        this.el.className = style.none;
        window.localStorage.setItem('hidden',true);
    }
    render() {
        const { msg } = this.props;
        const { statusHeight } = this.state;
        const fixedStyle = {
            marginTop:statusHeight+'px'
        }
        
        return (
            this.showMsg()&&
            <div ref={(el) => this.el = el} >
                <div className={style.errorBar} style={fixedStyle}>
                <div className={style.error}>
                    <img alt='' src={error } />
                    { msg}
                        <span className={style.close} onClick={this.close}>
                        <img alt='' src={close}/>
                    </span>
                </div>
                </div>
            </div>
        );
    };
}
export default Message;
