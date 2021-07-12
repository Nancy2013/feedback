import React from 'react';
import style from './index.less';
import { injectIntl} from 'react-intl';
import Slider from '../components/Slider';
import pkg from "../../package.json";
import PropTypes from 'prop-types';

export function descFunc  (cmd, formatMessage ){
    const cmdName=function (message) {
        return formatMessage({id:message})
    }
    let desc="";
    if(cmd && cmd.hasOwnProperty("pwr") ){
        desc += cmd.pwr === 1 ? cmdName('cmdON'):cmdName('cmdOFF')
    }
    if(cmd &&  cmd.hasOwnProperty("brightness") &&  cmd.brightness>0){
        desc += `${desc.length>0?" ":""}${cmdName("brightness")+" "+cmd.brightness}%`
    }
    return desc
};

export const Setting =  injectIntl(class extends React.PureComponent {

    static propTypes = {
        themeColor: PropTypes.string,     //主题颜色，由于siri、scene页面的主题颜色与‘控制页面’的themeColor可能不一致,所以增加该配置
        cmd: PropTypes.object,            //{ pwr: 1 }
        updateCmd: PropTypes.func
    };

    updateCmd=cmd=>{
        const  { updateCmd } = this.props;
        updateCmd({
            ...this.props.cmd,
            ...cmd
        })
    };
    
    render(){
        const {cmd, themeColor, intl} = this.props;
        const select = {background: themeColor||pkg.theme['@theme-color'], color: "#ffffff"}
        return (
            <div className={style.operaBox}>
                <span>{intl.formatMessage({id:'timerSettingTitle'})}</span>
                <div className={style.fatherBox}>
                    <div className={style.childBox} onClick={()=>this.updateCmd({pwr:1})}>
                        <p style={cmd && cmd.pwr === 1 ?select:undefined} >{intl.formatMessage({id:'timerSettingON'})}</p>
                    </div>
                    <div className={style.childBox} onClick={()=>this.updateCmd({pwr:0})}> 
                        <p style={cmd && cmd.pwr === 0 ?select:undefined} >{intl.formatMessage({id:'timerSettingOFF'})}</p>
                    </div>
                </div>
                <div style={{opacity: cmd.brightness?1:0.5}}>
                    <Slider key={cmd.brightness} tooltip={"hide"} slideStop={val=>this.updateCmd({brightness:val})} value={ cmd.brightness||0 } min={1} ticks={[1, 100]} />
                </div>
            </div>
        );
    }
}); 