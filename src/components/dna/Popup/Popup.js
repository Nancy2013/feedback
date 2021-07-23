import React from 'react';
import style from './Popup.less';
import FixBottom from '../FixBottom';
import PropTypes from 'prop-types';
import loadingIcon from './images/loading.png';
import classNames from 'classnames';
import { injectIntl, FormattedMessage } from 'react-intl';

class Popup extends React.PureComponent {
  static propTypes = {
    //弹出面板配置参数
    title: PropTypes.string, //名称
    leftButton: PropTypes.oneOfType([
      //如果是string则左上角是简单图标
      PropTypes.string, //PropTypes.oneOf(['cross', 'back'])
      PropTypes.shape({
        text: PropTypes.string,
        //不传默认为closeSelf
        //返回值为true 会自动调用closeSelf
        onClick: PropTypes.func,
      }),
    ]),
    rightButton: PropTypes.shape({
      text: PropTypes.string,
      onClick: PropTypes.func,
    }),
    closeSelf: PropTypes.func, //左上按钮方法
    tab: PropTypes.bool, //是否为tab风格，true则忽略title属性
    defaultActiveKey: PropTypes.string,
    clickaway: PropTypes.bool,
    loading: PropTypes.bool,
  };

  static defaultProps = {
    leftButton: 'cross',
    clickaway: false,
  };

  state = {
    currentTab: null,
  };

  goToTab = (key) => {
    this.setState({
      currentTab: key,
    });
  };

  buttonClick = (handler) => {
    const { closeSelf } = this.props;
    if (handler && handler() === true) {
      closeSelf();
    } else {
      closeSelf();
    }
  };

  render() {
    const {
      tab,
      closeSelf,
      clickaway,
      title,
      defaultActiveKey,
      children,
      loading,
    } = this.props;
    const childrenArray = Array.isArray(children) ? children : [children];
    const currentTab =
      tab &&
      (this.state.currentTab || defaultActiveKey || childrenArray[0].key);
    const clickAnywhere = clickaway ? closeSelf : undefined;
    return (
      <div className={style.popupBox}>
        <div
          ref="element"
          className={style.maskLayer}
          onClick={clickAnywhere}
        ></div>
        <div className={style.commonBox}>
          <FixBottom adaptToX="padding" className={style.background}>
            <div className={style.alertBox}>
              <div
                className={classNames({
                  [style.layerTitle]: true,
                  [style.setTab]: tab,
                })}
              >
                {typeof leftButton === 'string' ? (
                  <img src={icon[leftButton]} alt="" onClick={closeSelf} />
                ) : (
                  <div
                    className={style.leftButton}
                    onClick={() => this.buttonClick(leftButton.onClick)}
                  >
                    {leftButton.text}
                  </div>
                )}

                {tab
                  ? childrenArray.map((child) => (
                      <div
                        key={child.key}
                        onClick={() => this.goToTab(child.key)}
                        className={
                          child.key === currentTab ? style.themeColor : null
                        }
                      >
                        <span
                          className={
                            child.key === currentTab
                              ? style.borderBottomColor
                              : null
                          }
                        >
                          {child.props.tab}
                        </span>
                      </div>
                    ))
                  : title}

                {rightButton && (
                  <div
                    className={style.rightButton}
                    onClick={() => this.buttonClick(rightButton.onClick)}
                  >
                    {rightButton.text}
                  </div>
                )}
              </div>
              <div className={style.layerContent}>
                <div style={loading ? { opacity: 0.4 } : null}>
                  {tab
                    ? childrenArray.filter((child) => child.key === currentTab)
                    : this.props.children}
                </div>
                {loading && (
                  <div className={style.loadingPage}>
                    <div>
                      <img
                        src={loadingIcon}
                        className={style.loadAnimation}
                        alt=""
                      />
                      <p>
                        {' '}
                        <FormattedMessage id="internal.Popup.loading" />
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </FixBottom>
        </div>
      </div>
    );
  }
}

Popup.TabPane = ({ tab, children }) => {
  return <div>{children}</div>;
};

export default injectIntl(Popup);
