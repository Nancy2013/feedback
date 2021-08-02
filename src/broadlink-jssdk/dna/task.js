import timeZone from "./time-zone";
import moment from 'moment';
import {dnaControl} from "./call-native";
import {split,combine} from "./utils";
//旧版定时API
const getFormat = type => type === 0 || type === 1?  'YYYY-MM-DD HH:mm:ss':'HH:mm:ss';

const _taskListTransform = function (tasks) {
    const timers = [];

    const handlerTaskList = function (list=[], type) {
        const format = getFormat(type);
        list.forEach((task)=>{
            const override = {};
            override.time = moment(task.time,format);
            if(task.endtime){
                override.endtime = moment(task.endtime,format);
            }
            timers.push({...task, type,...override});
        })
    };

    const types = ['timerlist','delaylist','periodlist','cyclelist','randomlist'];
    types.forEach((name,type)=>{
        const data = tasks.data ||tasks;
        handlerTaskList(data[name],type);
    });

    return timers;

};

const addTask = function (task) {
    const {status,status2,...taskCopy} = task;
    taskCopy.data = split(status);
    if(status2){
        taskCopy.data2 = split(status2);
    }

    const format = getFormat(taskCopy.type);
    taskCopy.time = taskCopy.time.format(format);
    if(taskCopy.endtime){
        taskCopy.endtime =  taskCopy.endtime.format(format);
    }

    return dnaControl(timeZone(taskCopy,1),'dev_taskadd').then((tasks)=>{
        return _taskListTransform(timeZone(tasks,2));
    });
};

const listTask = function () {
    return dnaControl({},'dev_tasklist').then((tasks)=>{
        return _taskListTransform(timeZone(tasks,2));
    });
};
const queryTask = function (type,index) {
    return dnaControl({type, index}, 'dev_taskdata').then((response) => {
        const result = {};
        if(type ===3 || type ===4){
            result.status = combine(response.data.cmd1 ||{});
            result.status2 = combine(response.data.cmd2 ||{});
        }else{
            result.status = combine(response.data);
        }
        return result;
    });
};

const deleteTask = function (type ,index) {
    return dnaControl({type,index},'dev_taskdel').then((tasks)=>{
        return _taskListTransform(timeZone(tasks,2))
    });
};

const allTaskDetail = function (taskList) {
    const tasksWithDetail= [];

    const getDetailByList = (list) => {

        function getDetailByIndex(index = 0){
            const task = list[index];
            if(!task){
                return Promise.resolve('done');
            }
            return queryTask(task.type,task.index).then((detail)=>{
                tasksWithDetail.push({...task ,status: detail.status});
                return getDetailByIndex(++index);
            },(e = {message:'unkown error'})=>{
                console.error(`type:${task.type} task:${JSON.stringify(task)} query detail fail.`);
                console.error(e);
                tasksWithDetail.push({...task, error:e});
                return getDetailByIndex(++index);
            })
        }

        return getDetailByIndex();
    };

    const listPromise = taskList ? Promise.resolve(taskList):listTask();

    return listPromise.then((taskList)=>{
        return getDetailByList(taskList)
            .then(() => tasksWithDetail);
    })
};

export default { addTask, listTask, queryTask, deleteTask, allTaskDetail };