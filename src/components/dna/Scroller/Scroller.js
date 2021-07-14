/*
 * @Author: your name
 * @Date: 2021-07-14 14:24:29
 * @LastEditTime: 2021-07-14 14:28:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tcl\src\components\dna\Scroller\Scroller.js
 */
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import JRoll from 'jroll';
import './index.css';

class Index extends React.PureComponent {
  static defaultProps = {
    ID: 'scrollerWrapper',
    height: '100%',
    className: '',
  };
  static propTypes = {
    ID: PropTypes.string,
    height: PropTypes.string,
    className: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
      hide: false,
      height: props.height,
    };
    this.jroll = null;
  }
  componentWillReceiveProps(nextProps) {
    const { height } = this.props;
    if (nextProps.height !== height) {
      this.setState(
        {
          height: nextProps.height,
        },
        () => {
          this.jroll.refresh();
        }
      );
    }
  }
  componentDidMount() {
    const t = this;
    let wrappers = this.props.ID || 'wrappers';
    this.jroll = new JRoll(`#${wrappers}`, {
      preventDefault: true,
      bounce: true,
      scrollX: false,
    });
    this.jroll.refresh();
    this.jroll.on('scrollEnd', function () {
      t.props.onScrollEnd && t.props.onScrollEnd();
      if (this.y === this.maxScrollY) {
        t.props.onScrollToEnd && t.props.onScrollToEnd();
      }
    });
    this.jroll.on('scroll', function () {
      t.props.onScroll && t.props.onScroll();
    });
    this.props.onRef(this);
  }
  componentDidUpdate() {
    this.jroll.refresh();
  }
  onScrollTo(Y, t) {
    t = t || 0;
    this.jroll.scrollTo(0, Y, t, false);
  }
  onRefresh(flag) {
    if (flag) {
      this.jroll.scrollTo(0, 0, 0, false);
    }
    this.jroll.refresh();
  }

  render() {
    let { ID, className } = this.props;
    let { height } = this.state;
    return (
      <div id={ID} className={className} style={{ height: height }}>
        <ul className={`scroller`}>{this.props.children}</ul>
      </div>
    );
  }
}
export default injectIntl(Index);
