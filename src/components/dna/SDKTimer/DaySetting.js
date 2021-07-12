import React from 'react';
import style from './SDKTimer.less'
import BottomButton from '../BottomButton'
import NavBar from '../NavBar';
import Page from '../Page';
import { injectIntl } from 'react-intl';
function CheckButton({checked}){
    return (
        <p>
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

export default injectIntl(class extends React.PureComponent {

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
        const {timerHandler} = this.props;
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
        const {timerHandler,history} =this.props;
        timerHandler('UPDATE',{repeat: this.state.repeat});
        history.go(-2);
    };

    render() {
        const {repeat} =this.state;
        const dayOfWeek = [...new Array(8)];
        let {formatMessage} = this.props.intl;

        return (
            <Page saveBottom>
                <NavBar title={formatMessage({id:'internal.SDKTimer.customRepeat'})} right={[]}/>
                    <div className={style.listBox}>
                        {dayOfWeek.map((day ,index)=>{
                            return index !== 0 && <Item key={index}
                                                title={formatMessage({id:'internal.SDKTimer.isoWeekdayRepeat'}, {index})}
                                                checked={repeat&&repeat.indexOf(index)>=0}
                                                onClick={()=>this.chooseDay(index)}
                                    />
                        })}
                    <BottomButton text={ formatMessage({id:'internal.SDKTimer.timerSave'})}  onClick={this.save} />
                </div>
            </Page>
        )

    }
})