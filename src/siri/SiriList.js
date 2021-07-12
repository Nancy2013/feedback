import React from 'react';
import Page from '../components/dna/Page';
import { FormattedMessage, injectIntl} from 'react-intl';
import NavBar from './NavBar';
import style from "./index.less";
import iconArrow from './images/icon_arrow.svg'
import addSiriIcon from './images/addSiriIcon.svg';
import { addOrEditSiri } from "./api"

export default injectIntl(class Siri extends React.PureComponent {

    paramGoNative=(cmd,voice, delay)=>{
        setTimeout(()=>{    //不加延时200ms会有bug， app的bug
            addOrEditSiri({cmd, voice, delay, callback:()=>this.props.getSiriList()})
        },200)
    };
  
    render(){
        console.log(this.props)
        const { intl, desc, siriList} = this.props
        // let siriList = [{param:"pwr1",value:0,shortcutText:"关闭",voiceId:111},{param:"pwr1",value:0,shortcutText:"关闭",voiceId:222},{delay:3660,param:"pwr1",value:0,shortcutText:"关闭",voiceId:333},];
        const hasSiri = siriList.length>0;
        const navRight = !hasSiri ? [] : {icon:addSiriIcon,handler:()=>this.props.history.push("/siriDetail")}
        return (
            <Page className={style.bgColor}>

                <NavBar title={intl.formatMessage({id:'siri.siriShortcut'})}  color={"#000000"} right={navRight} exit noListIcon/>
                <div className={style.addSiriDesc}>
                    <span><FormattedMessage id="siri.addToSiri"/></span>
                    <p><FormattedMessage id="siri.addToSiriDesc"/></p>
                </div>

                {!hasSiri && 
                    <div className={style.addSiriBtn} onClick={()=>this.props.history.push("/siriDetail")}>
                        {intl.formatMessage({id:'siri.addShortcut'})}
                    </div>
                }

                {hasSiri && 
                    <div className={style.siriList}>
                        {siriList.map((index,i)=>{
                            return(
                                <div className={style.siri} key={`siriList${i}`} style={{borderWidth: i===siriList.length-1 ? 0 : "1px"}} >
                                    <div className={style.siriLeftBox} onClick={()=>this.paramGoNative(index.cmd, index.voiceId , index.delay)}> 
                                        <span> {(index.delay>0?`${index.delay}${intl.formatMessage({id:'siri.secondsLater'})} `:"") + desc(index.cmd)} </span>
                                        <p>{`“${index.shortcutText}”`}</p>
                                    </div>
                                    <img src={iconArrow} alt=" "/>
                                </div>
                            )
                        })}
                    </div>
                }
            </Page>
        )
    }
})
