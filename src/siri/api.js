import sdk from 'broadlink-jssdk';

export const getSiriList =()=>{
    let siriList = [];
    return new Promise((resolve,reject)=>{
        sdk.platformSDK.callNative('getInitedVoices', [], 'BLDeviceVoiceUIBridge').then((data)=>{   
            // alert(JSON.stringify(data.data[0]));
            data.data.forEach((index,i)=>{
                let cmd = {};
                const { delay, type, voiceId, shortcutText, cmds } = index;
                const { params, vals } = cmds
                for(let i=0;i<params.length;i++){
                    cmd[params[i]] = vals[i][0].val
                }
                siriList.push({delay, type, voiceId, shortcutText, cmd})
            })
            resolve(siriList)
        }).catch((e)=>alert(e));
    })
}

export const addOrEditSiri= async({ voice, cmd, type=0, delay=0, callback })=>{
    const {deviceID} =  await sdk.platformSDK.getDevice();
    let voiceId = voice ? voice : deviceID+"_"+new Date().getTime();
    if(delay>0&&!voice ){
        voiceId+=delay+"_DelayControl"   //延时必须加’DelayControl‘关键字 否则会立即执行  （app逻辑）
    }
    let params=[], vals=[];
    for (let param in cmd){
        params.push(param);
        vals.push([
            {
                "idx": 1,
                "val": cmd[param]
            }
        ])
    }
    const sendParams={
        voiceId, 
        type,
        delay,  
        "did": deviceID,
        "cmds": [
            {
                "act":"set",
                params,
                vals,
            }
        ]
    }
    // alert(JSON.stringify(sendParams),"sendParams" )
    sdk.platformSDK.callNative('setVoiceCmd', [sendParams], 'BLDeviceVoiceUIBridge').then(()=>{
        callback && callback()
    }).catch((e)=>alert(e))
}
