import React from 'react';
import style from './SDKTimer.less'
import {timerPeriods} from './timer-util'
import NavBar from '../NavBar';
import Page from '../Page';
import { injectIntl, FormattedMessage } from 'react-intl';

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

export default injectIntl(class extends React.PureComponent {

    static defaultProps = {
        repeat :[]
    };

    render() {
        const {repeat,history,timerHandler,intl:{formatMessage}} =this.props;
        console.error(repeat);

        return (
            <Page saveBottom>
                <NavBar title={formatMessage({id:'internal.SDKTimer.repeatSetting'})} right={[]}/>
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
                                    return  <Item key={i} title={name}
                                                  content={checked&&desc&&desc(repeat, formatMessage)}
                                                  checked={checked}
                                                  onClick={()=>{
                                                  if(choose){
                                                      timerHandler('UPDATE',choose());
                                                      history.goBack();
                                                  }else{
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
})
