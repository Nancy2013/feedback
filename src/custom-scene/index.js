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
import Scene from "./Scene";
import {Setting , descFunc } from '../TimerSceneSiriSetting';


const Index = injectIntl (class extends React.PureComponent {
    
    desc = cmd => {
        const {formatMessage}=this.props.intl;
        return descFunc(cmd,formatMessage)
    };

    render() {
        return (
           <Scene desc={this.desc} {...this.props} SceneSetting={Setting} />
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



