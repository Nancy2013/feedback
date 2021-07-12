import React from 'react';
import style from './Popup.less';
import Modal from '../../Modal/index';
import PropTypes from 'prop-types';


class Popup extends React.Component {
    static propTypes={
        title:PropTypes.string, //名称
        leftLabel:PropTypes.string, //标题栏左部文字
        rightLabel:PropTypes.string, //标题栏右部文字
        leftClick:PropTypes.func,
        rightClick:PropTypes.func,
        closeSelf:PropTypes.func   //左上按钮方法
    };
    static defaultProps = {
        leftLabel:"取消",
        rightLabel:"确定",
    };


    render() {
        const {closeSelf,title,leftLabel,rightLabel,leftClick,rightClick}=this.props;
        return (
            <Modal onClose={this.props.closeSelf}  clickaway>
                <div className={style.alertBox}>
                    <div className={style.layerTitle}>
                        <span className={style.leftBox} onClick={leftClick||closeSelf}>{leftLabel}</span>
                        <p>{title}</p>
                        <span className={style.rightBox} onClick={rightClick||closeSelf}>{rightLabel}</span>
                    </div>
                    <div className={style.layerContent}>
                        {this.props.children}
                    </div>
                </div>
            </Modal>
        );
    }
}
export default Popup;