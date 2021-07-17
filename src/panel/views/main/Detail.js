import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import NavBar from 'componentsPath/dna/NavBar';
import Toast from '../../components/Toast';
import Dialog from '../../components/Dialog';
import PageStatus from '../../components/PageStatus';
import { injectIntl } from 'react-intl';
import LoadingPage from 'componentsPath/dna/LoadingPage';
import {
  getPostDetail,
  removeThread,
  setResolved,
  removePost,
  rePly,
  followPost,
  unFollowPost,
} from 'servicesPath';
import Device from 'componentsPath/device.js';
import UserInfo from '../../components/UserInfo';
import Scroller from '../../components/Scroller';
import ReplyItem from './ReplyItem.js';
import ReplyInput from '../../components/ReplyInput';
import ImagesList from '../../components/ImagesList';
import PopupBtn from '../../components/PopupBtn';
import { formatTag, formatTime } from 'utilsPath';
import 'stylesPath/detail.css';
import 'stylesPath/add.css';

const step = 20;
let requestLock = false;

class PostDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageStatus: 'loading',
      postDetail: {},
      deleteTipDailog: false,
      forumtag:
        (props.location &&
          props.location.state &&
          props.location.state.post &&
          props.location.state.post.forumtag) ||
        '',
      posts: [],
      focus: false,
      replyFlag: '', // 建立一个标识，存储下回复的内容
      replyObj: {}, // 回复的对象
      showDelete: false,
      showEnd: false,
    };
    this.postMap = {};
    this.scrollY = 0;
    this.page = 0;
  }
  componentDidMount() {
    this.getData();
  }
  getData() {
    let { userId, lid, match } = this.props;
    if (match && match.params && match.params.threadid) {
      // this.scrollerChild && this.scrollerChild.onScrollTo(0, 0);
      getPostDetail(userId, lid, {
        threadid: Number(match.params.threadid),
      }).then((res) => {
        Toast.hide();
        if (res.status === 0 && res.result) {
          this.allPosts = [...res.result.thread.posts];
          this.allPosts.forEach((_e, _i) => {
            this.postMap[_e.postid] = {
              official: _e.official,
            };
          });
          // 这里是代表删除或者是新增评论，刷新数据并且保持原来的高度；
          if (this.scrollY) {
            console.error('渲染多少条数据', this.page * step, this.page);
            this.setState(
              {
                replyFlag: `${res.result.thread.threadid}_0`,
                pageStatus: 'success',
                postDetail: { ...res.result.thread },
                posts: this.allPosts.slice(0, (this.page + 1) * step),
                showEnd:
                  this.allPosts.length <= 5 || this.allPosts.length > step
                    ? false
                    : true,
                forumtag: res.result.thread.forumtag,
              },
              () => {
                this.scrollerChild && this.scrollerChild.onRefresh();
                this.scrollerChild &&
                  this.scrollerChild.onScrollTo(this.scrollY, 0);
              }
            );
          } else {
            this.page = 0;
            this.setState(
              {
                replyFlag: `${res.result.thread.threadid}_0`,
                pageStatus: 'success',
                postDetail: { ...res.result.thread },
                posts:
                  this.allPosts.length > step
                    ? this.allPosts.slice(0, step)
                    : this.allPosts,
                showEnd:
                  this.allPosts.length <= 5 || this.allPosts.length > step
                    ? false
                    : true,
                forumtag: res.result.thread.forumtag,
              },
              () => {
                this.scrollerChild && this.scrollerChild.onRefresh();
                // console.error('this.onScrollRef', this.scrollerChild.jroll.y);
              }
            );
          }
        } else if (res.status === 0) {
          this.setState({
            pageStatus: 'null',
          });
        } else if (res.status === -14088) {
          this.setState({
            pageStatus: 'delete',
          });
        } else {
          this.setState({
            pageStatus: 'error',
          });
        }
      });
    }
  }
  handleBackHome() {
    const { history } = this.props;
    history.push({
      pathname: '/',
    });
  }
  // 删除帖子 TODO无效
  handleDeletePost() {
    this.setState({
      deleteTipDailog: true,
    });
  }
  // 确认删除帖子
  handleSureDeletePost() {
    const { postDetail } = this.state;
    let { userId, lid, intl, history } = this.props;
    Toast.show({
      type: 'loading',
      autoHide: false,
      content: intl.formatMessage({ id: 'loading' }),
    });
    this.setState(
      {
        deleteTipDailog: false,
      },
      () => {
        removeThread(userId, lid, {
          threadid: postDetail.threadid,
        }).then((res) => {
          if (res.status === 0) {
            Toast.show({
              type: 'success',
              content: intl.formatMessage({ id: 'deleteSuccess' }),
              onDidHide: () => {
                history.goBack();
              },
            });
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
          }
        });
      }
    );
  }
  handleCancelDelet() {
    this.setState({
      deleteTipDailog: false,
      showDelete: false,
    });
  }
  // 问题已解决
  handleSureResolved() {
    const { postDetail } = this.state;
    const { userId, lid, intl } = this.props;
    if (requestLock) {
      return;
    }
    Toast.show({
      type: 'loading',
      autoHide: false,
      content: intl.formatMessage({ id: 'loading' }),
    });
    requestLock = true;
    setResolved(userId, lid, {
      threadid: postDetail.threadid,
      resolved: 1,
    }).then((res) => {
      requestLock = false;
      if (res.status === 0) {
        let newPostDetail = { ...postDetail };
        newPostDetail.resolved = 1;
        this.setState(
          {
            postDetail: { ...newPostDetail },
          },
          () => {
            Toast.hide();
          }
        );
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
      }
    });
  }
  // 删除评论
  handleDeleteReply() {
    const reply = this.deleteReply;
    const { userId, lid, intl } = this.props;
    Toast.show({
      type: 'loading',
      autoHide: false,
      content: intl.formatMessage({ id: 'loading' }),
    });
    this.scrollY = this.scrollerChild.jroll.y || 0;
    removePost(userId, lid, {
      postid: reply.postid,
    }).then((res) => {
      if (res.status === 0) {
        Toast.show({
          type: 'success',
          content: intl.formatMessage({ id: 'deleteSuccess' }),
          onDidHide: () => {
            this.getData();
          },
        });
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
      }
    });
  }
  handleOnload() {
    this.setState(
      {
        pageStatus: 'loading',
      },
      () => {
        this.getData();
      }
    );
  }
  handleScrollEnd() {
    const { posts } = this.state;
    if (posts.length < this.allPosts.length) {
      this.page += 1;
      let newPosts = [
        ...posts,
        ...this.allPosts.slice(this.page * step, this.page * step + step),
      ];
      console.log(newPosts, 'newPosts');
      this.setState(
        {
          posts: [...newPosts],
        },
        () => {
          this.scrollerChild.onRefresh();
        }
      );
    } else if (
      this.allPosts.length > 5 &&
      posts.length === this.allPosts.length
    ) {
      this.setState(
        {
          showEnd: true,
        },
        () => {
          this.scrollerChild.onRefresh();
        }
      );
    }
  }
  onScrollRef = (ref) => {
    this.scrollerChild = ref;
  };
  /** 发送回复
   * @method onSendReply
   */
  onSendReply(msg, cb) {
    const { userInfo, userId, lid, intl } = this.props;
    const { postDetail, replyObj } = this.state;
    const params = {
      threadid: postDetail.threadid,
      forumtag: postDetail.forumtag,
      userid: userInfo.userId, // 用户ID
      username: userInfo.nickName, // 用户昵称
      usericon: userInfo.userIcon, // 用户头像地址
      replypostid: replyObj.postid || 0, // 回复另外一个回帖; 0-表示回复主题
      ...msg,
    };
    Toast.show({
      type: 'loading',
      content: intl.formatMessage({ id: 'loading' }),
      autoHide: false,
    });
    this.scrollY =
      (this.scrollerChild.jroll && this.scrollerChild.jroll.y) || 0;
    rePly(userId, lid, params).then((res) => {
      if (res.status === 0) {
        this.getData();
        this.setState(
          {
            focus: false,
          },
          cb && cb(res)
        );
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
  }
  /** 订阅问题
   * @method handleFollow
   */
  handleFollow() {
    const { userId, lid, intl } = this.props;
    const { postDetail } = this.state;
    if (postDetail.follow) {
      unFollowPost(userId, lid, { threadid: postDetail.threadid }).then(
        (res) => {
          if (res.status === 0) {
            const newPostDetail = { ...postDetail };
            newPostDetail.follow = 0;
            this.setState({
              postDetail: { ...newPostDetail },
            });
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
          }
        }
      );
    } else {
      followPost(userId, lid, { threadid: postDetail.threadid }).then((res) => {
        if (res.status === 0) {
          const newPostDetail = { ...postDetail };
          newPostDetail.follow = 1;
          this.setState({
            postDetail: { ...newPostDetail },
          });
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
        }
      });
    }
  }
  handleClickReplayItem(reply) {
    const { postDetail } = this.state;
    console.log('我要回复某一条回复:', reply);
    this.setState({
      focus: true,
      replyObj: reply,
      replyFlag: `${postDetail.threadid}_${reply.postid}`,
    });
  }
  onRef(ref) {
    this.replyInput = ref;
  }
  // 点击回复的按钮唤起回复帖子
  handleClickReplyPost() {
    const { postDetail } = this.state;
    this.setState({
      replyFlag: `${postDetail.threadid}_0`,
      focus: true,
      replyObj: {},
    });
  }
  handleHideDelete() {
    this.setState({
      showDelete: false,
    });
  }
  showDelete(reply) {
    this.deleteReply = { ...reply };
    this.setState({
      showDelete: true,
    });
  }
  handleDeleteReplyDialog() {
    this.setState(
      {
        showDelete: false,
      },
      () => {
        this.handleDeleteReply();
      }
    );
  }
  render() {
    const { intl, userId, lid, urlPrefix, urlParams } = this.props;
    const {
      pageStatus,
      postDetail,
      forumtag,
      deleteTipDailog,
      posts,
      focus,
      replyFlag,
      replyObj,
      showDelete,
      showEnd,
    } = this.state;
    let time = formatTime(postDetail.ctime);
    time =
      time === 'yesterday' || time === 'today'
        ? intl.formatMessage({ id: time })
        : time;
    const right = {
      text: '',
    };
    return (
      <div
        className={classNames('postDetailPage', {
          isPC: Device.isPC,
          isIphoneX: Device.isIphoneX,
        })}
        ref={(el) => (this.el = el)}
      >
        <NavBar
          title={intl.formatMessage({ id: 'detail' })}
          opacity
          color={'#000'}
        />
        {pageStatus === 'success' && postDetail ? (
          <Scroller
            className="cont"
            onScrollToEnd={this.handleScrollEnd.bind(this)}
            onScrollEnd={() => {
              this.scrolling = false;
            }}
            onScroll={() => {
              this.scrolling = true;
            }}
            onRef={this.onScrollRef}
          >
            <div className="postContent">
              <UserInfo
                icon={
                  postDetail.usericon
                    ? postDetail.usericon.indexOf('http://') > -1 ||
                      postDetail.usericon.indexOf('https://') > -1
                      ? postDetail.usericon
                      : `${urlPrefix}${postDetail.usericon}`
                    : ''
                }
                name={postDetail.username}
                time={time}
                formatTime={false}
              />
              <div className="messageWrap">
                <div
                  className="postMessage"
                  dangerouslySetInnerHTML={{
                    __html: postDetail.message.replace(/\n/g, '<br/>'),
                  }}
                ></div>
                <ImagesList list={postDetail.files || []} />
              </div>
              <div className="btnBox">
                <div className="msgTagWrap">
                  {formatTag(postDetail) && (
                    <span className={classNames('tag', formatTag(postDetail))}>
                      {intl.formatMessage({ id: formatTag(postDetail) })}
                    </span>
                  )}
                  <span className="comment">{`${intl.formatMessage({
                    id: 'reply',
                  })}   ${postDetail.replies || 0}`}</span>
                  {postDetail.mine && postDetail.mine === 1 ? (
                    <span className="threadId">{`ID: ${postDetail.threadid}`}</span>
                  ) : null}
                </div>
                <div className="btnWrap">
                  {
                    // 问题已解决按钮
                    postDetail.mine === 1 && postDetail.resolved !== 1 ? (
                      <div
                        className="resolved btn"
                        onClick={this.handleSureResolved.bind(this)}
                      >
                        {intl.formatMessage({ id: 'problemSolved' })}
                      </div>
                    ) : null
                  }
                  {
                    // 我也有此问题按钮
                    postDetail.mine !== 1 ? (
                      <div
                        className={classNames('meToo btn', {
                          follow: postDetail.follow,
                        })}
                        onClick={this.handleFollow.bind(this)}
                      >
                        {intl.formatMessage({ id: 'meToo' })}
                      </div>
                    ) : null
                  }
                </div>
              </div>
            </div>
            <div className="replyWrap">
              {posts &&
                posts.length > 0 &&
                posts.map((reply, _i) => {
                  return (
                    <ReplyItem
                      isDelete={
                        showDelete &&
                        this.deleteReply &&
                        this.deleteReply.postid === reply.postid
                      }
                      reply={reply}
                      key={_i}
                      postMap={this.postMap}
                      index={_i}
                      urlPrefix={urlPrefix}
                      showDelete={this.showDelete.bind(this)}
                      onClickReply={this.handleClickReplayItem.bind(
                        this,
                        reply
                      )}
                    />
                  );
                })}
            </div>
            {showEnd && (
              <div className="noDataTipBox">
                <span>{intl.formatMessage({ id: 'inTheEnd' })}</span>
              </div>
            )}
          </Scroller>
        ) : null}
        {pageStatus === 'loading' ? <LoadingPage /> : null}
        {pageStatus === 'null' ? (
          <PageStatus
            status={'null'}
            text={intl.formatMessage({ id: 'nullData' })}
          />
        ) : null}
        {pageStatus === 'delete' ? (
          <PageStatus
            status={'null'}
            text={intl.formatMessage({ id: 'postHasBeenDeleted' })}
          />
        ) : null}
        {
          //  加载失败
          pageStatus === 'error' ? (
            <PageStatus
              status={'error'}
              text={intl.formatMessage({ id: 'loadError' })}
              onRefresh={this.handleOnload.bind(this)}
            />
          ) : null
        }
        {
          //handleReply 手动造回复数据
          // <div className="handleReplay" onClick={this.handleReply.bind(this)}>{"手动造一条回复的数据呀呀呀呀呀呀"}</div>
        }
        {pageStatus === 'success' ? (
          <div
            className={classNames('replyBox')}
            onClick={() =>
              this.props.history.push(
                `/add/${postDetail.threadid}/${replyObj.postid}`
              )
            }
          >
            <div className="tomit placeBox">
              {intl.formatMessage({ id: 'postYourQuestion' })}
            </div>
          </div>
        ) : // <ReplyInput
        //   intl={intl}
        //   focus={focus}
        //   onRef={this.onRef.bind(this)}
        //   replyFlag={replyFlag}
        //   replyName={
        //     replyObj.official === 1
        //       ? intl.formatMessage({ id: 'systemReply' })
        //       : replyObj.username
        //   }
        //   handleFocusThread={this.handleClickReplyPost.bind(this)}
        //   onSend={this.onSendReply.bind(this)}
        //   changeFoucus={(flag) => {
        //     this.setState({ focus: flag });
        //   }}
        // />
        null}
        <PopupBtn
          visible={showDelete}
          cancelText={intl.formatMessage({ id: 'cancel' })}
          clickMask={this.handleHideDelete.bind(this)}
          clickCancel={this.handleHideDelete.bind(this)}
          btnList={[
            {
              text: intl.formatMessage({ id: 'delete' }),
              handler: this.handleDeleteReplyDialog.bind(this),
            },
          ]}
        />
        <Dialog
          visible={deleteTipDailog}
          text={intl.formatMessage({ id: 'deletePostTip' })}
          confirmText={intl.formatMessage({ id: 'delete' })}
          cancelText={intl.formatMessage({ id: 'cancel' })}
          onConfirm={this.handleSureDeletePost.bind(this)}
          onCancel={this.handleCancelDelet.bind(this)}
        />
      </div>
    );
  }
}
export default injectIntl(PostDetail);
