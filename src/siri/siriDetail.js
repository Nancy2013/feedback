import React from 'react';
import Page from '../components/dna/Page';
import style from "./index.less";
import { injectIntl } from 'react-intl';
import NavBar from './NavBar';
import iconArrow from './images/icon_arrow.svg'
import delayOnIcon from './images/delayOn.svg';
import delayOffIcon from './images/delayOff.svg'
import {
    Route,
    Switch
} from 'react-router-dom'
import TimePicker from '../components/TimePicker';
import moment from "moment"
import { addOrEditSiri } from "./api";

const SiriDetail = ({ intl, desc ,cmd, delay, history, updateDelay, getSiriList })=>{
    const disableSave = !cmd ||  Object.keys(cmd).length===0 ;
    return (
        <Page className={style.bgColor}>
            <NavBar title={intl.formatMessage({id:'siri.addShortcut'})} color={"#000000"} right={[]} />

            <div className={style.cmdDesc}>
                { disableSave ? `“ ${intl.formatMessage({id:'siri.noShortcut'})} ”` : `“ ${delay>0?delay+intl.formatMessage({id:'siri.secondsLater'}):""} ${desc(cmd)} ”` }
            </div>

            <div className={style.cmdEntry} onClick={()=>history.push("/siriDetail/command")}>
                {intl.formatMessage({id:'siri.performAction'})}
                <div className={style.cmdEntryRight}>
                    <span>{ disableSave ? intl.formatMessage({id:'siri.unSet'}) : desc(cmd) }</span>
                    <img src={iconArrow} alt=""/>
                </div>
            </div>

            <div className={style.delaySwitchOut}>
                <div className={style.delaySwitch} style={{borderWidth:delay>0 ? "1px" : 0}}>
                    <span>{ intl.formatMessage({id:'siri.delayExecution'}) }</span>
                    <img src={ delay>0 ? delayOnIcon : delayOffIcon } alt="" onClick={()=>updateDelay(delay>0 ? 0 : 10)}/>
                </div>
                {delay>0 &&<div  className={style.setDelay} onClick={()=>history.push("/siriDetail/delay")}>
                    <span>{ intl.formatMessage({id:'siri.delayTime'}) }</span>
                    <div className={style.delayRight} >
                        <span>{ delay }{ intl.formatMessage({id:'siri.second'}) }</span>
                        <img src={iconArrow} alt=""/>
                     </div>
                </div>}
            </div>
            <div onClick={ ()=> !disableSave && addOrEditSiri({cmd,delay,callback:()=>{getSiriList();history.goBack()}}) } className= {style.saveCommand} style={{ background: disableSave ? "rgba(191,191,191,1)" : "" }}>
                {intl.formatMessage({id:'siri.addToSiri'})}
            </div>
        </Page> 
    )
}

const SiriCommand=({intl, SiriSetting, cmd, updateCmd, history })=>{
   
    const disableSave = !cmd ||  Object.keys(cmd).length===0 ;
    const saveCmd = ()=>{
        console.log(1)
        updateCmd(cmd,()=>history.goBack()) ;
    }
    return(
        <Page className={style.bgColor}>
            <NavBar title={intl.formatMessage({id:'siri.selectCommand'})} color={"#000000"} right={[]} />
            <SiriSetting updateCmd={updateCmd} cmd={cmd} /> 
            <div onClick={!disableSave ? saveCmd : undefined} className= {style.saveCommand} style={{ background: disableSave ? "rgba(191,191,191,1)" : "" }}>
                {intl.formatMessage({id:'siri.confirm'})}
            </div>
        </Page>
    )
}

const DelayPage = ({delay, updateDelay, intl})=>{
    const setDelay=second=>{
        const m = second.minute()
        const s = second.second()
        updateDelay(m*60+s)
    }
    const defaultMin = parseInt(delay/60)>9 ? parseInt(delay/60):"0" + parseInt(delay/60)
    const defaultS = parseInt(delay % 60)>9 ? parseInt(delay % 60):"0" + parseInt(delay % 60) 

    const defaultValue = moment(moment().format(`YYYY-MM-DD_HH:${defaultMin}:${defaultS}`),"YYYY-MM-DD_HH:mm:ss")
    const minDate = moment().startOf('day').add(0, "s").toDate();
    const maxDate = moment().startOf('day').add(1, "h").toDate();
    return (
        <Page className={style.bgColor}>
            <NavBar title={intl.formatMessage({id:'siri.delayTime'})} color={"#000000"} right={[]} />
            <div className={style.delayTimerPicker}>
                <TimePicker onChange={setDelay} defaultValue={defaultValue} min={moment(minDate)} max ={moment(maxDate)} timeWheels={"iiss"}/>
            </div>
        </Page>
    )
}

export default  injectIntl(class extends React.PureComponent {

    state={
        cmd:{},
        delay:0
    };

    updateCmd = (cmd,callback) =>{
        this.setState({
            cmd
        },()=>callback&&callback())
    };
    
    updateDelay = delay =>{
        this.setState({
            delay
        })
    };

    render() {
        const {cmd, delay} =this.state;
        return (
            <Switch location={this.props.location} history={this.props.history} level={2}>
                <Route exact path='/siriDetail' render={(props) =>
                    <SiriDetail {...props} {...this.props} cmd={cmd} delay={delay} updateDelay={this.updateDelay} />
                }/>
                <Route exact path='/siriDetail/command' render={(props) =>
                    <SiriCommand {...props} {...this.props} cmd={cmd} updateCmd={this.updateCmd}/>
                }/>
                <Route exact path='/siriDetail/delay' render={(props) =>
                    <DelayPage {...props} {...this.props} delay={delay} updateDelay={this.updateDelay}/>
                }/>
            </Switch>
        )
    }
})
