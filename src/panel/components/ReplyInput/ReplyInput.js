import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Toast from './../Toast';
import NavBar from 'componentsPath/dna/NavBar';
import Button from 'componentsPath/dna/Button';
import Device from 'componentsPath/device';
import LoadingPage from 'componentsPath/dna/LoadingPage';
import { selectPicture, uploadFileByApp } from '@/sdk';
import WxImageViewer from './../ImageView/WxImageViewer';
import './index.css';
let requestLock = false;

class ReplyInput extends React.PureComponent {
  static defaultProps = {
    focus: false,
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
      focus: props.focus,
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
  }
  componentWillReceiveProps(nextProps) {
    const { replyFlag, message, files } = this.state;
    if (nextProps.foucus !== this.state.focus) {
      this.setState(
        {
          focus: nextProps.focus,
        },
        () => {
          if (nextProps.focus) {
            this.rePlyText.focus();
          }
        }
      );
    }
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
  handleClickFocus() {
    if (this.props.handleFocusThread) {
      this.props.handleFocusThread();
    } else {
      this.setState({
        focus: true,
      });
    }
  }
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
  // 点击发送反馈的信息
  handleSendBtn() {
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
      this.props.onSend &&
        this.props.onSend(
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
            console.log(this.msgHistory, replyFlag, res, '执行清空操作');
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
    return focus ? (
      <div
        className={classNames('replyBoxInputWrap', {
          isIphoneX: Device.isIphoneX,
          disbled: !(message2.length > 0 || showLen > 0),
        })}
      >
        <NavBar
          title={intl.formatMessage({ id: 'comment' })}
          right={{
            text: intl.formatMessage({ id: 'send' }),
            handler: this.handleSendBtn.bind(this),
          }}
          left={'close'}
          onBack={this.handlePageBack.bind(this)}
        />
        <div
          className="replyBoxInput"
          ref={(ref) => {
            this.inputDom = ref;
          }}
        >
          <div className="left">
            <textarea
              ref={(input) => {
                this.rePlyText = input;
              }}
              onChange={this.handleChangeDesc.bind(this)}
              placeholder={
                replyName
                  ? intl.formatMessage(
                      { id: 'replyToName' },
                      { name: replyName }
                    )
                  : intl.formatMessage({ id: 'postYourQuestion' })
              }
              className="problemDes"
              autoFocus="autofocus"
              value={message}
              rows="4"
            ></textarea>
            <ul className="imgList">
              {files.length > 0
                ? files.map((item, _i) => {
                    return item.status !== 'delete' ? (
                      <li key={_i} className="imgItem bgImgItem">
                        {item.status === 'success' ? (
                          <div
                            className="uploadImgWrap"
                            style={{ backgroundImage: `url(${item.src}` }}
                            onClick={this.handleViewImage.bind(this, _i)}
                          ></div>
                        ) : null}
                        {item.status === 'error' ? (
                          <div
                            className="uploadImgWrap error"
                            onClick={this.handleViewImage.bind(this, _i)}
                          >
                            <div
                              className="del"
                              onClick={(e) => {
                                this.handleDeleteImg(e, _i);
                              }}
                            ></div>
                          </div>
                        ) : null}
                        {item.status === 'loading' ? (
                          <div className="uploadImgWrap uploadLoading">
                            <LoadingPage className="uploadImgLoading" />
                            <div
                              className="del"
                              onClick={(e) => {
                                this.handleDeleteImg(e, _i);
                              }}
                            ></div>
                          </div>
                        ) : null}
                        <div
                          className="del"
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
                  className="imgItem addImg"
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
                className={classNames('viewPointer', {
                  isIphoneX: Device.isIphoneX,
                })}
              >{`${viewIndex + 1}/${viewFiles.length}`}</div>
            }
            changeIndex={this.changeIndex.bind(this)}
          />
        }
      </div>
    ) : showReply ? (
      <div
        className={classNames('replyBox')}
        onClick={this.handleClickFocus.bind(this)}
      >
        <div className="tomit placeBox">
          {intl.formatMessage({ id: 'postYourQuestion' })}
        </div>
      </div>
    ) : null;
  }
}
export default ReplyInput;
