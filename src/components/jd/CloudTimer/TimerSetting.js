import React from 'react';
import { injectIntl } from 'react-intl';
import style from './SDKTimer.less';
import classNames from 'classnames';

class TimerSetting extends React.PureComponent {
  
    render() {
        const { intl,update,cmd } = this.props;
        const { formatMessage } = intl;
        return <div>
            {/* <NavBar title={intl.formatMessage({ id: 'title' })} /> */}
            <div className={style.setting}>
                <div>{formatMessage({id:"jd.timer.aircondition"})}</div>
                <hr></hr>
                <div>
                    <div onClick={update.bind(this, {"Power":0})} className={classNames({[style.settingActive]:cmd && cmd.Power === 0})} style={{background:cmd && cmd.Power === 0?"#209bda":""}}>{formatMessage({id:"jd.timer.closeTimer"})}</div>

                    <div onClick={update.bind(this,{"Power":1})} className={classNames({[style.settingActive]:cmd && cmd.Power === 1})} style={{background:cmd && cmd.Power === 1?"#209bda":""}}>{formatMessage({id:"jd.timer.openTimer"})}</div>
                </div>
            </div>
        </div>
    }
}

export default injectIntl(TimerSetting);