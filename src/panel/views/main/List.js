/*
 * @Author: your name
 * @Date: 2021-02-23 10:09:50
 * @LastEditTime: 2021-07-14 14:55:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \integrated-stove\src\panel\views\home\Close.js
 */
// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import { injectIntl } from 'react-intl';
// import { useSelector } from 'react-redux';
// import { useHistory } from 'react-router-dom';
// import classNames from 'classnames';
// import style from 'stylesPath/index.less';
// import EmptyPage from './EmptyPage';

// const Component = (props) => {
//   const { history } = props;
//   const onRefresh = () => {};
//   return (
//     <div className={classNames(style.content, style.list)}>
//       <EmptyPage status="error" onRefresh={onRefresh} />
//     </div>
//   );
// };

// export default injectIntl(Component);

import React from 'react';
import classNames from 'classnames';
import Toast from 'componentsPath/Toast';
import MyScroll from 'componentsPath/dna/Scroller';
import { injectIntl } from 'react-intl';
import LoadingPage from 'componentsPath/dna/LoadingPage';
import EmptyPage from './EmptyPage';
import { getMyPosts, setResolved } from 'servicesPath';
import { formatTag, formatTime } from 'utilsPath';
import './../../styles/list.css';

let requestLock = false;
let canClick = true;

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageStatus: 'loading',
      postsList: [],
      deleteTipDailog: true,
      haveData: true,
      deletePost: {},
      loadError: false,
    };
    this.postParams = {
      page: 1, // 第几页
      pagesize: 30, // 每页显示记录数
    };
  }
  componentDidMount() {
    const { userId, lid, show, intl } = this.props;
    const { pageStatus } = this.state;
    this.getData(true);
    // this.props.onRef(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.show && !this.props.show) {
      this.scrollerChild && this.scrollerChild.onRefresh(true);
    }
  }
  getData = (init) => {
    let { userId, lid, intl } = this.props;
    const { postsList } = this.state;
    requestLock = true;
    if (init) {
      this.postParams.page = 1;
    }
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
              Toast.hide();
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
                Toast.hide();
              }
            );
          } else {
            requestLock = false;
            this.postParams.page -= 1;
            Toast.hide();
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
          let errorMsg = intl.formatMessage({ id: 'loadError' });
          if (res && res.status) {
            errorMsg = intl.formatMessage({
              id: res.status,
              defaultMessage: errorMsg,
            });
          }
          Toast.show({
            content: errorMsg,
          });
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
  handleScrollEnd() {
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
  }
  /** 该问题是否已解决
   * @method handleResolved
   */
  handleResolved(resolve, post, _i) {
    const { userId, lid } = this.props;
    const { postsList } = this.state;
    if (resolve) {
      setResolved(userId, lid, {
        threadid: post.threadid,
        resolved: 1,
      }).then((res) => {
        console.log('已解决操作结果：', res);
      });
    }
    let newPostsList = [...postsList];
    newPostsList[_i].hideResolve = true;
    newPostsList[_i].resolved = 1;
    this.setState({
      postsList: [...newPostsList],
    });
  }
  onScrollRef = (ref) => {
    this.scrollerChild = ref;
  };
  handleOnload() {
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
  }
  //监听长按事件，长按唤出弹窗时间为1s
  touchStart = (e, post) => {
    const { reply } = this.props;
    canClick = true;
    this.delPost && clearTimeout(this.delPost);
    this.delPost = setTimeout(() => {
      canClick = false;
      this.setState(
        {
          deletePost: { ...post },
        },
        () => {
          this.props.showDelete(post);
        }
      );
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
          pathname: `/postdetail/${post.threadid}`,
          state: {
            post: { ...post },
          },
        });
        e.preventDefault();
      }
    }
    canClick = true;
  };
  renderList() {
    const { intl, supportPersonal, showDeleteVisible, height } = this.props;
    const { postsList, haveData, deletePost, loadError } = this.state;
    return (
      <MyScroll
        className="postsList"
        onScrollToEnd={this.handleScrollEnd.bind(this)}
        onScrollEnd={() => {
          this.scrolling = false;
        }}
        onScroll={() => {
          this.scrolling = true;
        }}
        height={height}
        onRef={this.onScrollRef}
      >
        {postsList.map((post, _i) => {
          let time = formatTime(post.ctime);
          time =
            time === 'yesterday' || time === 'today'
              ? intl.formatMessage({ id: time })
              : time;
          return (
            <li
              className={classNames(
                'communityItem',
                { isPublic: supportPersonal && !post.personal },
                {
                  isDelete:
                    showDeleteVisible &&
                    deletePost.threadid &&
                    deletePost.threadid === post.threadid,
                }
              )}
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
              <div className="infoWrap tomit2">
                <span className="info">{post.message}</span>
              </div>
              <div className="msgTagWrap">
                {formatTag(post) && (
                  <span className={classNames('tag', formatTag(post))}>
                    {intl.formatMessage({ id: formatTag(post) })}
                  </span>
                )}
                <span className="comment">{`${intl.formatMessage({
                  id: 'reply',
                })}   ${post.replies || 0}`}</span>
                <span className="time">{time}</span>
              </div>
            </li>
          );
        })}
        {haveData && !loadError ? (
          <div className="loadingTipBox">
            <div className="loadingBox">
              <LoadingPage />
            </div>
            <span>{intl.formatMessage({ id: 'loading' })}</span>
          </div>
        ) : null}
      </MyScroll>
    );
  }
  render() {
    const { intl } = this.props;
    const { pageStatus, postsList, deleteTipDailog } = this.state;
    return (
      <div className={classNames('myPosts')} ref={(el) => (this.el = el)}>
        {
          //  数据为空
          pageStatus === 'null' ? <EmptyPage /> : null
        }
        {pageStatus === 'success' ? this.renderList() : null}
        {pageStatus === 'loading' ? <LoadingPage /> : null}
        {
          //  加载失败
          pageStatus === 'error' ? <EmptyPage /> : null
        }
      </div>
    );
  }
}
export default injectIntl(Message);
