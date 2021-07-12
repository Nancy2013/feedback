import {
    TIMER_QUERY_START,
    TIMER_QUERY_FAIL,
    TIMER_QUERY_SUCCESS,
    TIMER_RESET,
    SET_CURRENT_TIMERS,
    SET_CURRENT_TYPE,
    UPDATE_CURRENT_TIMER,
    SET_LOCATION_EN,
    TIMER_DELETE_SUCCESS, TIMER_ADD_SUCCESS, UPDATE_CURRENT_TIMER_REPEAT,SET_CURRENT_LOCATION,
} from "../actions/action-constants";
import { combineReducers} from 'redux';
import sdk from "broadlink-jssdk/jssdk";
const {TYPE_COMMON,TYPE_PERIOD,TYPE_CYCLE} =sdk.platformSDK.taskV2 || {};

const mergeTimers = (state,...timers) =>{
    const ids = state?[...state]:[];
    timers.forEach(timer =>{
        const {uuid,type} = timer;
        if(type===TYPE_COMMON||type===TYPE_PERIOD||type===TYPE_CYCLE){
            ids.push(uuid);
        }
    });
    return ids;
};

const deleteTimers = (list,...ids)=>{

    const newList = [];
    list.forEach(uuid =>{
        if(ids.indexOf(uuid)<0){
            newList.push(uuid)
        }
    });
    return newList;
};

const idList = (state = null, action) => {
    switch (action.type) {
        case TIMER_QUERY_START:
            return action.clear?null:state;
        case TIMER_QUERY_SUCCESS:
            let {list,append} =  action;
            return mergeTimers(append?state:[],...list);
        case TIMER_DELETE_SUCCESS:
            return deleteTimers(state,...action.ids);
        case TIMER_ADD_SUCCESS:
            return [...state,action.timer.uuid];
        case TIMER_RESET:
            return null;
        default:
            return state;
    }
};

const modifyUsedNumber = (limit,offset) =>{
    const newLimit = [...limit];
    newLimit[2] = limit[2]+offset;
    return newLimit;
};

const limits = (state = null, action) => {
    switch (action.type) {
        case TIMER_QUERY_SUCCESS:
            return action.limits;
        case TIMER_DELETE_SUCCESS:
            let {timers} = action;
            let newState = {...state};
            timers.forEach(({type})=>{
                newState[type] = modifyUsedNumber(newState[type],-1);
            });

            return newState;
        case TIMER_ADD_SUCCESS:
            let {timer:{type}} = action;
            //已经使用的数组加一
            let limit = modifyUsedNumber(state[type],1);
            return {...state,[type]:limit};
        case TIMER_RESET:
            return null;
        default:
            return state;
    }
};

const lastUpdateTime = (state = null, action) => {
    switch (action.type) {
        case TIMER_QUERY_SUCCESS:
            return new Date();
        case TIMER_RESET:
            return null;
        default:
            return state;
    }
};

const total = (state = null, action) => {
    switch (action.type) {
        case TIMER_QUERY_SUCCESS:
            return action.total;
        case TIMER_RESET:
            return null;
        default:
            return state;
    }
};
const isFetching = (state = false, action) => {
    switch (action.type) {
        case TIMER_QUERY_SUCCESS:
        case TIMER_QUERY_FAIL:
        case TIMER_RESET:
            // return action.isFetching;
            return false;
        case TIMER_QUERY_START:
            return true;
        default:
            return state;
    }
};

const error = (state = null, action) => {
    switch (action.type) {
        case TIMER_QUERY_FAIL:
            return action.error;
        case TIMER_QUERY_START:
        case TIMER_QUERY_SUCCESS:
        case TIMER_RESET:
            return null;
        default:
            return state;
    }
};

const current = (state = {}, action) => {
    switch (action.type) {
        case SET_CURRENT_TIMERS:
            return {
                ...state,
                timers:action.timers,
                type:action.currentType
            } ;
        case SET_CURRENT_TYPE:
            return {...state,type:action.currentType};
        case UPDATE_CURRENT_TIMER_REPEAT:
            {
                let currentTimer =  state.timers[state.type].clone();
                currentTimer.setRepeat(action.repeat);
                state.timers[state.type] = currentTimer;
                return {...state}
            }
        case UPDATE_CURRENT_TIMER:
            let currentTimer =  state.timers[state.type].clone();
            let {time,etime,stime,...rest} = action.updates;
            Object.assign(currentTimer,rest);
            if(time){
                if (time.moment) {
                    delete currentTimer.time.sun;
                    delete currentTimer.time.duration;
                }
                Object.assign(currentTimer.time,time);
            }
            if(etime){
                if (etime.moment) {
                    delete currentTimer.etime.sun;
                    delete currentTimer.etime.duration;
                }
                Object.assign(currentTimer.etime,etime);
            }
            if(stime){
                if (stime.moment) {
                    delete currentTimer.stime.sun;
                    delete currentTimer.stime.duration;
                }
                Object.assign(currentTimer.stime,stime);
            }
            //black magic
            state.timers[state.type] = currentTimer;
            return {...state};
        default:
            return state;
    }
};

const location = (state = {en: false, currentLocation:{}}, action)=> {
    switch(action.type) {
        // case TIMER_QUERY_SUCCESS:
        //     const {en, ...currentLocation} = action.location
        //     return {
        //         ...state,
        //         en,
        //         currentLocation,
        //     };
        case SET_CURRENT_LOCATION:
            return {
                ...state,
                en:true,
                currentLocation: action.location
            };
        case SET_LOCATION_EN: 
            return {
                ...state,
                en: action.en
            };
        default: 
            return state

    }
};

const getIdList = state=>state.idList;
const getTotal = state=>state.total;
const getError = state=>state.error;
const getIsFetching = state=>state.isFetching;
const getLastUpdateTime = state=>state.lastUpdateTime;
const getLimits = (state,type)=>type?state.limits[type]:state.limits;
const getCurrent = (state)=>{
    if(state.current&&state.current.type){
        const {type,timers} = state.current;
        return timers[type];
    }
};

const getRemainByType = (state,type)=>{
    const limits = getLimits(state);
    if(limits){
        const limit = limits[type];
        return limit[0]? limit[1]-limit[2] :0 ;
    }
    return 0;
};

const pickAvailableType = (state,...types)=>{
    for(let i =0;i<types.length;i++){
        if(getRemainByType(state,types[i])>0){
            return types[i];
        }
    }
};
const getLocation = state => state.location;
const getCurrentLocation = state => state.location.currentLocation;

const reducer = combineReducers({idList,isFetching,total,lastUpdateTime,error,limits,current,location});
const moduleKey = 'timer';
const selectors = {
    getIdList,getTotal,getError,getIsFetching,getLastUpdateTime,getLimits,getCurrent,getRemainByType,pickAvailableType,getLocation,getCurrentLocation
};

export default {reducer,moduleKey,selectors}



