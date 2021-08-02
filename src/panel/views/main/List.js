/*
 * @Author: your name
 * @Date: 2021-02-23 10:09:50
 * @LastEditTime: 2021-07-29 16:07:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \integrated-stove\src\panel\views\home\Close.js
 */
import React from 'react';
import classNames from 'classnames';
import Device from 'componentsPath/device.js';
import Toast from 'componentsPath/Toast';
import MyScroll from '@/panel/components/Scroller';
import { injectIntl } from 'react-intl';
import LoadingPage from 'componentsPath/dna/LoadingPage';
import Loading from 'componentsPath/ActivityIndicator';
import NavBar from 'componentsPath/dna/NavBar';
import PageStatus from './PageStatus';
import Page from 'componentsPath/dna/Page';
import FixBottom from 'componentsPath/dna/FixBottom';
import Modal from 'componentsPath/Modal';
import { getMyPosts, removeThread } from 'servicesPath';
import { formatTag, formatTime } from 'utilsPath';
import add from '@/panel/images/add.svg';
import style from 'stylesPath/index.less';

let requestLock = false;
let canClick = true;

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageStatus: 'loading', // loading | null |success | error
      postsList: [],
      deleteTipDailog: true,
      haveData: true,
      deletePost: {},
      loadError: false,
      showDelete: false,
      loading: false,
    };
    this.postParams = {
      page: 1, // 第几页
      pagesize: 30, // 每页显示记录数
    };
  }
  componentDidMount() {
    this.getData(true);
  }
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  getData = (init) => {
    let {
      userId,
      lid,
      intl: { formatMessage },
    } = this.props;
    const { postsList } = this.state;
    requestLock = true;
    if (init) {
      this.postParams.page = 1;
    }
    this.setState({
      pageStatus: 'loading',
    });
    getMyPosts(userId, lid, this.postParams).then((res) => {
      if (res.status === 0) {
        if (res.result && res.result.threads && res.result.threads.length > 0) {
          let haveData = true;
          if (
            res.result.total <=
            this.postParams.page * this.postParams.pagesize
          ) {
            haveData = false;
          }
          let newPostsList = [];
          if (init) {
            newPostsList = [...res.result.threads];
          } else {
            newPostsList = [...postsList, ...res.result.threads];
          }
          this.setState(
            {
              pageStatus: 'success',
              haveData: haveData,
              postsList: [...newPostsList],
            },
            () => {
              requestLock = false;
              if (init) {
                this.scrollerChild.onRefresh(true);
              }
            }
          );
        } else {
          if (init) {
            this.setState(
              {
                pageStatus: 'null',
                haveData: false,
              },
              () => {
                requestLock = false;
              }
            );
          } else {
            requestLock = false;
            this.postParams.page -= 1;
          }
        }
      } else {
        if (init) {
          this.setState(
            {
              pageStatus: 'error',
            },
            () => {
              requestLock = false;
            }
          );
        } else {
          let errorMsg = formatMessage({ id: 'pageText' }, { status: 'error' });
          if (res && res.status) {
            errorMsg = res.status;
          }
          Toast.info(errorMsg);
          this.setState(
            {
              loadError: true,
            },
            () => {
              requestLock = false;
              this.postParams.page -= 1;
              this.scrollY =
                (this.scrollerChild &&
                  this.scrollerChild.jroll &&
                  this.scrollerChild.jroll.y) ||
                0;
              this.scrollerChild && this.scrollerChild.onRefresh();
              this.scrollerChild &&
                this.scrollerChild.onScrollTo(this.scrollY, 0);
            }
          );
        }
      }
    });
  };
  handleScrollEnd = () => {
    const { haveData } = this.state;
    if (haveData && !requestLock) {
      this.setState(
        {
          loadError: false,
        },
        () => {
          this.postParams.page += 1;
          this.getData();
        }
      );
    }
  };
  onScrollRef = (ref) => {
    this.scrollerChild = ref;
  };
  handleOnload = () => {
    this.postParams = {
      page: 1,
      pagesize: 30,
    };
    this.setState(
      {
        pageStatus: 'loading',
      },
      () => {
        this.getData(true);
      }
    );
  };
  //监听长按事件，长按唤出弹窗时间为1s
  touchStart = (e, post) => {
    canClick = true;
    this.delPost && clearTimeout(this.delPost);
    this.delPost = setTimeout(() => {
      canClick = false;
      this.setState({
        deletePost: { ...post },
        showDelete: true,
      });
    }, 1000);
    console.error('touchStart');
  };
  // 滑动过程中取消定时器
  touchMove = (e, post) => {
    canClick = false;
    clearTimeout(this.delPost);
  };

  touchEnd = (e, post) => {
    //停止长按时，取消
    console.error('touchEnd');
    clearTimeout(this.delPost);
    if (canClick) {
      const { history } = this.props;
      let targetClass = e.target.className;
      // 排除按钮操作区
      if (
        !(
          targetClass === 'yes' ||
          targetClass === 'no' ||
          targetClass === 'delete'
        )
      ) {
        history.push({
          pathname: `/detail/${post.threadid}`,
          state: {
            post: { ...post },
          },
        });
        e.preventDefault();
      }
    }
    canClick = true;
  };
  handleDeletePostDialog = () => {
    const {
      intl: { formatMessage },
    } = this.props;
    this.setState({
      showDelete: false,
    });
    Modal.confirm(formatMessage({ id: 'deleteTip' }, { status: 0 }), () => {
      this.handleDelete();
      return true;
    });
  };
  handleHideDelete = () => {
    this.setState({
      showDelete: false,
    });
  };
  handleDelete() {
    let {
      userId,
      lid,
      intl: { formatMessage },
    } = this.props;
    const { deletePost } = this.state;
    this.setState(
      {
        deleteTipDailog: false,
        loading: true,
      },
      () => {
        removeThread(userId, lid, {
          threadid: deletePost.threadid,
        }).then((res) => {
          this.setState(
            {
              loading: false,
            },
            () => {
              if (res.status === 0) {
                Toast.success('deleteSuccess');
                this.getData(true);
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
  renderList() {
    const {
      intl: { formatMessage },
    } = this.props;
    const { postsList, haveData, loadError, showDelete, deletePost } =
      this.state;
    return (
      <MyScroll
        className={style.postsList}
        onScrollToEnd={this.handleScrollEnd}
        onScrollEnd={() => {
          this.scrolling = false;
        }}
        onScroll={() => {
          this.scrolling = true;
        }}
        onRef={this.onScrollRef}
      >
        {postsList.map((post, _i) => {
          let time = formatTime(post.ctime);
          time =
            time === 'yesterday' || time === 'today'
              ? formatMessage({ id: time })
              : time;
          return (
            <li
              className={classNames(style.communityItem, {
                [style.isDelete]:
                  showDelete &&
                  deletePost.threadid &&
                  deletePost.threadid === post.threadid,
              })}
              key={_i}
              onTouchStart={(e) => {
                this.touchStart(e, post);
              }}
              onTouchMove={(e) => {
                this.touchMove(e, post);
              }}
              onTouchEnd={(e) => {
                this.touchEnd(e, post);
              }}
            >
              <div className={classNames(style.infoWrap, style.tomit2)}>
                <span className={style.info}>{post.message}</span>
              </div>
              <div className={style.msgTagWrap}>
                {formatTag(post) && (
                  <span
                    className={classNames(style.tag, style[formatTag(post)])}
                  >
                    {formatMessage({ id: formatTag(post) })}
                  </span>
                )}
                <span className={style.comment}>{`${formatMessage({
                  id: 'reply',
                })}   ${post.replies || 0}`}</span>
                <span className={style.time}>{time}</span>
              </div>
            </li>
          );
        })}
        {haveData && !loadError ? (
          <div className={style.loadingTipBox}>
            <div className={style.loadingBox}>
              <LoadingPage className={style.loadingPageIcon} />
            </div>
            <span>{formatMessage({ id: 'loading' })}</span>
          </div>
        ) : null}
      </MyScroll>
    );
  }
  render() {
    const {
      intl: { formatMessage },
      history,
    } = this.props;
    const { pageStatus, showDelete, loading } = this.state;
    const pageConfig = {
      status: pageStatus,
      onRefresh: this.handleOnload,
    };
    return (
      <Page
        className={classNames({ [style.paddingBottomX]: Device.isIphoneX })}
      >
        <div className={classNames(style.messagePage)}>
          <NavBar
            title={formatMessage({ id: 'feedBack' })}
            exit
            opacity
            color={'#000'}
            className={style.navbarHook}
            right={{
              icon: add,
              handler: () => {
                history.push('/add');
              },
            }}
          />
          <div className={style.myPostsIndex}>
            <div
              className={classNames(style.myPosts)}
              ref={(el) => (this.el = el)}
            >
              {pageStatus === 'success' && this.renderList()}
              {(pageStatus === 'null' || pageStatus === 'error') && (
                <PageStatus {...pageConfig} />
              )}
              {pageStatus === 'loading' && <LoadingPage />}
            </div>
          </div>
          {showDelete && (
            <div>
              <div
                ref="element"
                className={style.maskLayer}
                onClick={this.handleHideDelete}
              ></div>
              <FixBottom adaptToX="padding" className={style.popBottom}>
                <div className={style.bottomBtn}>
                  <div onClick={this.handleDeletePostDialog}>
                    {formatMessage({ id: 'delFeedback' })}
                  </div>
                  <div onClick={this.handleHideDelete}>
                    {formatMessage({ id: 'cancel' })}
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
export default injectIntl(List);
