import React from 'react';
import { injectIntl } from 'react-intl';
import style from './SDKTimer.less';
import TimerCard from './TimerCard';
import { rubbish } from './icons';
import{ setNavbar } from "./api";
import {
    cmdName
} from './util';
import {
  closeAllLog,
  getAllLog,
  delete_log
}from "./api"

class TimerExecuteRecords extends React.PureComponent {
  state = {
    allLog: [],
  }
  
  componentDidMount() {
      this.getAllLog();
      this.initNativeBarEvent(this.props);
  }

  getAllLog= async()=>{
    try{
      this.setState({
        allLog:await getAllLog()
      })
    }catch(e){
      console.error(e)
      this.state({
        allLog:-1    //fail
      })
    }
  }

  deleteLog = (log,i)=>{
    const { excute_time, stream_id } = log;
    const sendObj =  { excute_time, stream_id } 
    delete_log(sendObj,()=>{
      this.setState((prevState) => {   //外面加小括号可以代替return
        const allLog = [...prevState.allLog];
        allLog.splice(i, 1);
        return {allLog}
      });
    })
  }

  initNativeBarEvent = (props) => {
    setNavbar("log")
    window.deletAllRecord = () => {   //清空
     closeAllLog(() => {
        this.setState({
          allLog:[]
        })
      })
    }
  }
 
  render() {
  
    const formatMessage=(mes)=>cmdName.call(this,"jd.timer."+mes);
    const {allLog} = this.state;
    const successColor="#999999";
    const failColor="#E42C29";
    return <div>
      {
        allLog.length > 0 && allLog.map((log, key) => {
         
          return <TimerCard key={key} rightClick={()=>this.deleteLog(log,key)} name={log.task_name} descColor={ log.result ? successColor : failColor } desc={ log.result ?"执行成功" : "设备不在线，执行失败" } timeMH={log.timeMH} date={log.dateDesc} hasSwitch={false} rightIcon={rubbish} />

        })
      }
      {allLog.length===0&&<div className={style.noLogs}>{formatMessage("noRecordOfExecution")}</div>}
    </div>
  }
}

export default injectIntl(TimerExecuteRecords);