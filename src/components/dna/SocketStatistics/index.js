import React from 'react';
import {
    Route,
    HashRouter as Router,
    Redirect
} from 'react-router-dom'

import Switch from '../../TransitionSwitch'
import ElectricStatistics from './ElectricStatistics';
 
import style from './style.less';
import PropTypes from 'prop-types';
 
import PowerStatistics from './PowerStatistics/index.js'
import LocaleProvider from '../../LocaleProvider';

 

export default  class extends React.Component {

    static defaultProps = {
        did: "00000000000000000000780f77314c5d",
        hasPowerStatistics:true
    };
    static propTypes = {
        //负载类型
        did: PropTypes.string.isRequired, 
        history: PropTypes.object.isRequired,//react Route里的参数
        location: PropTypes.object.isRequired,//react Route里的参数
        hasPowerStatistics: PropTypes.bool.isRequired//是否有功率统计页面
    };
    render() {
        // let pathname=this.props.location.pathname
        // console.debug(this.props.location,pathname,"location")
        console.debug(this.props,"this.props")
        const {did,history,location }=this.props
        console.debug(did,"did",history,"history" )
        return (
            <Router>
                <LocaleProvider>
                    <div className={style.ScreenHeight}>
                        <Switch location={location} history={history} level={1}>
                            <Route path="/electric/power" render={(props) =>
                                <PowerStatistics did={did} {...props}/>
                            } />
                            <Route path="/" render={(props) =>
                                 <ElectricStatistics {...props} did={did} hasPowerStatistics />
                            } />
                        </Switch>
                    </div>
                </LocaleProvider>
            </Router>
           
           
        )
    }
}