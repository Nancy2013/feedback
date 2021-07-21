/*
 * @Author: your name
 * @Date: 2021-07-15 17:11:32
 * @LastEditTime: 2021-07-15 17:13:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tcl\src\panel\components\PageStatus\pageStatus.js
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Device from 'componentsPath/device';
import './index.css';
import Button from 'componentsPath/dna/Button';
import FailIcon from './images/fail.png';
import NullIcon from './images/null.png';
import { injectIntl } from 'react-intl';
import { inject, toggleInject } from '../../../components/injector';

class App extends React.Component {
  static propTypes = {
    status: PropTypes.string, // 状态： error null
    text: PropTypes.string,
  };
  static defaultProps = {
    status: 'error',
    text: '',
  };
  constructor(props) {
    super(props);
    this.state = {
      status: props.status,
      text: props.text,
    };
  }
  componentDidMount() {}
  handleClickBtn = () => {
    this.props.onRefresh && this.props.onRefresh();
  };
  render() {
    const { intl, icon } = this.props;
    const { status, text } = this.state;

    return (
      <div className={`pageStatus page_status_${status}`}>
        <div
          className={
            status === 'error'
              ? 'pageStatusIcon failIcon'
              : 'pageStatusIcon nullIcon'
          }
          style={icon && { backgroundImage: `url(${icon})` }}
        />
        <p>
          {text ? text : intl.formatMessage({ id: `page_status_${status}` })}
        </p>
        {status === 'error' && (
          <Button
            className="btnCenter"
            text={intl.formatMessage({ id: 'reload' })}
            onClick={this.handleClickBtn}
          />
        )}
      </div>
    );
  }
}
export default inject((selecter) => {
  return {};
})(injectIntl(App));
