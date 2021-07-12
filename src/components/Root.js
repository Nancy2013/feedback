import React, { PureComponent } from 'react';
import * as logic from './logic';
// import Toast from './Toast';
import Modal from './Modal';
import Loading from './ActivityIndicator';
// import initReactFastclick from 'react-fastclick';
import JdOfflineMask from './jd/OffLineMask';
import {notifyError} from "./utils";

function autoCloseModal(Component) {

    const modalsMap = {};
    return class extends PureComponent {

        constructor(props) {
            super(props);
            Modal.onOpen(this.onModalOpen);
        }

        onModalOpen = (id)=>{
            const {location} = this.props;
            const {pathname} = location;
            let modals = modalsMap[pathname];
            if(!modals){
                modals = [];
                modalsMap[pathname] = modals;
            }
            modals.push(id);
            console.debug(`open new modal : ${JSON.stringify(modalsMap)}`);
        };

        componentWillUpdate(nextProps) {
            const { location } = this.props;
            // console.debug(`current location ${JSON.stringify(location)} `);
            // console.debug(`history info ${nextProps.history.action} , ${JSON.stringify(nextProps.history.location)}`);


            if(nextProps.history.action === 'POP' &&
                nextProps.location !== location
            ){
                const {pathname} = location;
                let modals = modalsMap[pathname];
                if(modals){
                    modals.forEach(id =>Modal.close(id));
                    modalsMap[pathname] = null;
                    console.debug(`leaving page ${JSON.stringify(location)},after close all ${JSON.stringify(modalsMap)}`);
                }
            }
        }



        render() {
            return (
                <Component {...this.props}/>
            );
        }
    }
}

class Root extends PureComponent {

    componentDidMount() {
        const {loading,ready,settings} = this.props;
        const defaultLogicProp = {
            // updateStrategy:'immediate',
            loading,
            onFail:e=>{
                notifyError(e);
                // return true
            },
            // retry:{
            //     errorCode:1,
            //     retryCount:3,
            //     timeout:500
            // }
        };

        logic.ready(this.update).catch(e=>{
            // Modal.alert(e.message||e.msg);
            notifyError(e);
            ready();
        });
        logic.updateDefaultControlOpts({...defaultLogicProp,...settings});
        // initReactFastclick();

    }

    update = (stauts,isFirstTime)=>{
        const {updateStatus} = this.props;
        const state = logic.getState();
        updateStatus(state);
    };

    render() {
        const {isReady,isLoading,children,history,location,match,isStatusReady,isOnline} = this.props;
        return (
            <React.Fragment>
                {
                    React.Children.map(children, child => React.cloneElement(child, {history, location, match}))
                }
                {(!isReady ||isLoading||!isStatusReady) && <Loading/>}
                {(!isOnline ) && <JdOfflineMask />}
            </React.Fragment>

        );
    }
}

export default autoCloseModal(Root)


