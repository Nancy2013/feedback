import React from 'react';
import style from './SDKTimer.less'
import moment from 'moment'
import Toast from '../../Toast';
import classNames from 'classnames';
import BottomButton from '../BottomButton'
import NavBar from '../NavBar';
import Page from '../Page';
import {injectIntl, FormattedMessage} from 'react-intl'
import {isEmpty} from  '../../utils'

export default injectIntl(class extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state ={
            command:{}
        };
        this.updateCommand=this.updateCommand.bind(this);
        this.save=this.save.bind(this);
    }

    componentDidMount(){
        const flag = this.props.match.params.flag;
        if(flag==='cmd1'){
            this.setState(
                {
                    command:this.props.command
                }
            );
        }else {
            this.setState(
                {
                    command:this.props.command2
                }
            );
        }
    }

    updateCommand = (cmd)=>{    //更新开关命令，未返回值
        this.setState({
            command:cmd
        });
    };

    timeDesc=()=>{  //格式化时间样式
        const{cmd1duration,cmd2duration,match,intl:{formatMessage}}=this.props;
        const duration = match.params.flag==='cmd1'?cmd1duration:cmd2duration;
        return formatMessage({id:'internal.SDKTimer.pickerMinute'},{minutes:moment.duration(duration*1000).asMinutes()});
};

    save(){
        const {timerHandler,history,match,intl:{formatMessage}} =this.props;
        if(!isEmpty(this.state.command)){   //有效命令判断
            const controlCommand=this.state.command['pwr']===0?{"pwr":0}:this.state.command;
            if(match.params.flag==='cmd1') {   //更新操作一设置的持续时间
                timerHandler('UPDATE',{status:controlCommand});
            }else {
                timerHandler('UPDATE',{status2:controlCommand});
            }
            history.goBack();
        }else {
            Toast.info(formatMessage({id:'internal.SDKTimer.setDataFirst'}));
        }
    }

    render() {
        const {content :Content,history,match,intl:{formatMessage}} = this.props;
        const flag = match.params.flag;
        const timeDesc=this.timeDesc();
        const command={...this.state.command};
        return (
            <Page saveBottom>
                <NavBar title={flag==='cmd1'?formatMessage({id:'internal.SDKTimer.operateOne'}):formatMessage({id:'internal.SDKTimer.operateTwo'})} right={[]}/>
                <div className={style.pt40}>
                    <div className={style.listBox} onClick={()=>history.push('/timer/time/'+flag)}>
                        <div className={style.list}>
                            <FormattedMessage id="internal.SDKTimer.durationTime"/>
                            <p>
                                <span>{timeDesc}</span>
                                <i  className={style.arrow}></i>
                            </p>
                        </div>
                    </div>
                    <p className={classNames({[style.titleP]:true,[style.mt20]:true})}><FormattedMessage id="internal.SDKTimer.selectOperation"/></p>
                    <Content {...{command,updateCommand:this.updateCommand}}/>
                    <BottomButton text={formatMessage({id:'internal.SDKTimer.confirm'})} onClick={this.save} enable={!isEmpty(command)}/>
                </div>
            </Page>
        )
    }
})