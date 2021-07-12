import {
    TIMER_ADD_SUCCESS,
    TIMER_DELETE_SUCCESS, TIMER_EDIT_SUCCESS,
    TIMER_QUERY_SUCCESS
} from "../actions/action-constants";

import {combineReducers} from "redux";

function addTimers(state,action) {
    const {list,append} = action;
    const timers =  list.reduce((accumulator,current)=>{
        accumulator[current.uuid] = current;
        return accumulator;
    },{});
    return append?
        {...state,timers}:
        timers
}

const byId = (state = {}, action)=>{
    switch (action.type) {
        case TIMER_QUERY_SUCCESS:
            return addTimers(state,action);
        case TIMER_ADD_SUCCESS:
        case TIMER_EDIT_SUCCESS:
            return {...state,[action.timer.uuid]:action.timer};
        case TIMER_DELETE_SUCCESS:
        {
            let newState = {...state};
            action.ids.forEach(uuid=>delete newState[uuid]);
            return newState;
        }
        default:
            return state;
    }
};

const timer = combineReducers({byId});

const getTimerById = (state,id)=>state.timer.byId[id];
const getAllTimers = (state)=>state.timer.byId;

const reducer = combineReducers({timer});

const moduleKey = 'entities';
const selectors = {
    getTimerById,getAllTimers
};

export default {reducer,moduleKey,selectors}
