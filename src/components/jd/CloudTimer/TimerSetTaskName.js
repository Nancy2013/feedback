import React from 'react';
import { injectIntl } from 'react-intl';
import style from './SDKTimer.less';
import { cmdName } from './util';
import { clear } from './icons';
import Toast from '../../Toast';
import{ setNavbar } from "./api"

class TimerSetting extends React.PureComponent {
    state={
        task_name:this.props.currentTimer.task_name
    }
    componentDidMount() {
        this.initDate()
        this.initNativeBarEvent()
    }

    initDate=()=>{
        const { currentTimer }=this.props;   
        this.refs.elInput.value = currentTimer.task_name;
    }

    initNativeBarEvent = () => {
        setNavbar("detailOther");
        window.updateTaskState = () => {
            this.submit();
        }
    }

    submit = () => {
        const task_name =  this.refs.elInput.value;
        const input  = /^[\s]*$/;
        if (input.test(task_name)){   //检测是否只输入了空格
            Toast.info('请输入任务名称'); 
            return
        }
        this.props.updateCurrentTimer(
            {task_name},
            ()=>this.props.history.goBack()  //callback
        )
    }

    clearInput=()=>{
        this.refs.elInput.value="";
    }

  
    render() {
        const formatMessage=(mes)=>cmdName.call(this,"jd.timer."+mes);
        return <div>
            <div className={style.setTaskName}>
                <input type="text" placeholder={formatMessage("placeholder")} ref={"elInput"}></input>
                <div onClick={this.clearInput}>
                    {clear}
                </div>
            </div>
        </div>
    }
}

export default injectIntl(TimerSetting);