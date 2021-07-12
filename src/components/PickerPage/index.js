import React from 'react';
import PropTypes from 'prop-types';
import TimePicker from '../TimePicker';

import moment from 'moment';
import BottomButton from '../dna/BottomButton';
import Page from '../dna/Page';
import NavBar from '../dna/NavBar'
import { injectIntl } from 'react-intl';

export default injectIntl(class extends React.PureComponent {
    static propTypes = {
        date:PropTypes.object,
        save:PropTypes.func,
        checkChange:PropTypes.bool
    };

    static defaultProps = {
        date :new Date(),
        checkChange: false
    };

    state ={
        changed :false
    };

    onChange = date=>{
        if(!moment(this.props.date).startOf('minute').isSame(moment(date))){
            this.date=moment(date);
            this.setState({
                changed :true
            });
        }else{
            this.setState({
                changed :false
            });
        }
    };

    save = ()=>{
        if((!this.props.checkChange || this.state.changed) && this.props.save){
            this.props.save(this.date || this.props.date);
        }
    };


    render() {
        const {date,save,isDuration,checkChange,intl:{formatMessage},...passthrough} =this.props;
        return (
            <Page saveBottom>
                <NavBar title={this.props.title} opacity={false} right={[]}/>
                <TimePicker {...passthrough} defaultValue={moment(date)} onChange={this.onChange}/>
                <BottomButton text={formatMessage({id:'internal.PickerPage.confirm'})} onClick={this.save} enable={!checkChange ||this.state.changed}/>
            </Page>
        )
    }
})