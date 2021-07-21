/*
 * @Author: your name
 * @Date: 2021-07-15 16:43:13
 * @LastEditTime: 2021-07-15 16:44:19
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \tcl\src\panel\components\ImagesList\ImagesList.js
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import WxImageViewer from './../ImageView/WxImageViewer';
import Device from 'componentsPath/device';
import './index.css';

class Index extends React.PureComponent {
  static defaultProps = {
    list: [],
  };
  static propTypes = {
    list: PropTypes.array,
  };
  constructor(props) {
    super(props);
    this.state = {
      isOpenView: false,
      index: 0,
    };
  }
  componentDidMount() {}
  handleClickImage(index) {
    this.setState({
      isOpenView: true,
      index: index,
    });
  }
  onClose() {
    this.setState({
      isOpenView: false,
    });
  }
  changeIndex(index) {
    this.setState({
      index: index,
    });
  }

  render() {
    const { list } = this.props;
    const { isOpenView, index } = this.state;
    return (
      <div>
        {list.length > 0 ? (
          <div ref="viewer">
            <ul className={classNames('imgList')}>
              {list.map((img, _i) => {
                return (
                  <li
                    className="bgImgItem"
                    key={_i}
                    onClick={this.handleClickImage.bind(this, _i)}
                  >
                    <div
                      className="imgShow"
                      style={{ backgroundImage: `url(${img}` }}
                    ></div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
        {
          <WxImageViewer
            isOpen={isOpenView}
            speed={0}
            zIndex={isOpenView ? 3000 : -1}
            maxZoomNum={2}
            onClose={this.onClose.bind(this)}
            urls={list}
            index={index}
            pointer={
              <div
                className={classNames('viewPointer', {
                  isIphoneX: Device.isIphoneX,
                })}
              >{`${index + 1}/${list.length}`}</div>
            }
            changeIndex={this.changeIndex.bind(this)}
          />
        }
      </div>
    );
  }
}
export default Index;
