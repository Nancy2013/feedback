import React from 'react';
import { injectIntl } from 'react-intl';
import style from './SDKTimer.less';
import SwitchButton from '../SwitchButton';
import classNames from 'classnames';
import { cmdName } from './util';
import{ setNavbar } from "./api";
import Toast from '../../Toast';
const weekCustom = ["everyday", "workingDay", "weekend"];
const weeks = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const RepeatCard = ({ checked, repeat, formatMessage, updateRepeat, checkSwitch }) => {
    const memu = {
        everyday:[1,2,3,4,5,6,7],
        workingDay:[1,2,3,4,5],
        weekend:[6,7]
    }
    const checkOne=(week)=>{
        const indexOf = repeat.indexOf(week);
        const newRepeat = [...repeat]
        if(indexOf!==-1){
            newRepeat.splice(indexOf,1)
        }else{
            newRepeat.push(week)
        }
        updateRepeat(newRepeat)
    }
    return <div className={style.repeatCard}>
        <div>
            <div>{formatMessage("repeat")}
                {checked && <div>{formatMessage("CheckAtLeastOneDate")}</div>}
            </div>
            <div><SwitchButton checked={checked} onClick={checkSwitch} /></div>
        </div>
        {checked && <div className={style.repeatWeek}>
            <hr></hr>
            {weekCustom.map((week, k) => {
                return <span key={k} className={classNames({ [style.activeWeek]: JSON.stringify(repeat) === JSON.stringify(memu[week]) })} onClick={()=>updateRepeat(memu[week])}>{formatMessage(week)}</span>
            })}
            <hr></hr>
            {weeks.map((week, k) => {
                return <span key={k} className={classNames({ [style.activeWeek]: repeat.indexOf(k+1)!==-1 })} onClick={()=>checkOne(k+1)}>{formatMessage(week)}</span>
            })}
        </div>}
        {!checked && <React.Fragment><hr></hr><div className={style.repeatOnly}>{formatMessage("runOnce")}</div></React.Fragment>}
    </div>
}

class TimerRepeat extends React.PureComponent {

    state = {
        repeat: this.props.currentTimer.repeat,
        checked:this.props.currentTimer.repeat.length>0
    }
    
    componentDidMount() {
        this.initNativeBarEvent();
    }
  
    initNativeBarEvent = () => {
        setNavbar("detailOther");
        window.updateTaskState = () => {
            this.submit()
        }
    }
    
    updateRepeat=(repeat)=>{
        this.setState({
            repeat:repeat.sort() 
        })
    }

    submit=()=>{
        const {checked, repeat} = this.state;
        if(checked&&repeat.length===0){
            Toast.info('至少勾选一个日期');
            return
        }
        this.props.updateCurrentTimer({repeat:repeat},()=>this.props.history.goBack())
    }

    checkSwitch =()=> {
        const { repeat, checked }= this.state
        this.setState({
            checked: !checked,
            repeat : checked ? [] : repeat
        })
    }
    render() {
        const { repeat } = this.state;
        const formatMessage=(mes)=>cmdName.call(this,"jd.timer."+mes)
        return <div>
            <RepeatCard checked={this.state.checked} repeat={repeat} updateRepeat={this.updateRepeat} formatMessage={formatMessage} checkSwitch={this.checkSwitch}/>
        </div>
    }
}


export default injectIntl(TimerRepeat);