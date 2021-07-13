/*
 * @Author: your name
 * @Date: 2020-11-23 17:22:09
 * @LastEditTime: 2021-07-13 15:45:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \curtain\src\panel\App.js
 */
import React from 'react';
import { Route } from 'react-router-dom';
import Switch from '../components/TransitionSwitch';
import { injectIntl } from 'react-intl';
import Modal from 'componentsPath/Modal';
import Main from 'viewsPath/main';
import Detail from 'viewsPath/main/Detail';
import Add from 'viewsPath/main/Add';
import Success from 'viewsPath/main/Success';

const APP = class extends React.PureComponent {
  constructor(props) {
    // 构造函数
    super(props);
    this.state = {
      message: false,
    };
    console.log(props);
  }
  componentDidMount() {
    // DOM加载完成
  }
  // 全局弹窗
  componentWillReceiveProps(nextProps) {}

  render() {
    return (
      <Switch
        location={this.props.location}
        history={this.props.history}
        level={1}
      >
        <Route path="/" exact render={(props) => <Main {...props} />} />
        <Route
          path="/detail/:threadid"
          exact
          render={(props) => <Detail {...props} />}
        />
        <Route path="/add" exact render={(props) => <Add {...props} />} />
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
