import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import style from './ActivityIndicator.less';
import {injectIntl} from 'react-intl';

//渲染挂载dom元素对象
let ModalRoot;
ModalRoot=document.createElement('div');
document.body.appendChild(ModalRoot);

export default injectIntl(class extends React.PureComponent {
    constructor(props){
        super(props);
        this.el = document.createElement('div');
        this.state={
            isShow:false
        }
    };

    static propTypes = {
        text:PropTypes.string
    };

    static defaultProps = {
        text: ''
    };

    componentDidMount(){
        ModalRoot.appendChild(this.el);
        this.timeoutId = setTimeout(()=>{
            this.setState({
                isShow:true
            });
        },500);
    }

    componentWillUnmount() {
        ModalRoot.removeChild(this.el);
        window.clearTimeout(this.timeoutId)
    }

    render() {
        const {formatMessage} = this.props.intl;
        const text = this.props.text || formatMessage({id:'internal.ActivityIndicator.loading'});
        const {isShow}=this.state;

        return ReactDOM.createPortal(
            <div>
            <div className={style.maskLayer}></div>
            {
                isShow&&
                <div className={text.length>6?style.box+' '+style.beyondBox : style.box}>
                    <div className={style.Spinner}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                    <div>{text}</div>
                </div>
            }

        </div>,
            this.el,
        )
    }
})