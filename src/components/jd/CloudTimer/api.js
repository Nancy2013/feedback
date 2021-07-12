import sdk from 'broadlink-jssdk';
import Toast from '../../Toast';
import { addTaskFormat, formatLog, formatTimerFromList, rejectToast } from './util'
import moment from 'moment';
let feedid , deviceName ;
let delayLoadingTimerOut=null;

//获取设备feed_id  以便于定时接口使用
export function initDeviceData() {
    return new Promise((resolve, reject) => {
        sdk.platformSDK.io.initDeviceData(function(suc){
            feedid= suc.device.feed_id;
            deviceName= suc.device.deviceName;
            resolve( suc.device )
        })
    })
}

function delayLoading() {
    clearTimeout(delayLoadingTimerOut);
    delayLoadingTimerOut=null;
    delayLoadingTimerOut=setTimeout(function(){
        sdk.platformSDK.app.loading(true);
    },500)
}

function hideLoading(){
    clearTimeout(delayLoadingTimerOut);
    delayLoadingTimerOut=null;
    sdk.platformSDK.app.loading(false);
}

//获取最新的一条定时信息（jd接口提供）
export function getNearTime(callback) {
    const params = { url: 'service/getLatestTaskInfoByFeedId', feedId: { feed_id: feedid } };
    sdk.platformSDK.util.post(params.url, params.feedId,callback)
}

//查询定时列表
export function getTimerList() {
    const feed_ids = { feed_ids: "[" + feedid + "]" };
    sdk.platformSDK.app.loading(true);
    return new Promise((resolve, reject) => {
        sdk.platformSDK.util.post("service/getTimedTaskByFeedIds", feed_ids, function (res) {
            const success = !res.error && res.status===0;
            if(success){
                const timers = (res.result && res.result.length >= 1) ? res.result : [] ;
                console.log(timers, "接口获取到的timers");
                let handleList = [];
                timers.forEach(timer=>{
                    handleList.push(formatTimerFromList(timer))
                })
                console.log(handleList,'处理过后的timers')
                resolve(handleList)
            }else{
                rejectToast(reject,res.error.errorInfo)
            }
            hideLoading();
        });
    })
}

//删除
export function deleteTimer(task_id) {
    const send = { "task_ids": "[" + task_id + "]" };
    delayLoading();
    return new Promise((resolve, reject) => {
        sdk.platformSDK.util.post("service/removeTimedTask", send, function (res) {
            hideLoading()
            const success = !res.error && res.status===0;
            success ? resolve({task_id,success}) : rejectToast(reject,res.error.errorInfo)
        });
    })
}

//新增或编辑
export function addOrEditTimer (currentTimer) {        //新增定时和编辑定时的数据结构只差一个task_id属性
    const sendToJd = addTaskFormat(currentTimer,feedid);   //sendToJd已经是JSON
    const sendUrl = currentTimer.task_id ? "service/modifyTimedTask" : "service/addTimedTask";
    delayLoading();
    return new Promise((resolve, reject) => {
        sdk.platformSDK.util.post(sendUrl,sendToJd,function(res){
            hideLoading();
            const success = !res.error && res.status===0;
            success ? resolve(res) : rejectToast(reject,res.error.errorInfo)
        },function(e){
            rejectToast(reject,e.error.errorInfo)
        })
    } )
}

//9,启用停用
export function to_or_stop(control,task_id,callback){
    delayLoading();
    sdk.platformSDK.util.post("service/controlTimedTask", {"task_ids":"["+task_id+"]" , "control":control},(res)=>{
        hideLoading();
        const success = !res.error&&res.status===0
        if(success){
            callback&&callback(1);
        }else{
            rejectToast(e=>console.error(e),res.error.errorInfo)
        }
    });
}

//获取执行记录
export function getAllLog() {
    delayLoading();
    const start_time = moment().subtract(7, 'days').format("YYYY-MM-DD");
    const end_time = moment().format("YYYY-MM-DD"); 
    var feed_ids = { "feed_id": feedid, start_time, end_time };
    return new Promise((resolve, reject) => {
        sdk.platformSDK.util.post("service/getTimedTaskResultByFeedId", feed_ids, function (res) {
            console.log(res,"getTimedTaskResultByFeedId")
            hideLoading();
            if(!res.error&&res.status===0){
                const resultList = res.result && res.result.length >= 1 ? res.result : [];
                let logList = [];
                resultList.forEach((log)=>{
                    logList.push(formatLog(log))
                })
                resolve(logList)
            }else{
                rejectToast(reject,res.error.errorInfo)
            }
        });
    })
}

//删除执行记录
export function delete_log( sendObj,callback) {
    delayLoading();
    var cmd = { "feed_id": feedid, "excute_times": [sendObj] };
    sdk.platformSDK.util.post("service/removeTimedTaskResultByFeedId", cmd,()=>{
        hideLoading();
        callback && callback()
    } );/* */
}


//清空执行记录
export function closeAllLog( callback) {
    var cmd = { "feed_id": feedid };
    sdk.platformSDK.util.post("service/removeTimedTaskResultByFeedId", cmd, callback);/* */
}


export function setNavbar(index,detailEdit) {
    const configActionBars={
        mainPage:{
            titletext: deviceName,
            param: {
                "what": [
                    "button1",
                    "button4"
                ],
                "display": [
                    "drawable_back",
                    "drawable_setting"
                ],
                "callBackName": [
                    "goBack",
                    "setting"
                ]
            }
        },
        timerList:{
            titletext: "定时设置",
            param: {
                "what": [
                    "button1",
                    "button4"
                ],
                "display": [
                    "drawable_back",
                    "drawable_add"
                ],
                "callBackName": [
                    "goBackCustom",
                    "addTaskFn"
                ]
            }
        },
        timerDetail:{
            titletext: detailEdit?"编辑定时":"新增定时",
            param: {
                "what": [
                    "button1",
                    "button4"
                ],
                "display": [
                    "取消",
                    "保存"
                ],
                "callBackName": [
                    "goBackCustom",
                    "saveOrUpdateTask"
                ]
            }
        },
        detailOther:{
            param: {
                "what": [
                    "button1",
                    "button4"
                ],
                "display": [
                    "取消",
                    "保存"
                ],
                "callBackName": [
                    "goBackCustom",
                    "updateTaskState"
                ]
            }
        },
        log:{
            titletext: "执行记录",
            param: {
                "what": [
                    "button1",
                    "button4"
                ],
                "display": [
                    "drawable_back",
                    "清空记录"
                ],
                "callBackName": [
                    "goBackCustom",
                    "deletAllRecord"
                ]
            }
        }
    }
   
    sdk.platformSDK.util.configActionBar(configActionBars[index].param);
    sdk.platformSDK.app.config({
        titletext: configActionBars[index].titletext
    });
}