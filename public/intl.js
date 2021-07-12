const deviceIntl = {
        // 设备国际化，
        title: '开合帘',
        subtitle:'客厅',
}

var __APP_STRINGS__ = {
    zh: {
        ...deviceIntl,
        // 组件国际化
        // NavBar
        'internal.Navbar.set': '功能设置',
        'internal.Navbar.props':'属性',
        
        //ActivityIndicator
        "internal.ActivityIndicator.loading": "加载中",

        //Modal
        "internal.Modal.confirm": "确定",
        "internal.Modal.cancel": "取消",

        //SDKTimerV2
        "internal.SDKTimerV2.confirm": "确定",
        "internal.SDKTimerV2.confirmDelete": "确认删除？",
        "internal.SDKTimerV2.noTimer": "还没有添加定时",
        "internal.SDKTimerV2.addTimer": "添加定时",
        "internal.SDKTimerV2.delete": "删除",
        "internal.SDKTimerV2.date": "日期",
        "internal.SDKTimerV2.operation": "操作",
        "internal.SDKTimerV2.setDataFirst": "请先设置命令内容",
        "internal.SDKTimerV2.timerSave": "保存",
        "internal.SDKTimerV2.isoWeekday": "{index, select," +
            "1 {周一}" +
            "2 {周二}" +
            "3 {周三}" +
            "4 {周四}" +
            "5 {周五}" +
            "6 {周六}" +
            "0 {周日}" +
            "}",
        "internal.SDKTimerV2.isoWeekdayRepeat": "{index, select," +
            "1 {星期一}" +
            "2 {星期二}" +
            "3 {星期三}" +
            "4 {星期四}" +
            "5 {星期五}" +
            "6 {星期六}" +
            "0 {星期日}" +
            "}",
        "internal.SDKTimerV2.repeatSetting": "重复设置",
        "internal.SDKTimerV2.onceRepeat": "仅一次",
        "internal.SDKTimerV2.everydayRepeat": "每天",
        "internal.SDKTimerV2.weekdayRepeat": "工作日",
        "internal.SDKTimerV2.weekendRepeat": "周末",
        "internal.SDKTimerV2.customRepeat": "自定义",
        "internal.SDKTimerV2.today": "今天",
        "internal.SDKTimerV2.tomorrow": "明天",
        "internal.SDKTimerV2.selectExecute": "请选择要执行的操作",
        "internal.SDKTimerV2.commandOn": "开",
        "internal.SDKTimerV2.commandOff": "关",
        "internal.SDKTimerV2.startTime": "开始时间",
        "internal.SDKTimerV2.endTime": "结束时间",
        "internal.SDKTimerV2.operateOne": "操作一",
        "internal.SDKTimerV2.operateTwo": "操作二",
        "internal.SDKTimerV2.recycleTiming": "循环定时",
        "internal.SDKTimerV2.commonTiming": "常规定时",
        "internal.SDKTimerV2.recycleChangeText": "设置一段时间内两个操作循环切换。例如：在 8 点到 12点期间，开 20 分钟，关 5 分钟，再开 20 分钟...如此循环。",
        "internal.SDKTimerV2.setTowMost": "最多可设 2 个循环定时。",
        "internal.SDKTimerV2.durationTime": "持续时间",
        "internal.SDKTimerV2.selectTime": "选择时间",
        "internal.SDKTimerV2.reachMaximum": "已达到数量上限",
        "internal.SDKTimerV2.commReachLimit": "单次定时数量已到上限",
        "internal.SDKTimerV2.periodReachLimit": "周期定时数量已到上限",
        "internal.SDKTimerV2.cycleReachLimit": "循环定时数量已到上限",
        "internal.SDKTimerV2.pickerMinute": "{minutes}分钟",
        "internal.SDKTimerV2.delConfirm": "确定要删除该定时?",
        "internal.SDKTimerV2.selectOperation": "选择操作",
        "internal.SDKTimerV2.selectDate": "选择日期",
        "internal.SDKTimerV2.getTimerFailed": "获取定时失败,请检查网络状态",
        "internal.SDKTimerV2.reload": "重新加载",
        "internal.SDKTimerV2.timingSet": "定时设置",
        "internal.SDKTimerV2.duplicatedWarning": "已有相同时间段的重复定时",
        "internal.SDKTimerV2.intervalWarning": "循环定时无效",

        "internal.SDKTimerV2.regularTimer": '常规定时',
        "internal.SDKTimerV2.sunriseAndSunset": '日出日落',
        "internal.SDKTimerV2.sunrise": '日出',
        "internal.SDKTimerV2.sunset": '日落',
        "internal.SDKTimerV2.sunDelta": '{sun, select, U {日出} D {日落}}{delta, select, 0 {时} -1 {前{minutes}分钟} 1 {后{minutes}分钟}}',
        "internal.SDKTimerV2.deltaTime": '{delta, select, 0 {时} -1 {前 {time} 分钟} 1 {后 {time} 分钟}}',
        "internal.SDKTimerV2.pleaseChoose": '请选择',
        "internal.SDKTimerV2.locationCity": '设备所在城市',
        "internal.SDKTimerV2.unKnownCity": '未知',
        "internal.SDKTimerV2.confirmConfigLocation": '确定',
        "internal.SDKTimerV2.chooseCity": '选择地区',

        //FromNowDescription
        "internal.FromNowDescription.laterAction": "{duration}后{action}",

        //TimePicker
        "internal.TimePicker.unitHour": "{type, select," +
            "duration {小时}" +
            "other {时}" +
            "}",
        "internal.TimePicker.unitMinute": "{type, select," +
            "duration {分钟}" +
            "other {分}" +
            "}",
        "internal.TimePicker.unitSecond": "秒",
        /* // HistoryRecordV2
        "internal.HistoryRecordV2.pullDownToRefresh": '下拉刷新',
        "internal.HistoryRecordV2.releaseToRefresh": '释放立即刷新',
        "internal.HistoryRecordV2.refreshing": '正在刷新',
        "internal.HistoryRecordV2.refreshCompleted": '刷新完成',
        "internal.HistoryRecordV2.refreshFailed": '刷新失败',
        "internal.HistoryRecordV2.pullUpToLoad": '上拉加载',
        "internal.HistoryRecordV2.loading": '正在加载',
        "internal.HistoryRecordV2.loadFailed": '加载失败',
        "internal.HistoryRecordV2.noRecords": "没有记录了",
        "internal.HistoryRecordV2.historyRecord": "历史记录",
        */
        /* //PickerPage
       "internal.PickerPage.confirm":"确定", */

        /*  //HistoryRecord
         "internal.HistoryRecord.cancel": "取消",
         "internal.HistoryRecord.confirm": "确定",
         "internal.HistoryRecord.today": "今天",
         "internal.HistoryRecord.useHistory": "使用记录",
         "internal.HistoryRecord.previousDay": "前一天",
         "internal.HistoryRecord.nextDay": "后一天",
         "internal.HistoryRecord.noUsingHistory": "没有使用记录",
         "internal.HistoryRecord.selectDate": "选择日期",
         "internal.HistoryRecord.selectValidDate": "请选择今天或今天之前的日期！",
         "internal.HistoryRecord.getHistoryFailed": "读取历史数据失败",*/

        /*//SDKTimer
         "internal.SDKTimer.confirm": "确定",
         "internal.SDKTimer.confirmDelete": "确认删除？",
         "internal.SDKTimer.noTimer": "还没有添加定时",
         "internal.SDKTimer.addTimer": "添加定时",
         "internal.SDKTimer.delete": "删除",
         "internal.SDKTimer.date": "日期",
         "internal.SDKTimer.operation": "操作",
         "internal.SDKTimer.dateError": "数据有误",
         "internal.SDKTimer.setDataFirst": "请先设置命令内容",
         "internal.SDKTimer.reachLimit0": "单次定时数量已到上限",
         "internal.SDKTimer.reachLimit2": "周期定时数量已到上限",
         "internal.SDKTimer.reachLimit3": "循环定时数量已到上限",
         "internal.SDKTimer.timerSave": "保存",
         "internal.SDKTimer.isoWeekday": "{index, select,"+
           "1 {周一}"+
           "2 {周二}"+
           "3 {周三}"+
           "4 {周四}"+
           "5 {周五}"+
           "6 {周六}"+
           "0 {周日}"+
         "}",
         "internal.SDKTimer.isoWeekdayRepeat": "{index, select,"+
           "1 {星期一}"+
           "2 {星期二}"+
           "3 {星期三}"+
           "4 {星期四}"+
           "5 {星期五}"+
           "6 {星期六}"+
           "0 {星期日}"+
         "}",
         "internal.SDKTimer.repeatSetting": "重复设置",
         "internal.SDKTimer.onceRepeat": "仅一次",
         "internal.SDKTimer.everydayRepeat": "每天",
         "internal.SDKTimer.weekdayRepeat": "工作日",
         "internal.SDKTimer.weekendRepeat": "周末",
         "internal.SDKTimer.customRepeat": "自定义",
         "internal.SDKTimer.today": "今天",
         "internal.SDKTimer.tomorrow": "明天",
         "internal.SDKTimer.timeInvalid": "时间已过期，请重新选择",
         "internal.SDKTimer.selectExecute": "请选择要执行的操作",
         "internal.SDKTimer.commandOn": "开",
         "internal.SDKTimer.commandOff": "关",
         "internal.SDKTimer.startTime": "开始时间",
         "internal.SDKTimer.endTime": "结束时间",
         "internal.SDKTimer.operateOne": "操作一",
         "internal.SDKTimer.operateTwo": "操作二",
         "internal.SDKTimer.recycleTiming": "循环定时",
         "internal.SDKTimer.commonTiming": "常规定时",
         "internal.SDKTimer.recycleChangeText": "设置一段时间内两个操作循环切换。例如：在 8 点到 12点期间，开 20 分钟，关 5 分钟，再开 20 分钟...如此循环。",
         "internal.SDKTimer.setTowMost": "最多可设 2 个循环定时。",
         "internal.SDKTimer.durationTime": "持续时间",
         "internal.SDKTimer.selectTime": "选择时间",
         "internal.SDKTimer.getTimingFail": "获得定时失败",
         "internal.SDKTimer.reachMaximum": "已达到数量上限",
         "internal.SDKTimer.pickerMinute": "{minutes}分钟",
         "internal.SDKTimer.delConfirm": "确定要删除该定时?",
         "internal.SDKTimer.selectOperation": "选择操作",
         "internal.SDKTimer.alreadyDeleted": "该定时已被删除",
         "internal.SDKTimer.selectDate": "选择日期",
         "internal.SDKTimer.getTimerFailed": "获取定时失败,请检查网络状态",
         "internal.SDKTimer.reload": "重新加载",
         "internal.SDKTimer.timingSet": "定时设置",*/

        /*  //Delay
          "internal.Delay.delaySet": "延时设置",
          "internal.Delay.delayStarted": "延时已启动",
          "internal.Delay.delayCanceled": "延时已取消",
          "internal.Delay.closePower": "关闭电源",
          "internal.Delay.openPower": "开启电源",
          "internal.Delay.cancelDelay": "取消延时",
          "internal.Delay.userDefine": "自定义",
          "internal.Delay.item": "{minutes,plural,"+
                  "=0 {}"+
                  "other {{minutes}分钟}"+
              "}"+
              "{hours,plural,"+
                  "=0 {}"+
                  "other {{hours}小时}"+
              "}", */

        /*//SocketStatistics/ElectricStatistics
        "internal.ElectricStatistics.everyHour":"每时",
        "internal.ElectricStatistics.everyDay":"每日",
        "internal.ElectricStatistics.everyMonth":"每月",
        "internal.ElectricStatistics.electricStatistics":"电量统计",
        "internal.ElectricStatistics.KWH":"度",
        "internal.ElectricStatistics.currentHour":"当时",
        "internal.ElectricStatistics.currentDay":"当天",
        "internal.ElectricStatistics.currentMonth":"当月",
        "internal.ElectricStatistics.unitHour":"时",
        "internal.ElectricStatistics.unitMonth":"月",
        "internal.ElectricStatistics.unitDay":"天",
        "internal.ElectricStatistics.emptyData":"返回的数据为空",
        "internal.ElectricStatistics.requestError":"请求数据错误！",
        "internal.ElectricStatistics.powerBtn":"功率",

        //SocketStatistics/PowerStatistics
        "internal.PowerStatistics.emptyData":"返回的数据为空",
        "internal.PowerStatistics.requestError":"请求数据错误！",
        "internal.PowerStatistics.powrStatistics":"功率统计",*/

        //siri 
        "siri.siriShortcut": "Siri 快捷指令",
        "siri.addToSiri": "添加到 Siri",
        "siri.addToSiriDesc": "在 Siri 中创建快捷指令后， 无需打开应用即可通过 Siri 快速执行操作",
        "siri.addShortcut": "添加快捷指令",
        "siri.noShortcut": "无执行操作",
        "siri.performAction": "执行操作",
        "siri.unSet": "未设置",
        "siri.delayExecution": "延时执行",
        "siri.selectCommand": "选择操作",
        "siri.confirm": "确定",
        "siri.second": "秒",
        "siri.delayTime": "延时时间",
        "siri.secondsLater": "秒后",

        //scene
        "scene.scene": "场景",    
        "scene.save": "保存"
        //Jdwelink Timer
        /* "executeRecords":"执行记录",
        "jd.timer.monday":"周一",
        "jd.timer.tuesday":"周二",
        "jd.timer.wednesday":"周三",
        "jd.timer.thursday":"周四",
        "jd.timer.friday":"周五",
        "jd.timer.saturday":"周六",
        "jd.timer.sunday":"周日",
        "jd.timer.weekend":"周末",
        "jd.timer.everyday":"每天",
        "jd.timer.workingDay":"工作日",
        "jd.timer.runOnce":"执行一次",
        "jd.timer.notifyAll":"均通知",
        "jd.timer.ExecutionOfFailureNotificationsOnly":"仅执行失败通知",
        "jd.timer.noNotice":"不通知",
        "jd.timer.repeat":"重复",
        "jd.timer.timerTask":"定时任务",
        "jd.timer.timerName":"定时名称",
        "jd.timer.task":"任务",
        "jd.timer.close":"关闭",
        "jd.timer.executionResultNotification":"执行结果通知",
        "jd.timer.executionFailureNotification":"执行失败通知",
        "jd.timer.month":"月",
        "jd.timer.day":"日",
        "jd.timer.customCycle":"自定义周期",
        "jd.timer.successfulImplementation":"执行成功",
        "jd.timer.executionFailure":"设备不在线，执行失败",
        "jd.timer.noRecordOfExecution":"暂无执行记录！",
        "jd.timer.executeRecords":"执行记录",
        "jd.timer.noTimingIsSetForTheTime":"暂无设置定时",
        "jd.timer.addNewTimer":"点击页面右上方“+”新建定时任务",
        "jd.timer.delete":"删除",
        "jd.timer.edit":"编辑",
        "jd.timer.cancel":"取消",
        "jd.timer.CheckAtLeastOneDate":"至少勾选一个日期",
        "jd.timer.placeholder":"请输入",
        "jd.timer.deleteTimer":"删除定时",
        "jd.timer.closeTimer":"关闭",
        "jd.timer.openTimer":"打开",
        "jd.timer.aircondition":"空调",
        "jd.timer.cmdON": "插座开启",
        "jd.timer.cmdOFF": "插座关闭",
        "jd.timer.cmdUnknown": '未知', */


    },
    'zh-tw': {
        title: '電工插座',
        mainSwitch: "總開關",
        delay: "延時",
        usbSwitch: "USB",
        lightSwitch: "夜燈",
        laterAction: "插座將在{duration}後{action}",
        timerSettingTitle: "插座",
        timerSettingON: "開",
        timerSettingOFF: "關",
        cmdON: "插座開啟",
        cmdOFF: "插座關閉",
        cmdUnknown: '未知',
    },
    en: {
        title: 'Socket',
        mainSwitch: "Main",
        timer: "Timer",
        delay: "Delay",
        usbSwitch: "USB",
        lightSwitch: "Light",
        electricIcon: "Electric",
        timerSettingTitle: "Socket",
        timerSettingON: "ON",
        timerSettingOFF: "OFF",
        cmdON: "Socket ON",
        cmdOFF: "Socket OFF",
        cmdUnknown: 'Unknown',

        // NavBar
        'internal.Navbar.set': 'Setting',
        'internal.Navbar.props':'Property',

        //ActivityIndicator
        "internal.ActivityIndicator.loading": "Loading",

        //Modal
        "internal.Modal.confirm": "Confirm",
        "internal.Modal.cancel": "Cancel",

        //SDKTimerV2
        "internal.SDKTimerV2.confirm": "Confirm",
        "internal.SDKTimerV2.confirmDelete": "Confirm delete?",
        "internal.SDKTimerV2.noTimer": "No timer added",
        "internal.SDKTimerV2.addTimer": "Add Timer",
        "internal.SDKTimerV2.delete": "Delete",
        "internal.SDKTimerV2.date": "Date",
        "internal.SDKTimerV2.operation": "Operation",
        "internal.SDKTimerV2.setDataFirst": "Please add data first",
        "internal.SDKTimerV2.timerSave": "Save",
        "internal.SDKTimerV2.isoWeekday": "{index, select," +
            "1 {Monday}" +
            "2 {Tuesday}" +
            "3 {Wednesday}" +
            "4 {Thursday}" +
            "5 {Friday}" +
            "6 {Saturday}" +
            "0 {Sunday}" +
            "}",
        "internal.SDKTimerV2.isoWeekdayRepeat": "{index,select," +
            "1 {Mon}" +
            "2 {Tue}" +
            "3 {Wed}" +
            "4 {Thu}" +
            "5 {Fri}" +
            "6 {Sat}" +
            "0 {Sun}" +
            "}",
        "internal.SDKTimerV2.repeatSetting": "Repeat setting",
        "internal.SDKTimerV2.onceRepeat": "Only once",
        "internal.SDKTimerV2.everydayRepeat": "Everyday",
        "internal.SDKTimerV2.weekdayRepeat": "Weekday",
        "internal.SDKTimerV2.weekendRepeat": "Weekend",
        "internal.SDKTimerV2.customRepeat": "Custom",
        "internal.SDKTimerV2.today": "Today",
        "internal.SDKTimerV2.tomorrow": "Tomorrow",
        "internal.SDKTimerV2.selectExecute": "Please select the operation to execute",
        "internal.SDKTimerV2.commandOn": "On",
        "internal.SDKTimerV2.commandOff": "Off",
        "internal.SDKTimerV2.startTime": "Start Time",
        "internal.SDKTimerV2.endTime": "End Time",
        "internal.SDKTimerV2.operateOne": "Operate One",
        "internal.SDKTimerV2.operateTwo": "Operate Two",
        "internal.SDKTimerV2.recycleTiming": "Recycle Timing",
        "internal.SDKTimerV2.commonTiming": "Common Timing",
        "internal.SDKTimerV2.recycleChangeText": "Set two operation loops for a period of time. For example，between 8:00 and 12:00, turn on for 20 minutes, close for 5 minutes, drive 20 minutes, and so on, 2 loop timing can be set at most",
        "internal.SDKTimerV2.setTowMost": "2 loop timing can be set at most",
        "internal.SDKTimerV2.durationTime": "Duration Time",
        "internal.SDKTimerV2.selectTime": "Select Time",
        "internal.SDKTimerV2.reachMaximum": "Reach Maximum Number",
        "internal.SDKTimerV2.commReachLimit": "The number of simple timers has reached the upper limit",
        "internal.SDKTimerV2.periodReachLimit": "The number of period timers has reached the upper limit",
        "internal.SDKTimerV2.cycleReachLimit": "The number of cycle timers has reached the upper limit",
        "internal.SDKTimerV2.pickerMinute": "{minutes,plural,=0 {0min} one {#min} other {#mins}}",
        "internal.SDKTimerV2.delConfirm": "Confirm to delete this timer?",
        "internal.SDKTimerV2.selectOperation": "Select Operation",
        "internal.SDKTimerV2.selectDate": "Select Date",
        "internal.SDKTimerV2.getTimerFailed": "Failed to get timing,please check network status.",
        "internal.SDKTimerV2.reload": "Reload",
        "internal.SDKTimerV2.timingSet": "Timing Set",
        "internal.SDKTimerV2.duplicatedWarning": "Already has a timer at the same time",
        "internal.SDKTimerV2.intervalWarning": "Invalid recycle timer",

        "internal.SDKTimerV2.regularTimer": 'Regular Timer',
        "internal.SDKTimerV2.sunriseAndSunset": 'Sunrise & Sunset',
        "internal.SDKTimerV2.sunrise": 'Sunrise',
        "internal.SDKTimerV2.sunset": 'Sunset',
        "internal.SDKTimerV2.sunDelta": '{delta, select, 0 {At } -1{{minutes} minutes before } 1{{minutes} minutes after }}{sun, select, U{sunrise} D{sunset}}',
        "internal.SDKTimerV2.deltaTime": '{delta, select, 0 {0 minutes} -1 {{time} minutes ago} 1 {{time} minutes later}}',
        "internal.SDKTimerV2.pleaseChoose": 'Please choose',
        "internal.SDKTimerV2.locationCity": 'Device location',
        "internal.SDKTimerV2.unKnownCity": 'Unknown City',
        "internal.SDKTimerV2.confirmConfigLocation": 'Confirm',
        "internal.SDKTimerV2.chooseCity": 'Select Region',


        //FromNowDescription
        "internal.FromNowDescription.laterAction": "will {action} in {duration}",

        //TimePicker
        "internal.TimePicker.unitHour": "hour",
        "internal.TimePicker.unitMinute": "min",
        "internal.TimePicker.unitSecond": "second",

        /* // HistoryRecordV2
        "internal.HistoryRecordV2.pullDownToRefresh": 'Pull down to refresh',
        "internal.HistoryRecordV2.releaseToRefresh": 'Release to refresh',
        "internal.HistoryRecordV2.refreshing": 'Refreshing',
        "internal.HistoryRecordV2.refreshCompleted": 'Refresh completed',
        "internal.HistoryRecordV2.refreshFailed": 'Refresh failed',
        "internal.HistoryRecordV2.pullUpToLoad": 'Pull up to load',
        "internal.HistoryRecordV2.loading": 'Loading',
        "internal.HistoryRecordV2.loadFailed": 'Load failed',
        "internal.HistoryRecordV2.noRecords": "No more records",
        "internal.HistoryRecordV2.historyRecord": "History Record",
        */
        /*  //PickerPage
          "internal.PickerPage.confirm":"Confirm",*/

        /* //HistoryRecord
         "internal.HistoryRecord.cancel": "Cancel",
         "internal.HistoryRecord.confirm": "Confirm",
         "internal.HistoryRecord.today": "Today",
         "internal.HistoryRecord.useHistory": "Use History",
         "internal.HistoryRecord.previousDay": "Previous Day",
         "internal.HistoryRecord.nextDay": "Next Day",
         "internal.HistoryRecord.noUsingHistory": "NO Using History",
         "internal.HistoryRecord.selectDate": "Select Date",
         "internal.HistoryRecord.selectValidDate": "Please select the date today or before today.",
         "internal.HistoryRecord.getHistoryFailed": "Failed to read history data.",*/

        /* //SDKTimer
         "internal.SDKTimer.confirm": "Confirm",
         "internal.SDKTimer.confirmDelete": "Confirm delete?",
         "internal.SDKTimer.noTimer": "No timer added",
         "internal.SDKTimer.addTimer": "Add Timer",
         "internal.SDKTimer.delete": "Delete",
         "internal.SDKTimer.date": "Date",
         "internal.SDKTimer.operation": "Operation",
         "internal.SDKTimer.dateError": "Incorrect data",
         "internal.SDKTimer.setDataFirst": "Please add data first",
         "internal.SDKTimer.reachLimit0": "The number of simple timers has reached the upper limit",
         "internal.SDKTimer.reachLimit2": "The number of period timers has reached the upper limit",
         "internal.SDKTimer.reachLimit3": "The number of recycle timers has reached the upper limit",
         "internal.SDKTimer.timerSave": "Save",
         "internal.SDKTimer.isoWeekday": "{index, select,"+
           "1 {Monday}"+
           "2 {Tuesday}"+
           "3 {Wednesday}"+
           "4 {Thursday}"+
           "5 {Friday}"+
           "6 {Saturday}"+
           "0 {Sunday}"+
         "}",
         "internal.SDKTimer.isoWeekdayRepeat": "{index,select,"+
             "1 {Mon}"+
             "2 {Tue}"+
             "3 {Wed}"+
             "4 {Thu}"+
             "5 {Fri}"+
             "6 {Sat}"+
             "0 {Sun}"+
         "}",
         "internal.SDKTimer.repeatSetting": "Repeat setting",
         "internal.SDKTimer.onceRepeat": "Only once",
         "internal.SDKTimer.everydayRepeat": "Everyday",
         "internal.SDKTimer.weekdayRepeat": "Weekday",
         "internal.SDKTimer.weekendRepeat": "Weekend",
         "internal.SDKTimer.customRepeat": "Custom",
         "internal.SDKTimer.today": "Today",
         "internal.SDKTimer.tomorrow": "Tomorrow",
         "internal.SDKTimer.timeInvalid": "Please choose a time after current moment",
         "internal.SDKTimer.selectExecute": "Please select the operation to execute",
         "internal.SDKTimer.commandOn": "On",
         "internal.SDKTimer.commandOff": "Off",
         "internal.SDKTimer.startTime": "Start Time",
         "internal.SDKTimer.endTime": "End Time",
         "internal.SDKTimer.operateOne": "Operate One",
         "internal.SDKTimer.operateTwo": "Operate Two",
         "internal.SDKTimer.recycleTiming": "Recycle Timing",
         "internal.SDKTimer.commonTiming": "Common Timing",
         "internal.SDKTimer.recycleChangeText": "Set two operation loops for a period of time.For example:between 8:00 and 12:00, turn on for 20 minutes, close for 5 minutes, drive 20 minutes ,and so on",
         "internal.SDKTimer.setTowMost": "2 loop timing can be set at most",
         "internal.SDKTimer.durationTime": "Duration Time",
         "internal.SDKTimer.selectTime": "Select Time",
         "internal.SDKTimer.getTimingFail": "Get Timing Fail",
         "internal.SDKTimer.reachMaximum": "Reach Maximum Number",
         "internal.SDKTimer.pickerMinute": "{minutes,plural,=0 {0min} one {#min} other {#mins}}",
         "internal.SDKTimer.delConfirm": "Confirm to delete this timer?",
         "internal.SDKTimer.selectOperation": "Select Operation",
         "internal.SDKTimer.alreadyDeleted": "This timer has already been deleted.",
         "internal.SDKTimer.selectDate": "Select Date",
         "internal.SDKTimer.getTimerFailed": "Failed to get timing,please check network status.",
         "internal.SDKTimer.reload": "Reload",
         "internal.SDKTimer.timingSet": "Timing Set",
         */

        /*  //Delay
          "internal.Delay.delaySet": "Delay Set",
          "internal.Delay.delayStarted": "delay has been started",
          "internal.Delay.delayCanceled": "delay has been canceled",
          "internal.Delay.closePower": "close power",
          "internal.Delay.openPower": "open power",
          "internal.Delay.cancelDelay": "cancellation of delay",
          "internal.Delay.userDefine": "customize",
          "internal.Delay.item": "{minutes,plural,"+
                  "=0 {}"+
                  "=1 {#min}"+
                  "other {#mins}"+
              "}"+
              "{hours,plural,"+
                  "=0 {}"+
                  "=1 {#hour}"+
                  "other {#hours}"+
              "}", */

        /*   //ElectricStatistics
           "internal.ElectricStatistics.everyHour":"Every Hour",
           "internal.ElectricStatistics.everyDay":"Every Day",
           "internal.ElectricStatistics.everyMonth":"Every Month",
           "internal.ElectricStatistics.electricStatistics":"Electric Statistics",
           "internal.ElectricStatistics.KWH":"KWH",
           "internal.ElectricStatistics.currentHour":"The Hour",
           "internal.ElectricStatistics.currentDay":"The Day",
           "internal.ElectricStatistics.currentMonth":"The Month",
           "internal.ElectricStatistics.unitHour":"hour",
           "internal.ElectricStatistics.unitMonth":"month",
           "internal.ElectricStatistics.unitDay":"day",
           "internal.ElectricStatistics.emptyData":"The returned data is empty.",
           "internal.ElectricStatistics.requestError":"Request data error!",
           "internal.ElectricStatistics.powerBtn":"Power",

           //PowerStatistics
           "internal.PowerStatistics.emptyData":"The returned data is empty.",
           "internal.PowerStatistics.requestError":"Request data error!",
           "internal.PowerStatistics.powrStatistics":"Powr Statistics",*/

    }
};
