/*
 * @Author: your name
 * @Date: 2021-07-12 16:00:45
 * @LastEditTime: 2021-07-19 17:38:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tcl\src\components\Root.js
 */
import React, { PureComponent } from 'react';
import * as logic from './logic';
import Modal from './Modal';
import Loading from './ActivityIndicator';
import { notifyError } from './utils';

function autoCloseModal(Component) {
  const modalsMap = {};
  return class extends PureComponent {
    constructor(props) {
      super(props);
      Modal.onOpen(this.onModalOpen);
    }

    onModalOpen = (id) => {
      const { location } = this.props;
      const { pathname } = location;
      let modals = modalsMap[pathname];
      if (!modals) {
        modals = [];
        modalsMap[pathname] = modals;
      }
      modals.push(id);
      console.debug(`open new modal : ${JSON.stringify(modalsMap)}`);
    };

    componentWillUpdate(nextProps) {
      const { location } = this.props;
      // console.debug(`current location ${JSON.stringify(location)} `);
      // console.debug(`history info ${nextProps.history.action} , ${JSON.stringify(nextProps.history.location)}`);

      if (
        nextProps.history.action === 'POP' &&
        nextProps.location !== location
      ) {
        const { pathname } = location;
        let modals = modalsMap[pathname];
        if (modals) {
          modals.forEach((id) => Modal.close(id));
          modalsMap[pathname] = null;
          console.debug(
            `leaving page ${JSON.stringify(
              location
            )},after close all ${JSON.stringify(modalsMap)}`
          );
        }
      }
    }

    render() {
      return <Component {...this.props} />;
    }
  };
}

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

export default autoCloseModal(Root);
