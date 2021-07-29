/*
 * @Author: your name
 * @Date: 2020-11-23 17:22:09
 * @LastEditTime: 2021-07-29 09:59:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \curtain\src\panel\App.js
 */
import React from 'react';
import { Route } from 'react-router-dom';
import Switch from '../components/TransitionSwitch';
import { injectIntl } from 'react-intl';
import Main from 'viewsPath/main';
import Detail from 'viewsPath/main/Detail';
import Add from 'viewsPath/main/Add';
import Success from 'viewsPath/main/Success';
import { getUserInfo, initSDK } from '@/sdk';
import { getUrlParams } from 'utilsPath';

const APP = class extends React.PureComponent {
  constructor(props) {
    // 构造函数
    super(props);
    this.state = {
      userId: '',
      lid: 'cf7a67e78338c7401deaeb96488f46fb',
      userInfo: {},
      urlParams: getUrlParams(),
    };
    console.log(props);
  }
  componentDidMount() {
    // DOM加载完成
    const { ready } = this.props;
    if (ready) {
      this.initPage();
    }
  }
  // 全局弹窗
  componentWillReceiveProps(nextProps) {}

  /** 界面初始化
   * @method initPage
   */
  initPage() {
    let p1 = getUserInfo();
    let p2 = initSDK();
    let promiseList = [p1, p2];
    Promise.all(promiseList).then((resList) => {
      console.log('--------  resList  ----------', resList);
      let userInfo = resList[0];
      let lidObj = resList[1];
      this.setState({
        userId: userInfo.userId,
        lid: lidObj.lid,
        userInfo: { ...userInfo },
      });
    });
  }

  render() {
    return (
      <Switch
        location={this.props.location}
        history={this.props.history}
        level={1}
      >
        <Route
          path="/"
          exact
          render={(props) => <Main {...props} {...this.state} />}
        />
        <Route
          path="/detail/:threadid"
          exact
          render={(props) => <Detail {...props} {...this.state} />}
        />
        <Route
          path="/add/:threadid?/:postid?"
          exact
          render={(props) => <Add {...props} {...this.state} />}
        />
        <Route
          path="/success"
          exact
          render={(props) => <Success {...props} />}
        />
      </Switch>
    );
  }
};
export default injectIntl(APP);
