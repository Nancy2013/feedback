//添加改变时区的函数
Date.prototype.format = function(format){ 
	var o = { 
		"M+" : this.getMonth()+1, //month 
		"d+" : this.getDate(), //day 
		"h+" : this.getHours(), //hour 
		"m+" : this.getMinutes(), //minute 
		"s+" : this.getSeconds(), //second 
		"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
		"S" : this.getMilliseconds() //millisecond 
	} 
	
	if(/(y+)/.test(format)) { 
		format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	} 
	
	for(var k in o) { 
		if(new RegExp("("+ k +")").test(format)) { 
			format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
		} 
	} 
	return format; 
} 

var changeTime = function(){
	var timezoneOffset = function (){   //本地时间差 秒
		var d = new Date();
		var timezoneOffset = d.getTimezoneOffset();
		return timezoneOffset*60
	};
	var offsetEast8 = -480*60;  //东八区时间差 秒
	var updateWeek = function (week,op){  //修改星期 week星期字符串  op 1 -1
		for(var i=0 ;i<week.length;i++){
			week[i] = parseInt(week[i]) + op;
			
			if(week[i] == 0){
				week[i] = 7;
			}else if(week[i] == 8){
				week[i] = 1;
			}
		}
		week = week.sort();
		return week;
	}
	var timeEast8ToLocal = function (time){  //东八 -> 本地 读取时用  time 秒
		time = time + offsetEast8 - timezoneOffset();
		return time;
	}
	var timeLocalToEast8 = function (time){  //本地 -> 东八 设置时用   time 秒
		time = time - offsetEast8 + timezoneOffset();
		return time;
	}
	var timeToStamp = function (time){
		var arrTime = time.split(":"); 
		return (parseInt(arrTime[0])*60 + parseInt(arrTime[1]))*60+parseInt(arrTime[2]);
	}
	var StampToTime = function (stamp){
		var s = stamp%60;
		var temp = Math.floor(stamp/60);
		s = s<10 ? "0"+s : s;
		var m = temp%60;
		m = m<10 ? "0"+m : m;
		var h = Math.floor(temp/60);
		h = h<10 ? "0"+h : h;
		return h+ ":" + m+ ":" + s;
	}
	
	var changeTimerlist = function(data , op){  //单次时间 op 1 本地->东8  0 东8->本地
		var strTime = data.time.replace(/-/g,"/");
		var date = (new Date(strTime )).getTime()/1000;
		if(op == 1){
			date = timeLocalToEast8(date)*1000;
		}else if(op == 0){
			date = timeEast8ToLocal(date)*1000;
		}
		var changeDate = new Date();
		changeDate.setTime(date);
		data.time = changeDate.format("yyyy-MM-dd hh:mm:ss");
		return data;
	}
	var changePeriodlist = function(data , op){ //周期时间  op 1 本地->东8  0 东8->本地
		var strTime = data.time;
		var date = timeToStamp(strTime);
		
		if(op == 1){
			date = timeLocalToEast8(date);
		}else if(op == 0){
			date = timeEast8ToLocal(date);
		}
		if(date<0){
			var week = data.repeat;
			data.repeat = updateWeek(week,-1);
			date = date + 24*60*60;
		}else if (date>24*60*60){
			var week = data.repeat;
			data.repeat = updateWeek(week,1);
			date = date - 24*60*60
		}
		
		data.time = StampToTime(date);
		return data;
	}

	var changeCyclelist = function(data , op){
		var strTime = data.time;
		var strEndtime = data.endtime;
		var date = timeToStamp(strTime);
		var enddate = timeToStamp(strEndtime);
		
		if(op == 1){
			date = timeLocalToEast8(date);
			enddate = timeLocalToEast8(enddate);
		}else if(op == 0){
			date = timeEast8ToLocal(date);
			enddate = timeEast8ToLocal(enddate);
		}
		if(date<0){
			var week = data.repeat;
			data.repeat = updateWeek(week,-1);
			date = date + 24*60*60;
		}else if (date>24*60*60){
			var week = data.repeat;
			data.repeat = updateWeek(week,1);
			date = date - 24*60*60
		}
		enddate =(enddate +(24*60*60)) % (24*60*60);  //修改结束时间超出部分
		data.time = StampToTime(date);
		data.endtime = StampToTime(enddate);
		return data;
	}

	return function (dataOld,opType){  // dataOld 原始数据， opType 操作方式:1.设置定时的单个字符串（本地->东8）, 2.读取定时的长字符串	
		var data = JSON.parse(JSON.stringify(dataOld));
		
		if(opType == 1){
			if(data.type == 0 || data.type == 1){ //单次定时，时间为Y-m-d H:m:s
				return changeTimerlist(data,1);
			}else if(data.type == 2){//周期定时，时间为 hh:mm:ss 周期 repeat
				return changePeriodlist(data,1);
			}else if(data.type === 3||data.type === 4){
				//TODO
				return changeCyclelist(data,1);
				// return data;
			}
		}else if(opType == 2){  // 读取时的全部周期
			var timerlist = data.data.timerlist||[];       // 单次
			var tempTimerlist = [];
			for(var i = 0 ; i < timerlist.length; i++){   
				tempTimerlist.push(  changeTimerlist(timerlist[i],0));
			}
			data.data.timerlist = tempTimerlist;
			
			var periodlist = data.data.periodlist||[];    // 周期
			var tempPeriodlist = [];
			for(var i = 0 ; i < periodlist.length; i++){
				tempPeriodlist.push(  changePeriodlist(periodlist[i],0));
			}
			data.data.periodlist = tempPeriodlist;
			
			
			var delaylist = data.data.delaylist||[];    // 延时 延时与单次结构一样，所以沿用用单次方法
			var tempDelaylist = [];
			for(var i = 0 ; i < delaylist.length; i++){
				tempDelaylist.push(  changeTimerlist(delaylist[i],0));
			}
			data.data.delaylist = tempDelaylist;

			var cyclelist = data.data.cyclelist || [];
			var tempCyclelist = [];
			for(var i = 0 ; i < cyclelist.length; i++){
				tempCyclelist.push(  changeCyclelist(cyclelist[i],0));
			}
			data.data.cyclelist = tempCyclelist;
			return data;
		}
	}
}();

export default changeTime
//时区结束