import React from 'react';
import style from './SDKTimer.less'
import Toast from '../../Toast';
import classNames from 'classnames';
import BottomButton from '../BottomButton'
import NavBar from '../NavBar';
import Page from '../Page';
import {injectIntl, FormattedMessage} from 'react-intl'
import {isEmpty} from  '../../utils'
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import {dnaSelectors} from "../../reducers";
import {updateCurrentTimer} from "../../actions/timer";

class CycleCommand extends React.PureComponent {

    static propTypes = {
        //当前定时
        defaultCmd:PropTypes.object,
        duration:PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state ={
            command:{...props.defaultCmd}
        };
    }

    updateCommand = (cmd)=>{    //更新开关命令，未返回值
        this.setState({
            command:cmd
        });
    };

    timeDesc=()=>{  //格式化时间样式
        const{duration,intl:{formatMessage}}=this.props;
        return formatMessage({id:'internal.SDKTimerV2.pickerMinute'},{minutes:Math.floor(duration.asMinutes())});
};

    save = ()=>{
        const {save,history,intl:{formatMessage}} =this.props;
        const {command} = this.state;
        if(!isEmpty(command)){   //有效命令判断
            save(command);
            history.goBack();
        }else {
            Toast.info(formatMessage({id:'internal.SDKTimerV2.setDataFirst'}));
        }
    };

    render() {
        const {content :Content,history,match,intl:{formatMessage}} = this.props;
        const flag = match.params.flag;
        const timeDesc=this.timeDesc();
        const {command}=this.state;
        return (
            <Page saveBottom>
                <NavBar title={flag==='cmd1'?formatMessage({id:'internal.SDKTimerV2.operateOne'}):formatMessage({id:'internal.SDKTimerV2.operateTwo'})} right={[]}/>
                <div className={style.pt40}>
                    <div className={style.listBox} onClick={()=>history.push('/timer/time/'+flag)}>
                        <div className={style.list}>
                            <FormattedMessage id="internal.SDKTimerV2.durationTime"/>
                            <p>
                                <span>{timeDesc}</span>
                                <i  className={style.arrow}></i>
                            </p>
                        </div>
                    </div>
                    <p className={classNames({[style.titleP]:true,[style.mt20]:true})}><FormattedMessage id="internal.SDKTimerV2.selectOperation"/></p>
                    <Content updateCmd={this.updateCommand} cmd = {command}/>
                    <BottomButton text={formatMessage({id:'internal.SDKTimerV2.confirm'})} onClick={this.save} enable={!isEmpty(command)}/>
                </div>
            </Page>
        )
    }
}

const mapStateToProps = (state,ownProps) => {
    const flag = ownProps.match.params.flag;
    const timer = dnaSelectors.timerSelectors.getCurrent(state);
    return {
        defaultCmd:timer[flag],
        duration:flag === 'cmd1'? timer.time1: timer.time2,
    }

};

const mapDispatchToProps = (dispatch,ownProps) => {
    const flag = ownProps.match.params.flag;
    return {
        save:(cmd)=>dispatch(updateCurrentTimer({[flag]:cmd}))
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(CycleCommand));