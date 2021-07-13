/*
 * @Author: your name
 * @Date: 2021-07-12 16:00:45
 * @LastEditTime: 2021-07-13 15:50:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tcl\src\components\Root.js
 */
import React, { PureComponent } from 'react';
import * as logic from './logic';
import Modal from './Modal';
import Loading from './ActivityIndicator';
import { notifyError } from './utils';

class Root extends PureComponent {
  componentDidMount() {
    const { ready } = this.props;
  }

  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        {React.Children.map(children, (child) =>
          React.cloneElement(child, { ...this.props })
        )}
        {/* {(!isReady || isLoading || !isStatusReady) && <Loading />} */}
      </React.Fragment>
    );
  }
}

export default Root;
