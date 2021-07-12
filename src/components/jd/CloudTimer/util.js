
import moment from 'moment';
import Toast from '../../Toast';


export const rejectToast=(reject,errorInfo="失败")=>{
    Toast.info(errorInfo);
    reject(errorInfo)
}

export function cmdName(message) {
    if(this.props&&this.props.intl){
        return  this.props.intl.formatMessage({id:message})
    }else{
        return message;
    }
}

//判断是不是已经过期
export function getTaskExpired(nextLeftMin, isPeriod) {
    const nlm = parseInt(nextLeftMin, 10);
    return !(nlm > 0 || nlm === 0) && !isPeriod;
}

export const isFunction = function (func) {
    return  Object.prototype.toString.call(func).slice(8, -1) ==='Function';
};

const _simpleClone = obj=>{
    if(!obj || 'object' != typeof obj){
        return obj;
    }

    const copy = Object.keys(obj).reduce((copy,field)=>{
        const val = obj[field];
        let copyVal ;
        if(Array.isArray(val)){
            copyVal = [...val];
        }else if('object' === typeof val){
            if(val.clone && isFunction(val.clone )){
                //如果对象本身提供了clone方法
                copyVal = val.clone();
            }else{
                copyVal = _simpleClone(val);
            }

        }else{
            copyVal = val;
        }
        copy[field] = copyVal;
        return copy;
    },{});


    return Object.setPrototypeOf(copy,Object.getPrototypeOf(obj));
};

export class currentTimer{
    constructor(editTimering={}) { 
        Object.assign(this, {
            task_name:"定时关闭",                         
            time:moment(moment().add(1,"m"),"YYYY-MM-DD HH:mm"), 
            repeat:[],                                                     
            pmg_setting:"1", //-1表不通知，0表仅执行失败通知，1表均通知
            cmd:{Power:0},
        }, editTimering ) //当前编辑的Timer覆盖默认Timer
    }
    isEdit(){
        return this.task_id||false
    }
    isRepeated(){
        return this.repeat.length>0
    }
    timerHHmm(){
        return this.task_time_express.format("HH:mm")
    }
    weekDesc(){
        return weekChinese(this.repeat)
    }
    pmgDesc(){
       return this.pmg_setting*1===1 ? "均通知" : this.pmg_setting*1===0?"执行失败通知":"不通知"
    }
    clone(){
        return _simpleClone(this);
    }
}

export function formatTimerFromList(timer){   //把从列表获取到的定时精简化
    const{task_name, task_id, task_status, task_time_express, task_express, pmg_setting, next_left_minutes, next_excute_time, last_excute_time} = timer;
    let cmd = {}
    task_express[0].stream.forEach(Key_Value  => {    
        for(let param in Key_Value){
            cmd[param] = parseInt(Key_Value[param]) 
        }
    });
    const timeArr = task_time_express.split('_');
    const isRepeat =  timeArr[timeArr.length-1] === "*";
    let repeat=[];
    if(isRepeat){
        repeat =  timeArr[timeArr.length-2].split(',');
    }
    repeat = repeat.map(Number)  //  把数组里的每一项由string转为number;  例： ["1","2"] = [1,2]
    const time = isRepeat 
    ?
    moment(moment().format("YYYY-MM-DD ")+ timeArr[1]+":"+timeArr[0],"YYYY-MM-DD HH:mm") 
    :
    moment(moment(task_time_express,"mm_HH_DD_MM_*_YYYY").format('YYYY-MM-DD HH:mm'),'YYYY-MM-DD HH:mm' ) ;
    return{
        task_name,
        time, 
        repeat,
        task_id,
        task_status,
        task_time_express,
        cmd,
        pmg_setting,
        next_left_minutes,  //离下次执行还剩余多少分钟
        next_excute_time,   //下次执行时间    
        last_excute_time    //上次执行时间   
    }
}


export function addTaskFormat(currentTimer,feed_id) {    //新增定时和编辑定时的数据结构只差一个task_id属性
    const{ 
        task_name,
        time,    //"YYYY-MM-DD HH:mm"
        repeat,  //[1,2,3]
        pmg_setting,
        cmd,
    } = currentTimer;

    let stream=[];
    for(let param in cmd){
        stream.push(
            {
                "stream_id": param,
                "stream_value": cmd[param]
            }
        )
    }
    let timed_task = {
        "app_time": moment().format("YYYY-MM-DD HH:mm"),
        task_name,
        "task_time_express": currentTimer.isRepeated() 
                                ? 
                            (time.format("mm_HH_*_*_")+repeat.join(',')+'_*')  //51_13_*_*_1,2,3,4,5,6,7_*
                                :
                            time.format("mm_HH_DD_MM_*_YYYY"),   // 46_13_17_10_*_2019
        "task_express": [{
            feed_id,
            stream,
        }],
        "task_type": "1",     //定时执行类型：1 云端定时；2:设备定时
        pmg_setting   //-1表不通知，0表仅执行失败通知，1表均通知
    }
    if(currentTimer.task_id){
        timed_task.task_id = currentTimer.task_id
    }
    return { "timed_task": JSON.stringify(timed_task) }
}


export function weekChinese(repeat){
    if(!repeat)return    //定时详情里的选项desc  重复、定时任务、定时名称、执行结果通知
    const repeatStr = repeat.join(",");
    let repeatDesc=""; 
    switch (repeatStr) {
        case "6,7":
            repeatDesc= "周末";
            break;
        case "1,2,3,4,5":
            repeatDesc= "工作日";
            break;
        case "1,2,3,4,5,6,7":
            repeatDesc= "每天";
            break;
        default:
            if(repeat.length===0){
                repeatDesc= "执行一次";
                return repeatDesc;
            }
            const weekChinese=['','周一','周二','周三','周四','周五','周六','周日'];
            repeat.forEach((num,i)=>{
                repeatDesc+=weekChinese[num]
                if(i!==repeat.length-1){
                    repeatDesc+="、"
                }
            })
    }
    return repeatDesc
}

export function checkTimer(currentTimer,timers){
    let maxTimers= timers.length>9 && !currentTimer.isEdit();    //最大定时
    let sameTiming= false;
    timers.forEach((timer)=>{
        if(timer.time.format("HH:mm")===currentTimer.time.format("HH:mm")&&timer.task_id!==currentTimer.task_id){
            sameTiming= true
        }
    })
    currentTimer.time = moment(moment().format("YYYY-MM-DD ") + currentTimer.time.format("HH:mm"),"YYYY-MM-DD HH:mm");  //先把日期转换成今天
    currentTimer.time = (currentTimer.time.isBefore(moment())||currentTimer.time.format("YYYY-MM-DD HH:mm")===moment().format("YYYY-MM-DD HH:mm")) ?  currentTimer.time.add(1,"day") : currentTimer.time 
    return { maxTimers, sameTiming }
}


export function formatLog(log){
    const{ result, task_name, stream_id, stream_value, excute_time }= log;
    const time= moment(excute_time,"YYYY-MM-DD HH:mm:ss");
    return {
        dateDesc:time.format("MM月DD日"),
        timeMH:time.format("HH:mm"),
        cmd:{[stream_id]:stream_value},
        stream_id,
        task_name,
        result,
        excute_time
    }
}