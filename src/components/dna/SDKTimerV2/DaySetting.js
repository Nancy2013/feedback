import React from 'react';
import style from './SDKTimer.less'
import BottomButton from '../BottomButton'
import NavBar from '../NavBar';
import Page from '../Page';
import { injectIntl } from 'react-intl';
import connect from "react-redux/es/connect/connect";
import {dnaSelectors} from "../../reducers";
import {addCurrentTimerRepeat} from "../../actions/timer";




function CheckButton({checked}){
    return (
        <p>
            {/* eslint-disable-next-line*/}
            <a className={checked?style.changeColor:null}>
                <i className={checked?style.changeColor:null}></i>
            </a>
        </p>
    );
}

function Item({title,checked,onClick}) {
    return (
        <div onClick={onClick} className={style.list}>
            <span>{title}</span>
            <CheckButton {...{checked}}/>
        </div>

    );
}

class DaySetting extends React.PureComponent {

    static defaultProps = {
        repeat :[]
    };
    constructor(props) {
        super(props);
        const repeat = props.repeat;
        this.state={
            repeat
        }
    }
    chooseDay(day){
        const {repeat} = this.state;
        let newRepeat;
        if (repeat.indexOf(day) >= 0) {
            newRepeat = repeat.filter((value) => value !== day)
        } else {
            newRepeat = [...repeat, day];
        }

        // timerHandler('UPDATE',{repeat:newRepeat});
        this.setState({repeat: newRepeat});
    }

    save = () => {
        const {update,history} =this.props;
        update(this.state.repeat);
        history.go(-2);
    };

    render() {
        const {repeat} =this.state;
        const dayOfWeek = [0,1,2,3,4,5,6];
        let {formatMessage} = this.props.intl;

        return (
            <Page saveBottom>
                <NavBar title={formatMessage({id:'internal.SDKTimerV2.customRepeat'})} right={[]}/>
                <div className={style.listBox}>
                    {dayOfWeek.map((day, index) => <Item key={index}
                                                         title={formatMessage({id: 'internal.SDKTimerV2.isoWeekdayRepeat'}, {index})}
                                                         checked={repeat && repeat.indexOf(index) >= 0}
                                                         onClick={() => this.chooseDay(index)}
                    />)}
                    <BottomButton text={ formatMessage({id:'internal.SDKTimerV2.timerSave'})}  onClick={this.save} />
                </div>
            </Page>
        )

    }
}


export default connect(
    state => {
        const timer = dnaSelectors.timerSelectors.getCurrent(state);
        return {
            repeat:timer.getRepeat(),
        }
    },
    {update: addCurrentTimerRepeat},

)(injectIntl(DaySetting));