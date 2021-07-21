import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import NavBar from 'componentsPath/dna/NavBar';
import Toast from './../../components/Toast';
import Dialog from './../../components/Dialog';
import PageStatus from './../../components/PageStatus';
import { injectIntl } from 'react-intl';
import { removePost } from 'servicesPath';
import Device from 'componentsPath/device.js';
import ImagesList from './../../components/ImagesList';
import UserInfo from './../../components/UserInfo';
import officialIcon from './../../images/icon.png';
import { formatTime } from 'utilsPath';
import 'stylesPath//detail.css';

let canClick = true;

class ReplyItem extends React.Component {
  static defaultProps = {
    reply: {
      postid: 1, //回帖ID
      message: '这是问题的描述',
      username: '', // 用户昵称
      usericon: '', // 用户头像地址
      official: 1, // 是否官方回复；1-是 0-否
      files: [
        // 附件；上传的图片、视频等文件
      ],
      ctime: 1300000000, // 创建时间
      replyto: '大大哥', // 回复哪个用户；未指定回复用户，此处为空串
      mine: 1, // 是否由自己创建
    },
    index: 0,
  };
  static propTypes = {
    classNames: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.state = {
      showDelete: false,
    };
  }
  componentDidMount() {}
  //监听长按事件，长按唤出弹窗时间为1s
  touchStart = (e) => {
    const { reply } = this.props;
    canClick = true;
    this.delReply && clearTimeout(this.delReply);
    this.delReply = setTimeout(() => {
      canClick = false;
      if (reply.mine === 1) {
        this.props.showDelete(reply);
      }
    }, 1000);
  };
  // 滑动过程中取消定时器
  touchMove = (e) => {
    canClick = false;
    clearTimeout(this.delReply);
  };

  touchEnd = (e) => {
    //停止长按时，取消
    clearTimeout(this.delReply);
    if (canClick) {
      let targetClass = e.target.className;
      if (
        !(
          (targetClass.indexOf('btn') > -1 && targetClass !== 'btnBox') ||
          targetClass.indexOf('imgShow') > -1
        )
      ) {
        this.props.onClickReply && this.props.onClickReply();
        e.stopPropagation();
        e.preventDefault();
      }
    }
    canClick = true;
  };
  handleHideDelete() {
    this.setState({
      showDelete: false,
    });
  }
  render() {
    const { reply, urlPrefix, intl, index, postMap, isDelete } = this.props;
    let time = formatTime(reply.ctime);
    time =
      time === 'yesterday' || time === 'today'
        ? intl.formatMessage({ id: time })
        : time;
    let userIcon = reply.usericon
      ? (reply.usericon.indexOf('http://') > -1 ||
          reply.usericon.indexOf('https://')) > -1
        ? reply.usericon
        : `${urlPrefix}${reply.usericon}`
      : '';
    return (
      <div
        className={classNames('replyItem', { isDelete: isDelete })}
        key={index}
        onTouchStart={this.touchStart}
        onTouchMove={this.touchMove}
        onTouchEnd={this.touchEnd}
      >
        <UserInfo
          official={reply.official === 1}
          formatTime={false}
          icon={reply.official === 1 ? officialIcon : userIcon}
          name={
            reply.official === 1
              ? intl.formatMessage({ id: 'systemReply' })
              : reply.username
          }
          time={time}
        />
        <div className="messageWrap">
          <div className="replyMessage">
            {reply.replypostid ? (
              <span className="replyTo">
                {intl.formatMessage({ id: 'reply' })}
                <span className="replyToName">
                  {`@${
                    postMap[reply.replypostid] &&
                    postMap[reply.replypostid].official
                      ? intl.formatMessage({ id: 'systemReply' })
                      : reply.replyto
                  }`}
                </span>
                {':  '}
              </span>
            ) : null}
            <span
              dangerouslySetInnerHTML={{
                __html: reply.message.replace(/\n/g, '<br/>'),
              }}
            ></span>
          </div>
          <ImagesList list={reply.files || []} />
        </div>
      </div>
    );
  }
}
export default injectIntl(ReplyItem);
