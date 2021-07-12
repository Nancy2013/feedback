import React from 'react';
import PropTypes from 'prop-types';
import style from './BottomButton.less';
import classNames from 'classnames';
export default class extends React.PureComponent {
    // PropTypes.shape({
    //                     text: PropTypes.string,
    //                     onClick: PropTypes.func
    // })
    static propTypes = {
        button:PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ])

    };
    static defaultProps = {

    };

    render() {
        const {button} = this.props;

        const buttons = Array.isArray(button) ? button :[button];

        return (
           <div className={classNames({[style.box]:true,[style.fatherBox]:true})}>
              <div className={style.childBox} onClick={buttons[0].onClick}>
                  <div>{buttons[0].text}</div>
              </div>
               {
                   buttons[1] &&
                   <div className={style.childBox} onClick={buttons[1].onClick}>
                       <div>{buttons[1].text}</div>
                   </div>
               }
           </div>
        );

    }

}