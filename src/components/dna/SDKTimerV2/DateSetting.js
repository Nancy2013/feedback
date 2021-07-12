import React from 'react';
import PropTypes from 'prop-types';
import TimePicker from '../../TimePicker'

import moment from 'moment'
import style from './SDKTimer.less'
import BottomButton from '../BottomButton'
import NavBar from '../NavBar';
import Page from '../Page';
import { injectIntl } from 'react-intl';
export default injectIntl(class extends React.PureComponent {

    static defaultProps = {
        time :moment()
    };

    constructor(props) {
        super(props);
        // this.currentDate = props.time.clone();
        this.state = {currentDate: props.time.clone()};
        this.updateTime = this.updateTime.bind(this);
        this.save = this.save.bind(this);
    }

    updateTime(date){
        let choseDate = moment(date);
        // this.currentDate = moment(date);
        const tempTime = this.props.time.clone();
        if (this.props.edit && tempTime.startOf('year').isAfter(moment().startOf('year'))) {
            choseDate.set('year', tempTime.get('year'));
        } else if (moment(date).isBefore(moment().startOf('day'))) {
            choseDate.add(1, 'years');
        }

        // if (this.props.index == undefined && moment(date).isBefore(moment())) {
        //     choseDate.add(1, 'years');
        // }
        this.setState({currentDate: choseDate});
    }

    save(){
        const {timerHandler,history,time} =this.props;

        // const today = moment().startOf('day');
        const pickerDate = this.state.currentDate.startOf('day');

        // if(pickerDate.isBefore(today)){
        //     //next year
        //     pickerDate.add(1, 'y');
        // }

        const finalTime = pickerDate.format("YYYY-MM-DD")+' '+time.format("HH:mm:ss");

        console.log('设置时间为：'+finalTime);

        timerHandler('UPDATE',{time:moment(finalTime,"YYYY-MM-DD HH:mm:ss")});

        history.goBack();
    }

    render() {
        const {time,intl:{formatMessage}} =this.props;

        return (
            <Page saveBottom>
                <NavBar title={formatMessage({id:'internal.SDKTimerV2.selectDate'})} right={[]}/>
                <TimePicker type="date" defaultValue={this.state.currentDate} onChange={this.updateTime}/>
                <div style={{textAlign: 'center', color: '#888', fontSize: '0.5rem', marginTop: '0.4rem'}}>{this.state.currentDate.format("YYYY-MM-DD")}</div>
                <BottomButton text={formatMessage({id:'internal.SDKTimerV2.timerSave'})} onClick={this.save}/>
            </Page>
        )

    }
})