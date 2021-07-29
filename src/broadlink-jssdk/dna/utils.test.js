const utils = require('./utils');

test('combine&split simple cmd data', () => {
    var obj1 = {
        'params': ['pwr', 'mark', 'lrdir', 'udder', 'mode', 'temp'],
        'vals': [
            [{'val': 1, 'idx': 1}],
            [{'val': 1, 'idx': 1}],
            [{'val': 1, 'idx': 1}],
            [{'val': 1, 'idx': 1}],
            [{'val': 1, 'idx': 1}],
            [{'val': 25, 'idx': 1}]
        ]
    };

    var obj2 = {
        pwr: 1,
        mark: 1,
        lrdir: 1,
        udder: 1,
        mode: 1,
        temp: 25,
    };

    expect(utils.combine(obj1)).toEqual(obj2);
    expect(utils.split(obj2)).toEqual(obj1);
});



test('combine&split complex cmd data', () => {
    var obj1 = {
            'params':['rmtimer'],
            'vals':[
                [
                    {'val':'0|1|19|30|1|打开电视','idx':1},
                    {'val':'0|1|21|30|7|打开空调','idx':1},
                    {'val':'0|1|23|00|7|关上窗帘','idx':1}
                ]
            ]
        }
    ;

    var obj2 = {
        rmtimer: ['0|1|19|30|1|打开电视','0|1|21|30|7|打开空调','0|1|23|00|7|关上窗帘']
    };

    expect(utils.combine(obj1)).toEqual(obj2);
    expect(utils.split(obj2)).toEqual(obj1);
});


test('combine&split complex&simple cmd data', () => {
    var obj1 = {
            'params':['rmtimer','pwr'],
            'vals':[
                [
                    {'val':'0|1|19|30|1|打开电视','idx':1},
                    {'val':'0|1|21|30|7|打开空调','idx':1},
                    {'val':'0|1|23|00|7|关上窗帘','idx':1}
                ],
                [{'val': 1, 'idx': 1}]
            ]
        }
    ;

    var obj2 = {
        rmtimer: ['0|1|19|30|1|打开电视','0|1|21|30|7|打开空调','0|1|23|00|7|关上窗帘'],
        pwr:1
    };

    expect(utils.combine(obj1)).toEqual(obj2);
    expect(utils.split(obj2)).toEqual(obj1);
});