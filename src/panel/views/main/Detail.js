import React from 'react';
import classNames from 'classnames';
import NavBar from 'componentsPath/dna/NavBar';
import Page from 'componentsPath/dna/Page';
import Toast from 'componentsPath/Toast';
import Loading from 'componentsPath/ActivityIndicator';
import PageStatus from './PageStatus';
import { injectIntl } from 'react-intl';
import LoadingPage from 'componentsPath/dna/LoadingPage';
import { getPostDetail, setResolved, removePost } from 'servicesPath';
import Device from 'componentsPath/device.js';
import Modal from 'componentsPath/Modal';
import UserInfo from '../../components/UserInfo';
import Scroller from '../../components/Scroller';
import ReplyItem from './ReplyItem.js';
import ImagesList from '../../components/ImagesList';
import FixBottom from 'componentsPath/dna/FixBottom';
import { formatTag, formatTime } from 'utilsPath';
import style from 'stylesPath/index.less';
import edit from '@/panel/images/editor.svg';

const step = 20;
let requestLock = false;

class PostDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageStatus: 'loading',
      postDetail: {},
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
      loading: false,
    };
    this.postMap = {};
    this.scrollY = 0;
    this.page = 0;
  }
  componentDidMount() {
    this.getData();
  }
  componentDidUpdate(prevProps) {
    if (this.props.userId !== prevProps.userId) {
      this.getData();
    }
  }
  getData() {
    let { userId, lid, match } = this.props;
    if (match && match.params && match.params.threadid) {
      // this.scrollerChild && this.scrollerChild.onScrollTo(0, 0);
      getPostDetail(userId, lid, {
        threadid: Number(match.params.threadid),
      }).then((res) => {
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

  // 问题已解决
  handleSureResolved() {
    const { postDetail } = this.state;
    const {
      userId,
      lid,
      intl: { formatMessage },
    } = this.props;
    if (requestLock) {
      return;
    }
    requestLock = true;
    setResolved(userId, lid, {
      threadid: postDetail.threadid,
      resolved: 1,
    }).then((res) => {
      requestLock = false;
      if (res.status === 0) {
        let newPostDetail = { ...postDetail };
        newPostDetail.resolved = 1;
        this.setState({
          postDetail: { ...newPostDetail },
        });
        Toast.success('operateSuccess');
      } else {
        const error = res ? res.msg || res.status : '';
        Toast.info(`${formatMessage({ id: 'operateError' })}${error}`);
      }
    });
  }
  // 删除评论
  handleDeleteReply() {
    const reply = this.deleteReply;
    const {
      userId,
      lid,
      intl: { formatMessage },
    } = this.props;
    this.setState(
      {
        loading: true,
      },
      () => {
        this.scrollY = this.scrollerChild.jroll.y || 0;
        removePost(userId, lid, {
          postid: reply.postid,
        }).then((res) => {
          this.setState(
            {
              loading: false,
            },
            () => {
              if (res.status === 0) {
                Toast.success('deleteSuccess');
                this.getData();
              } else {
                const error = res ? res.msg || res.status : '';
                Toast.info(`${formatMessage({ id: 'operateError' })}${error}`);
              }
            }
          );
        });
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
  // 唤起回复
  handleClickReplayItem(reply) {
    this.setState(
      {
        replyObj: reply,
      },
      () => {
        this.reply();
      }
    );
  }
  // 回复
  reply = () => {
    const { postDetail, replyObj } = this.state;
    const { history } = this.props;
    history.push(`/add/${postDetail.threadid}/${replyObj.postid}`);
  };
  onRef(ref) {
    this.replyInput = ref;
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
    const {
      intl: { formatMessage },
    } = this.props;
    this.setState({
      showDelete: false,
    });
    Modal.confirm(formatMessage({ id: 'deleteTip' }, { status: 1 }), () => {
      this.handleDeleteReply();
      return true;
    });
  }

  render() {
    const { intl } = this.props;
    const { pageStatus, postDetail, posts, showDelete, showEnd, loading } =
      this.state;
    let time = formatTime(postDetail.ctime);
    time =
      time === 'yesterday' || time === 'today'
        ? intl.formatMessage({ id: time })
        : time;
    const pageConfig = {
      status: pageStatus,
      onRefresh: () => {
        this.getData();
      },
    };
    return (
      <Page
        className={classNames({ [style.paddingBottomX]: Device.isIphoneX })}
      >
        <div className={style.postDetailPage} ref={(el) => (this.el = el)}>
          <NavBar
            title={intl.formatMessage({ id: 'detail' })}
            opacity
            color={'#000'}
            className={style.navbarHook}
          />
          {pageStatus === 'success' && postDetail ? (
            <Scroller
              className={style.cont}
              onScrollToEnd={this.handleScrollEnd.bind(this)}
              onScrollEnd={() => {
                this.scrolling = false;
              }}
              onScroll={() => {
                this.scrolling = true;
              }}
              onRef={this.onScrollRef}
            >
              <div className={style.postContent}>
                <UserInfo
                  name={postDetail.username}
                  time={time}
                  formatTime={false}
                />
                <div className={style.messageWrap}>
                  <div
                    className={style.postMessage}
                    dangerouslySetInnerHTML={{
                      __html: postDetail.message.replace(/\n/g, '<br/>'),
                    }}
                  ></div>
                  <ImagesList list={postDetail.files || []} />
                </div>
                <div className={style.btnBox}>
                  <div className={style.msgTagWrap}>
                    {formatTag(postDetail) && (
                      <span
                        className={classNames(
                          style.tag,
                          style[formatTag(postDetail)]
                        )}
                      >
                        {intl.formatMessage({ id: formatTag(postDetail) })}
                      </span>
                    )}
                    <span className={style.comment}>{`${intl.formatMessage({
                      id: 'reply',
                    })}   ${postDetail.replies || 0}`}</span>
                  </div>
                  <div className={style.btnWrap}>
                    {
                      // 问题已解决按钮
                      postDetail.mine === 1 && postDetail.resolved !== 1 ? (
                        <div
                          className={classNames(style.resolved, style.btn)}
                          onClick={this.handleSureResolved.bind(this)}
                        >
                          {intl.formatMessage({ id: 'resolved' })}
                        </div>
                      ) : null
                    }
                  </div>
                </div>
              </div>
              <div className={style.replyWrap}>
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
                <div className={style.noDataTipBox}>
                  <span>{intl.formatMessage({ id: 'inTheEnd' })}</span>
                </div>
              )}
            </Scroller>
          ) : null}
          {pageStatus === 'loading' && <LoadingPage />}
          {(pageStatus === 'null' ||
            pageStatus === 'error' ||
            pageStatus === 'delete') && <PageStatus {...pageConfig} />}
          {pageStatus === 'success' && (
            <div className={style.replyBox} onClick={this.reply}>
              <div className={style.placeBox}>
                <img src={edit} alt="" className={style.mr15} />
                {intl.formatMessage({ id: 'replyText' })}
              </div>
            </div>
          )}
          {showDelete && (
            <div>
              <div
                ref="element"
                className={style.maskLayer}
                onClick={this.handleHideDelete.bind(this)}
              ></div>
              <FixBottom adaptToX="padding" className={style.popBottom}>
                <div className={style.bottomBtn}>
                  <div onClick={this.handleDeleteReplyDialog.bind(this)}>
                    {intl.formatMessage({ id: 'delFeedback' })}
                  </div>
                  <div onClick={this.handleHideDelete.bind(this)}>
                    {intl.formatMessage({ id: 'cancel' })}
                  </div>
                </div>
              </FixBottom>
            </div>
          )}
        </div>
        {loading && <Loading />}
      </Page>
    );
  }
}
export default injectIntl(PostDetail);
