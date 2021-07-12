import moment from 'moment'
import sdk from 'broadlink-jssdk';
import suncalc from 'suncalc'

const {TYPE_CYCLE,TYPE_RAND,BEFORE_SUN_SET,
    BEFORE_SUN_RISE,
    AFTER_SUN_SET
   } = sdk.platformSDK.taskV2 || {};

const periodDesc = (repeat, formatMessage)=>{
    if(repeat && repeat.length>0){
        return repeat.map(r=>formatMessage({id:'internal.SDKTimerV2.isoWeekday'},{index: r})).join('、 ');
    }else{
        return formatMessage({id:'internal.SDKTimerV2.onceRepeat'});
    }
};

export const timerPeriods = ()=>[
    {
        name: 'internal.SDKTimerV2.onceRepeat',
        match: repeat => !repeat||repeat.length===0,
        choose:()=>[]
    },
    {
        name: 'internal.SDKTimerV2.everydayRepeat',
        match:repeat => repeat.length===7,
        choose:()=>[0,1,2,3,4,5,6]
    },
    {
        name:'internal.SDKTimerV2.weekdayRepeat',
        match:repeat => {
            const weekday = [1,2,3,4,5];
            let containsAll = true;
            for(let i=0;i<weekday.length;i++){
                if(repeat.indexOf(weekday[i])<0){
                    containsAll = false;
                    break;
                }
            }
            return containsAll&& weekday.length===repeat.length;
        },
        choose:()=>[1,2,3,4,5]
    },
    {
        name:'internal.SDKTimerV2.weekendRepeat',
        match:repeat => {
            const weekend = [6,0];
            let containsAll = true;
            for(let i=0;i<weekend.length;i++){
                if(repeat.indexOf(weekend[i])<0){
                    containsAll = false;
                    break;
                }
            }
            return containsAll&& weekend.length===repeat.length;
        },
        choose:()=>[6,0]
    },
    {
        name:'internal.SDKTimerV2.customRepeat',
        match:repeat => {
            return repeat && repeat.length>0;
        },
        desc:(repeat, formatMessage) =>periodDesc(repeat, formatMessage),
    },
];


export const repeatDesc = (repeat, formatMessage)=>{

    const periods =  timerPeriods();
    for(let i =0;i<periods.length;i++){
        let period=periods[i];
        if(period.match(repeat)){
            return period.desc?period.desc(repeat, formatMessage):formatMessage({id:period.name});
        }
    }
};

export function nearestExecTime(time){
    if(time.isRepeated()){
        const sameWeek = time.repeat.map(day => time.moment.clone().day(day));
        const afterNow = sameWeek.filter( m => m.isAfter(moment()));

        let finalExecTime = afterNow;
        if(finalExecTime.length === 0){
            finalExecTime =  time.repeat.map(day =>time.moment.clone().isoWeekday(day+7));
        }
        return moment.min(...finalExecTime)
    }else{
        return time.moment;
    }
}


export function sortTimers(timers) {
    if(!timers || timers.length === 0){
        return [];
    }

    const invalid = [];
    const valid = [];

    const getTimeField = timer=>timer.type === TYPE_CYCLE || timer.type === TYPE_RAND?timer.stime:timer.time;

    timers.forEach(timer =>{
        const time = getTimeField(timer);
        if((time.isRepeated() || time.moment.isAfter(moment())) && timer.en){
            valid.push(timer)
        }else{
            invalid.push(timer)
        }
    });
    
    valid.sort((a,b)=> {

        const aTime = nearestExecTime(getTimeField(a));
        const bTime = nearestExecTime(getTimeField(b));

        if(aTime.isBefore(bTime)){
            return -1;
        }
        return 1;
    });

    invalid.sort((a,b)=> {
        const aTime = getTimeField(a);
        const bTime = getTimeField(b);

        if(aTime.moment.isBefore(bTime.moment)){
            return -1;
        }
        return 1;
    });
    return [...valid,...invalid];
}

export function calDelta(num) {
	if (num < 0) return -1;
	if (num === 0) return 0;
	if (num > 0) return 1;
}

/**
 * 将日出日落时间转化成具体的moment
 * time: Time对象
 * table: 日出日落时刻表
 */

export const fixSunMoment = (table, time) => {    
    if (!time.sun || !table) return time.moment;
    let durationMinutes; 
    const timeMoment = (time.moment && time.moment.clone().startOf('day')) || moment().startOf('day');  // 单次 || 周期
    let maxIndex = 0;
    let tableArr = [...table.objArr,{...table.objArr[0], moment:table.objArr[0].moment.clone().add(1,'years')}]; // 1,2,3 ...,1(13)
    for (let i = 0; i < tableArr.length; i++) {
        if (timeMoment.isBefore(tableArr[i].moment)){
            maxIndex = i;
            break;
        }
    }
    const preTableItem = tableArr[maxIndex-1];
    const nextTableItem = tableArr[maxIndex];
    const preMoment = preTableItem.moment.clone();
    const nextMoment = nextTableItem.moment.clone();
    const preDuration = {
        sunrise: moment.duration({hours: preTableItem.sunrise.getHours(), minutes: preTableItem.sunrise.getMinutes()}),
        sunset: moment.duration({hours: preTableItem.sunset.getHours(), minutes: preTableItem.sunset.getMinutes()})
    }
    const nextDuration = {
        sunrise: moment.duration({hours: nextTableItem.sunrise.getHours(), minutes: nextTableItem.sunrise.getMinutes()}),
        sunset: moment.duration({hours: nextTableItem.sunset.getHours(), minutes: nextTableItem.sunset.getMinutes()})
    }
    if (time.sun === BEFORE_SUN_SET || time.sun === AFTER_SUN_SET) {
        const deltaMinutes = timeMoment.diff(nextMoment, 'days')/preMoment.diff(nextMoment, 'days')*preDuration.sunset.asMinutes() + timeMoment.diff(preMoment, 'days')/nextMoment.diff(preMoment, 'days')*nextDuration.sunset.asMinutes();
        durationMinutes = time.sun === BEFORE_SUN_SET ? deltaMinutes - time.duration.asMinutes() : deltaMinutes + time.duration.asMinutes();
    } else {
        const deltaMinutes = timeMoment.diff(nextMoment, 'days')/preMoment.diff(nextMoment, 'days')*preDuration.sunrise.asMinutes() + timeMoment.diff(preMoment, 'days')/nextMoment.diff(preMoment, 'days')*nextDuration.sunrise.asMinutes();
        durationMinutes = time.sun === BEFORE_SUN_RISE ? deltaMinutes - time.duration.asMinutes() : deltaMinutes + time.duration.asMinutes();
    }
    const sunDuration = moment.duration(durationMinutes, 'minutes');
    timeMoment.hour(sunDuration.hours());
    timeMoment.minute(sunDuration.minutes());
    return timeMoment;
}

export const clacTable = ({latitude, longitude} = {}) => { // [month, day, rise.h, rise.m, rise.s, set.h, set.m, set.s].objArr = [{moment, sunrise, sunset}]
    // eslint-disable-next-line
    if (latitude == undefined || longitude == undefined) return null;
    let table = [];
    table.objArr = [];
    for (let i = 0; i < 12; i++) {
        let _date = new Date();
        _date.setMonth(i);
        _date.setDate(1);
        const {sunrise, sunset} = suncalc.getTimes(_date, latitude, longitude);
        table.push(i+1,1,sunrise.getHours(),sunrise.getMinutes(),0,sunset.getHours(),sunset.getMinutes(),0);
        table.objArr.push({moment: moment(`${i+1}-1`,'MM-DD'), sunrise, sunset});
    }
    return table;
};

export function loadBMap() {
    return window.BMap ? Promise.resolve(window.BMap) : import('../../libs/b-map/bMap-api-v3').then(()=>window.BMap);
}


