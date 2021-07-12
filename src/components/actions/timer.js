import {
    SET_CURRENT_TIMERS, TIMER_QUERY, TIMER_QUERY_START,SUN_CONFIGURE,
    TIMER_QUERY_SUCCESS, TIMER_QUERY_FAIL, TIMER_RESET, SET_CURRENT_TYPE, UPDATE_CURRENT_TIMER,SET_LOCATION_EN,
    TIMER_ADD, TIMER_DELETE,TIMER_ADD_SUCCESS,TIMER_DELETE_SUCCESS,TIMER_EDIT_SUCCESS,UPDATE_CURRENT_TIMER_REPEAT, SET_CURRENT_LOCATION,
} from "./action-constants";

export const query = ({keepTrying,clear,supportSunriseAndSunset}= {})=>({
        type: TIMER_QUERY,
        //如果报错是否一直重试
        keepTrying,
        //获取前是否重置当前定时列表
        clear,
        supportSunriseAndSunset
    }
);

export const resetTimer = ()=>({
        type: TIMER_RESET,
    }
);

export const queryStart = clear=>({
        type: TIMER_QUERY_START,
        //获取前是否重置当前定时列表
        clear
    }
);

export const querySuccess = ({list, total,limits,location},append/*在当前列表中添加还是替换当前列表*/)=>({
        type: TIMER_QUERY_SUCCESS,
        list,
        total,
        limits,
        location,
        append
    }
);

export const queryFail = error=>({
        type: TIMER_QUERY_FAIL,
        error
    }
);


export const setCandidateTimers = (timers, currentType)=>({
    type: SET_CURRENT_TIMERS,
    timers,
    currentType
});

export const setCurrentType = (currentType)=>({
    type: SET_CURRENT_TYPE,
    currentType
});

export const updateCurrentTimer = updates=>{
    console.error('updateCurrentTimer:',updates);
    return {
        type: UPDATE_CURRENT_TIMER,
        updates:updates
    }
};

export const addCurrentTimerRepeat = (repeat)=>({
    type: UPDATE_CURRENT_TIMER_REPEAT,
    repeat
});

export const addOrUpdateTimer = ({callback,timer}={})=>({
    type: TIMER_ADD,
    timer,
    callback
});
export const addTimerSuccess = timer=>({
    type: TIMER_ADD_SUCCESS,
    timer
});
export const editTimerSuccess = timer=>({
    type: TIMER_EDIT_SUCCESS,
    timer,
});

export const deleteTimer = (...ids)=>({
    type: TIMER_DELETE,
    ids
});

export const deleteTimerSuccess = (...timers)=>({
    type: TIMER_DELETE_SUCCESS,
    ids:timers.map(timer=>timer.uuid),
    timers
});

export const configureSun = (config, callback) => ({
    type: SUN_CONFIGURE,
    config,
    callback
});

export const setCurrentLocation = (location) => ({
    type: SET_CURRENT_LOCATION,
    location
});

export const setLocationEnable = (en = true) => ({
    type: SET_LOCATION_EN,
    en
});
