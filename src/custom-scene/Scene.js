import React from 'react';
import Page from '../components/dna/Page';
import NavBar from '../components/dna/NavBar'
import style from './index.less'
import sdk from 'broadlink-jssdk';

const saveSceneToNative = async({ cmd , desc })=>{
    const params = {
        "name": desc(cmd),
        "cmds": []
    }
    for(let param in cmd){
        params.cmds.push({
            name: desc({[param]: cmd[param]}),
            params: [param],
            vals: [cmd[param]]
        })
    }
    //处理master和子设备 ⬇⬇
    const { deviceID, subDeviceID } = await sdk.platformSDK.callNative('deviceinfo');
    if(subDeviceID){
        params.gatewayDid = deviceID
        params.did = subDeviceID
    }else{
        params.did = deviceID
    }
    console.log(params);
    //send ⬇⬇
    sdk.platformSDK.callNative('saveSceneCmds', [params], 'BLIftttBridge')
}

export default class Scene extends React.PureComponent {

    state={
        cmd: {}
    };

    updateCmd =cmd=>{
        this.setState({cmd})
    };

    saveCmd=()=>{
        const { cmd } = this.state;
        saveSceneToNative({ cmd, desc: this.props.desc })
    };
    
    render(){
        const { intl, SceneSetting } = this.props;
        const { cmd } = this.state;
        const disableSave = !cmd ||  Object.keys(cmd).length===0 ;
        return (
            <Page >
                <NavBar title={intl.formatMessage({id:'scene.scene'})}  color={"#000000"} exit opacity />
                <SceneSetting cmd={cmd} updateCmd={this.updateCmd} />
                <div onClick={!disableSave ? this.saveCmd : undefined} className= {style.saveCommand} style={{ background: disableSave ? "rgba(191,191,191,1)" : "" }}>
                    {intl.formatMessage({id: 'scene.save'})}
                </div>
            </Page>
        )
    }
}


