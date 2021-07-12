import React from 'react';
import style from './Delay.less';
import moment from 'moment';
import layerTimeIcon from './images/layer-time.svg';
import Popup from '../Popup'
import { injectIntl,FormattedMessage} from 'react-intl';
import FromNowDescription from '../FromNowDescription'
import connect from "react-redux/es/connect/connect";
import { query} from "../../actions/timer";
const delayOptions =[
    1,3,5,10,15,30,60,120,-1
];

function ExecTime({time,action}) {
    return (
        <div className={style.layerTime}>
            <img src={layerTimeIcon} alt=""/>
            <FromNowDescription {...{time,action}}/>
        </div>
    )
}

class Delay extends React.PureComponent {

    timeClick = (delayMinutes)=>{
        const {addTimer,history} = this.props;
        if(delayMinutes<0){
            history.push('/picker');
            // window.location.hash = '/timer';
        }else{
            addTimer(delayMinutes);
        }
    };

    render(){
        const {title,timer,closeSelf,deleteTimer,leftButton,isFetching,error,intl:{formatMessage}} = this.props;
        console.log('delay props',this.props)
        const isValid =timer && timer.time.moment.isAfter(moment())&&timer.en;
        const action = timer &&timer.cmd[Object.keys(timer.cmd)[0]]===0?formatMessage({id:'internal.Delay.closePower'}):formatMessage({id:'internal.Delay.openPower'});

        console.debug('current delay timer:'+JSON.stringify(timer));
        return (
            <Popup title={title} loading={isFetching||error} leftButton={leftButton} closeSelf={closeSelf} clickaway>
                {
                    isValid && <ExecTime {...timer} time={timer.time.moment} action={action}/>
                }
                <div className={style.layerContent}>
                    <ul  className={style.delayList}>
                        {
                            delayOptions.map(time=>{
                                return <li key={time}  onClick={()=>this.timeClick(time)}><div>
                                    {time > 0 ?
                                        <FormattedMessage
                                            id="internal.Delay.item"
                                            values={{
                                                hours:parseInt(time/60),
                                                minutes:time<60?time:0
                                            }}
                                        />
                                        :
                                        <FormattedMessage id="internal.Delay.userDefine"/>
                                    }
                                </div></li>
                            })
                        }
                    </ul>
                    {isValid && <div onClick={deleteTimer} className={style.layerLast}><FormattedMessage id="internal.Delay.cancelDelay"/></div>}
                </div>
            </Popup>

        );
    }
}


 export default connect(null,{query})(injectIntl(Delay)); 
