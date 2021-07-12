import React from 'react';
import style from './SDKTimer.less'

import Toast from '../../Toast';
import BottomButton from '../BottomButton'
import Page from '../Page';
import NavBar from '../NavBar';

import { injectIntl } from 'react-intl';
import {isEmpty} from  '../../utils'

export default injectIntl(class extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            command: props.command
        };
        this.save = this.save.bind(this);
    }

    updateCommand = (cmd)=> {
        this.setState({
            command: cmd
        });
    };

    save = (enable)=> {
        const {formatMessage} = this.props.intl;
        if (this.state.command) {
            let {timerHandler,history} =this.props;

            timerHandler('UPDATE', {status: this.state.command});
            history.goBack();
        } else {
            Toast.info(formatMessage({id:'internal.SDKTimer.setDataFirst'}));
        }
    }

    render() {
        const command={...this.state.command};
        const {content :Content,intl:{formatMessage}} = this.props;
        return (
            <Page saveBottom>
                <NavBar title={formatMessage({id:'internal.SDKTimer.selectOperation'})} right={[]}/>
                <Content {...{command, updateCommand: this.updateCommand}}/>
                <BottomButton text={formatMessage({id:'internal.SDKTimer.confirm'})} onClick={this.save} enable={!isEmpty(command)}/>
            </Page>
        )

    }
})