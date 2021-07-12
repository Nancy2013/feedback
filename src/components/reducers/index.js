import {UPDATE_STATUS,READY,SHOW_LOADING,HIDE_LOADING} from '../actions/action-constants'
import { combineReducers} from 'redux';
import { createSelector } from 'reselect'
import {sortTimers} from "../dna/SDKTimerV2/timer-util";

const status = (state = {status:{},online:'2',name:''}, action) => {
    switch (action.type) {
        case UPDATE_STATUS:
            return {...action.data};
        // case TOGGLE_CONTROL:
        //     let {param} = action;
        //     let value = state.status[param];
        //     //TODO
        //     control({[param]:value===0?1:0});
        //     return state;
        default:
            return state;
    }
};

const loading = (state = false, action) => {
    switch (action.type) {
        case SHOW_LOADING:
            return true;
        case HIDE_LOADING:
            return false;
        default:
            return state;
    }
};

const ready = (state = false, action) => {
    switch (action.type) {
        case READY:
            return true;
        case UPDATE_STATUS:
            return true;
        default:
            return state;
    }
};

const globalizeSelectors = (selectors, path) => {
    return Object.keys(selectors).reduce((final, key) => {
        final[key] = (state,...args)=>selectors[key](state[path],...args);
        return final;
    }, {});
};

/*基础、通用*/
const reducers = {
    status,
    loading,
    ready
};

const dnaSelectors = {};

if (process.env.IOT_PLATFORM === 'dna') {
    const timer = require("./timer").default;
    const entities = require("./entities").default;

    Object.assign(reducers, {
        [entities.moduleKey]: entities.reducer,
        [timer.moduleKey]: timer.reducer
    });
    const timerSelectors = globalizeSelectors(timer.selectors, timer.moduleKey);
    const entitiesSelectors = globalizeSelectors(entities.selectors, entities.moduleKey);
    /*
    * 定时组件中的定时（目前只包括单次、周期、循环）
    * */
    const getTimerList = createSelector(
        timerSelectors.getIdList,entitiesSelectors.getAllTimers,
        (ids,timers)=>{
            if(ids){
                return sortTimers(ids.map(id => timers[id]));
            }else{
                return null;
            }
        }
    );

    const getAllTimerList = createSelector(
        entitiesSelectors.getAllTimers,
        (timers={})=>{
            return sortTimers(Object.keys(timers).map(id=>timers[id]));
        }
    );
    Object.assign(dnaSelectors, {getTimerList,getAllTimerList,timerSelectors,entitiesSelectors});

}

export default combineReducers(reducers);
export {dnaSelectors};


export const getOnline = state=>state.status.online;
export const getName = state=>state.status.name;
export const getReady = state=>state.ready;
export const getStatus = (state,params)=>{
    const status = state.status.status;
    if(!params){
        //不传则返回全部
        return status && {...status};
    }else if(Array.isArray(params)){
        const result = {};
        params.forEach(p=>result[p] = status[p]);
        return result
    }else{
        return status[params];
    }
};


// export const getCurrentTimer = createSelector(
//     timerSelectors.getCurrent, timerSelectors.getSunTable,
//     (timer={}, table) => overrideSunMoment(timer, table, 'time', 'stime', 'etime')
// );