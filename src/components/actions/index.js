import {UPDATE_STATUS,READY,SHOW_LOADING,HIDE_LOADING} from './action-constants'

export const updateStatus = state=>({
        type: UPDATE_STATUS,
        data:state
    }
);
export const ready = ()=>({
    type: READY
});

export const loading = show=>({
    type: show?SHOW_LOADING:HIDE_LOADING
});
