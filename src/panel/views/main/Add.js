/*
 * @Author: your name
 * @Date: 2021-02-23 10:09:50
 * @LastEditTime: 2021-07-22 10:12:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \integrated-stove\src\panel\views\home\Close.js
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import Toast from '@/panel/components/Toast';
import NavBar from 'componentsPath/dna/NavBar';
import Page from 'componentsPath/dna/Page';
import Device from 'componentsPath/device';
import LoadingPage from 'componentsPath/dna/LoadingPage';
import { selectPicture, uploadFileByApp } from '@/sdk';
import { rePly, postFeedback } from 'servicesPath';
import WxImageViewer from '@/panel/components/ImageView/WxImageViewer';
import config from 'configPath';
import style from 'stylesPath/index.less';

let requestLock = false;

class ReplyInput extends React.PureComponent {
  static defaultProps = {
    focus: true,
    replyName: '',
    showReply: true,
  };
  static propTypes = {
    focus: PropTypes.bool,
    replyName: PropTypes.string,
    showReply: PropTypes.bool,
  };
  constructor(props) {
    super(props);
    this.state = {
      focus: true,
      message: '',
      replyName: '',
      replyFlag: props.replyFlag,
      isOpenView: false,
      viewIndex: 0,
      viewFiles: [],
      files: [],
    };
    // 记录输入的文字内容
    this.msgHistory = {};
  }
  componentDidMount() {
    this.props.onRef && this.props.onRef(this);
    this.rePlyText.focus();
  }
  componentWillReceiveProps(nextProps) {
    const { replyFlag, message, files } = this.state;
    // if (nextProps.foucus !== this.state.focus) {
    //   this.setState(
    //     {
    //       focus: nextProps.focus,
    //     },
    //     () => {
    //       if (nextProps.focus) {
    //         this.rePlyText.focus();
    //       }
    //     }
    //   );
    // }
    if (nextProps.replyFlag !== replyFlag) {
      let oldFiles = [];
      files.forEach((_e) => {
        if (_e.status !== 'delete') {
          oldFiles.push(_e);
        }
      });
      this.msgHistory[replyFlag] = {
        message: message,
        files: oldFiles,
      };
      let newMessage = '',
        newFiles = [];
      if (this.msgHistory[nextProps.replyFlag]) {
        newMessage = this.msgHistory[nextProps.replyFlag].message;
        newFiles = this.msgHistory[nextProps.replyFlag].files;
      }
      this.setState({
        message: newMessage,
        files: newFiles,
        replyName: nextProps.replyName,
        replyFlag: nextProps.replyFlag,
      });
    }
  }
  clearInput() {
    this.setState({
      message: '',
      files: [],
    });
  }
  // handleClickFocus() {
  //   if (this.props.handleFocusThread) {
  //     this.props.handleFocusThread();
  //   } else {
  //     this.setState({
  //       focus: true,
  //     });
  //   }
  // }
  handleChangeDesc(e) {
    const v = e.target.value;
    let len1 = v.match(/[\u4E00-\u9FA5]/g)
      ? v.match(/[\u4E00-\u9FA5]/g).length
      : 0;
    let len2 = v.length;
    let len = len1 + len2;
    if (len <= 400) {
      this.setState({
        message: e.target.value,
      });
    }
  }
  handleDeleteImg(e, index) {
    const { files } = this.state;
    e.stopPropagation();
    e.preventDefault();
    var newFiles = [...files];
    newFiles[index].status = 'delete';
    this.setState({
      files: newFiles,
    });
  }
  // 点击相机图标上传图片
  handleCamera() {
    const { files } = this.state;
    const { intl } = this.props;
    selectPicture()
      .then((res) => {
        if (res.status === 0 && res.path) {
          let index = files.length;
          let obj = {
            status: 'loading',
            path: res.path,
          };
          let newFiles = [...files];
          newFiles.push(obj);
          this.setState(
            {
              files: newFiles,
            },
            () => {
              uploadFileByApp(res.path).then((file) => {
                const { files } = this.state;
                if (file && file !== null && file.status === 0) {
                  let newFiles2 = [...files];
                  newFiles2[index].src = file.url;
                  newFiles2[index].status =
                    newFiles2[index].status === 'loading'
                      ? 'success'
                      : newFiles2[index].status;
                  this.setState({
                    files: [...newFiles2],
                  });
                } else {
                  let newFiles2 = [...files];
                  newFiles2[index].status =
                    newFiles2[index].status === 'loading'
                      ? 'error'
                      : newFiles2[index].status;
                  this.setState({
                    files: [...newFiles2],
                  });
                }
              });
            }
          );
        }
      })
      .catch(() => {
        console.log('选择图片失败');
      });
  }
  /** 发送回复
   * @method onSendReply
   */
  onSend = (msg, cb) => {
    const { userInfo, userId, lid, intl, history } = this.props;
    const { threadid, postid = 0 } = this.props.match.params;
    const { forumtag, personal, category, type } = config;

    console.log('[onSend]', this.props.match);
    let params = {
      forumtag,
      ...msg,
      userid: userInfo.userId, // 用户ID
      username: userInfo.nickName, // 用户昵称
      usericon: userInfo.userIcon, // 用户头像地址
    };
    if (threadid === undefined) {
      params = {
        ...params,
        personal,
        category,
        type,
      };
    } else {
      params = {
        ...params,
        threadid: parseInt(threadid),
        replypostid: parseInt(postid) || 0, // 回复另外一个回帖; 0-表示回复主题
      };
    }

    Toast.show({
      type: 'loading',
      content: intl.formatMessage({ id: 'loading' }),
      autoHide: false,
    });
    // this.scrollY =
    //   (this.scrollerChild.jroll && this.scrollerChild.jroll.y) || 0;
    if (threadid === undefined) {
      this.post(userId, lid, params);
    } else {
      this.reply(userId, lid, params, cb);
    }
  };

  // 回复帖子
  reply = (userId, lid, params, cb) => {
    const { history, intl } = this.props;
    rePly(userId, lid, params).then((res) => {
      if (res.status === 0) {
        cb && cb(res);
        history.goBack();
      } else {
        Toast.show({
          content: intl.formatMessage({
            id: res.status,
            defaultMessage: intl.formatMessage(
              { id: 'unknowError' },
              { code: res.status }
            ),
          }),
        });
        cb && cb(res);
      }
    });
  };

  // 添加反馈
  post = (userId, lid, params) => {
    const { history, intl } = this.props;
    postFeedback(userId, lid, params).then((_e) => {
      if (_e && _e.status === 0) {
        requestLock = false;
        Toast.hide();
        history.push({
          pathname: '/success',
          state: {
            id: _e.result,
          },
        });
      } else {
        let status = _e.status || '';
        requestLock = false;
        Toast.show({
          content: status
            ? intl.formatMessage({
                id: status,
                defaultMessage: intl.formatMessage(
                  { id: 'unknowError' },
                  { code: status }
                ),
              })
            : intl.formatMessage({ id: 'loadError' }),
        });
      }
    });
  };

  // 点击发送反馈的信息
  handleSendBtn() {
    console.log('[requestLock]', requestLock);
    const { intl } = this.props;
    let { files, message, replyFlag } = this.state;
    if (requestLock) {
      return;
    }
    let uploading = false;
    let filesList = [];
    files.forEach((_e) => {
      if (_e.status === 'loading') {
        uploading = true;
      }
      if (_e.status === 'success') {
        filesList.push(_e.src);
      }
    });
    // 存在正在上传中的图的时候
    if (uploading) {
      Toast.show({
        content: intl.formatMessage({
          id: 'uploadingImage',
        }),
      });
      return;
    }
    message = message.replace(/^(?:[\n\r\s]*)|(?:[\n\r\s]*)$/g, '');
    if (message || (filesList && filesList.length > 0)) {
      requestLock = true;
      this.onSend &&
        this.onSend(
          {
            files: filesList,
            message: message,
          },
          (res) => {
            requestLock = false;
            this.msgHistory[replyFlag] = {
              message: '',
              files: [],
            };
            if (res.status === 0) {
              this.setState({
                focus: false,
                message: '',
                files: [],
              });
            }
          }
        );
    }
  }

  handlePageBack() {
    const { intl } = this.props;
    const { files } = this.state;
    let uploading = false;
    files.forEach((_e) => {
      if (_e.status === 'loading') {
        uploading = true;
      }
    });
    // 存在正在上传中的图的时候
    if (uploading) {
      Toast.show({
        content: intl.formatMessage({
          id: 'uploadingImage',
        }),
      });
      return;
    } else {
      if (this.props.changeFoucus) {
        this.props.changeFoucus(false);
      } else {
        this.setState({
          focus: false,
        });
      }
    }
  }
  changeIndex(index) {
    this.setState({
      viewIndex: index,
    });
  }
  handleViewImage(index) {
    const { files } = this.state;
    if (files[index].status === 'success') {
      let fileList = [];
      let newIndex = 0;
      files.forEach((_e, _i) => {
        if (_e.status === 'success') {
          fileList.push(_e.src);
          if (_i === index) {
            newIndex = fileList.length - 1;
          }
        }
      });
      this.setState({
        viewFiles: fileList,
        viewIndex: newIndex,
        isOpenView: true,
      });
    } else if (files[index].status === 'error') {
      let newImgList = [...files];
      files[index].status = 'loading';
      this.setState(
        {
          files: newImgList,
        },
        () => {
          let i = index;
          uploadFileByApp(files[i].path).then((file) => {
            const { files } = this.state;
            let newImages2 = [...files];
            if (file && file !== null && file.status === 0) {
              newImages2[i].src = file.url;
              newImages2[i].status =
                newImages2[i].status === 'loading'
                  ? 'success'
                  : newImages2[i].status;
              this.setState({
                files: [...newImages2],
              });
            } else {
              newImages2[i].status =
                newImages2[i].status === 'loading'
                  ? 'error'
                  : newImages2[i].status;
              this.setState({
                files: [...newImages2],
              });
            }
          });
        }
      );
    }
  }
  onClose() {
    this.setState({
      isOpenView: false,
    });
  }
  render() {
    const { intl, showReply } = this.props;
    const {
      focus,
      message,
      files,
      replyName,
      isOpenView,
      viewIndex,
      viewFiles,
    } = this.state;
    let showLen = 0;
    files.forEach((_e) => {
      if (_e.status !== 'delete') {
        showLen += 1;
      }
    });
    let message2 = message.replace(/^(?:[\n\r\s]*)|(?:[\n\r\s]*)$/g, '');
    const { threadid } = this.props.match.params;
    return (
      <Page>
        <div
          className={classNames(style.replyBoxInputWrap, {
            isIphoneX: Device.isIphoneX,
            disbled: !(message2.length > 0 || showLen > 0),
          })}
        >
          <NavBar
            title={intl.formatMessage({
              id: threadid === undefined ? 'add' : 'reply',
            })}
            opacity
            color={'#000'}
            right={{
              text: intl.formatMessage({
                id: threadid === undefined ? 'submit' : 'send',
              }),
              handler: this.handleSendBtn.bind(this),
            }}
            disbled={!(message2.length > 0 || showLen > 0)}
          />
          <div
            className={style.replyBoxInput}
            ref={(ref) => {
              this.inputDom = ref;
            }}
          >
            <div className={style.left}>
              <textarea
                ref={(input) => {
                  this.rePlyText = input;
                }}
                onChange={this.handleChangeDesc.bind(this)}
                placeholder={
                  threadid === undefined
                    ? intl.formatMessage({ id: 'addFeedback' })
                    : intl.formatMessage({ id: 'replyText' })
                }
                className={style.problemDes}
                autoFocus="autofocus"
                value={message}
                rows="6"
              ></textarea>
              <ul className={style.imgList}>
                {files.length > 0
                  ? files.map((item, _i) => {
                      return item.status !== 'delete' ? (
                        <li
                          key={_i}
                          className={classNames(style.imgItem, style.bgImgItem)}
                        >
                          {item.status === 'success' ? (
                            <div
                              className={style.uploadImgWrap}
                              style={{ backgroundImage: `url(${item.src}` }}
                              onClick={this.handleViewImage.bind(this, _i)}
                            ></div>
                          ) : null}
                          {item.status === 'error' ? (
                            <div
                              className={classNames(
                                style.uploadImgWrap,
                                style.error
                              )}
                              onClick={this.handleViewImage.bind(this, _i)}
                            >
                              <div
                                className={style.del}
                                onClick={(e) => {
                                  this.handleDeleteImg(e, _i);
                                }}
                              ></div>
                            </div>
                          ) : null}
                          {item.status === 'loading' ? (
                            <div
                              className={classNames(
                                style.uploadImgWrap,
                                style.uploadLoading
                              )}
                            >
                              <LoadingPage className={style.uploadImgLoading} />
                              <div
                                className={style.del}
                                onClick={(e) => {
                                  this.handleDeleteImg(e, _i);
                                }}
                              ></div>
                            </div>
                          ) : null}
                          <div
                            className={style.del}
                            onClick={(e) => {
                              this.handleDeleteImg(e, _i);
                            }}
                          ></div>
                        </li>
                      ) : null;
                    })
                  : null}
                {showLen < 6 ? (
                  <li
                    className={classNames(style.imgItem, style.addImg)}
                    onClick={this.handleCamera.bind(this)}
                  ></li>
                ) : null}
              </ul>
            </div>
          </div>
          {
            <WxImageViewer
              isOpen={isOpenView}
              speed={0}
              zIndex={isOpenView ? 3000 : -1}
              maxZoomNum={2}
              onClose={this.onClose.bind(this)}
              urls={viewFiles}
              index={viewIndex}
              pointer={
                <div
                  className={classNames(style.viewPointer, {
                    isIphoneX: Device.isIphoneX,
                  })}
                >{`${viewIndex + 1}/${viewFiles.length}`}</div>
              }
              changeIndex={this.changeIndex.bind(this)}
            />
          }
        </div>
      </Page>
    );
  }
}
export default injectIntl(ReplyInput);
