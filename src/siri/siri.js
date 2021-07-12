import React from 'react';
import '../index.css';
import '../flexible';
import SiriList from './SiriList';
import SiriDetail from './siriDetail'
import {getSiriList} from './api';
import {
    Route,
    Switch
} from 'react-router-dom';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';


export default injectIntl (class extends React.PureComponent {

    static propTypes = {
        /*
        命令设置界面
        React组件
        */
        setting: PropTypes.func,
        desc:PropTypes.func.isRequired,
    };

    state={
        siriList:[]
    };

    componentDidMount(){
        this._getSiriList()
    };

    _getSiriList=async()=>{
        this.setState({
            siriList: await getSiriList()
        })
    };

    render() {
        const {siriList} = this.state;
        return (
            <Switch location={this.props.location} history={this.props.history} level={1} >
                <Route path="/siriDetail"  render={ props =>
                    <SiriDetail {...props} {...this.props} getSiriList={this._getSiriList} />
                }/>
                <Route path="/"  render={ props =>
                    <SiriList {...props} siriList={siriList} {...this.props}  getSiriList={this._getSiriList}/>
                }/>
            </Switch>
        )
    }

})




