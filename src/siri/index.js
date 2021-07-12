import React from 'react';
import ReactDOM from 'react-dom';
import '../index.css';
import '../flexible';
import LocaleProvider from '../components/LocaleProvider';
import {
    HashRouter as Router,
    Route,
} from 'react-router-dom'
import { injectIntl} from 'react-intl';
import Siri from "./siri.js";
import {Setting , descFunc } from '../TimerSceneSiriSetting';


const SiriSetting = props=><Setting {...props} themeColor={"#2198FF"} /> 

const Index = injectIntl (class extends React.PureComponent {
    desc = cmd => {
        const {formatMessage}=this.props.intl;
        return descFunc(cmd,formatMessage)
    };
    render() {
        return (
           <Siri desc={this.desc} {...this.props} SiriSetting={SiriSetting} />
        )
    }
})


ReactDOM.render(
    <div style={{height: "100%"}}>
        <LocaleProvider>
            <Router>
                <Route render={(props)=>
                    <Index {...props}/>
                }/>
            </Router>
        </LocaleProvider>
    </div>
   ,
    document.getElementById('root')
);



