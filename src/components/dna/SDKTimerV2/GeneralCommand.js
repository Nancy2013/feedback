import React from 'react';
import Toast from '../../Toast';
import BottomButton from '../BottomButton'
import Page from '../Page';
import NavBar from '../NavBar';

import { injectIntl } from 'react-intl';
import {isEmpty} from  '../../utils'
import connect from "react-redux/es/connect/connect";
import {dnaSelectors} from "../../reducers";
import {updateCurrentTimer} from "../../actions/timer";
import PropTypes from "prop-types";

class Command extends React.PureComponent {
    static propsTypes = {
        save:PropTypes.func.isRequired,
        defaultCmd:PropTypes.object
    };

    static defaultProps = {
        defaultCmd:{},
    };

    constructor(props) {
        super(props);
        this.state = {
            command: props.defaultCmd
        };
        this.save = this.save.bind(this);
    }

    updateCmd = (cmd)=> {
        this.setState({
            command: cmd
        });
    };

    save = (enable)=> {
        const {formatMessage} = this.props.intl;
        const {command}=this.state;
        if (!isEmpty(command)) {
            let {history,save} =this.props;
            save(command);

            history.goBack();
        } else {
            Toast.info(formatMessage({id:'internal.SDKTimerV2.setDataFirst'}));
        }
    };

    render() {
        const {command}=this.state;
        const {content :Content,intl:{formatMessage}} = this.props;
        return (
            <Page saveBottom>
                <NavBar title={formatMessage({id:'internal.SDKTimerV2.selectOperation'})} right={[]}/>
                <Content  updateCmd ={this.updateCmd} cmd = {command}/>
                <BottomButton text={formatMessage({id:'internal.SDKTimerV2.confirm'})} onClick={this.save} enable={!isEmpty(command)}/>
            </Page>
        )

    }
}

export default connect(state => {
        const timer = dnaSelectors.timerSelectors.getCurrent(state);
        return {
            defaultCmd: timer.cmd
        }
    },
    {
        save: cmd => updateCurrentTimer({cmd})
    })(injectIntl(Command));