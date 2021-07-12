import React from 'react';
import style from './SDKTimer.less'
import {timerPeriods} from './timer-util'
import NavBar from '../NavBar';
import Page from '../Page';
import { injectIntl, FormattedMessage } from 'react-intl';
import connect from "react-redux/es/connect/connect";
import {dnaSelectors} from "../../reducers";
import { addCurrentTimerRepeat} from "../../actions/timer";


//const {TYPE_COMMON,TYPE_PERIOD,TYPE_CYCLE,TYPE_RAND,Timer} =sdk.platformSDK.taskV2;

function Item({title, content, checked, onClick}) {
    return (
        <div onClick={onClick}  className={style.list}>
            <FormattedMessage id={title}/>
            <p>
                {content && <span className={style.specialStyle}>{content}</span>}
                {checked && <i  className={style.arrowHook}></i>}
            </p>

        </div>

    );
}

class RepeatSetting extends React.PureComponent {

    static defaultProps = {
        repeat :[]
    };

    render() {
        const {repeat,history,intl:{formatMessage},update} =this.props;

        return (
            <Page saveBottom>
                <NavBar title={formatMessage({id:'internal.SDKTimerV2.repeatSetting'})} right={[]}/>
                    <div  className={style.listBox}>
                        {
                            (()=>{
                                let singleCheck;

                                return timerPeriods().map((period,i)=>{
                                    const {name,desc,choose,match}=period;
                                    let checked;
                                    if(!singleCheck){
                                        singleCheck = checked = match(repeat);
                                    }
                                    return <Item key={i} title={name}
                                                 content={checked && desc && desc(repeat, formatMessage)}
                                                 checked={checked}
                                                 onClick={() => {
                                                     if (choose) {
                                                         update(choose());
                                                         history.goBack();
                                                     } else {
                                                         history.push('/timer/day');
                                                     }
                                                 }}
                                    />
                                })
                            })()
                        }
                    </div>
            </Page>
        )
    }
}


export default connect(
    state => {
        const timer = dnaSelectors.timerSelectors.getCurrent(state);
        return {
            repeat:timer.getRepeat(),
        }
    },
    {update: addCurrentTimerRepeat},

)(injectIntl(RepeatSetting));
