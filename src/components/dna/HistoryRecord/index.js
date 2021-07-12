import React from 'react';
import PropTypes from 'prop-types';
import style from './style.less';
import TimePicker from '../../TimePicker';
import Popup from '../Popup';
import downIcon from './images/down.svg';
import NavBar from '../NavBar';
import Page from '../Page';
import sdk from 'broadlink-jssdk';
import Toast from '../../Toast';
import Loading from '../../ActivityIndicator';
import moment from 'moment';
import classNames from 'classnames';
import recordIcon from './images/no-record.png';
import {injectIntl, FormattedMessage} from 'react-intl'

export default injectIntl(class extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            date: moment(new Date()),
            dataText: moment().format('MM-DD'),
            showPicker: false
        };
    };
    static propTypes = {
        did: PropTypes.string,                   //did
        params: PropTypes.oneOf([                //需要查询的参数['pwr']
            PropTypes.string,
            PropTypes.array
        ]),
        desc: PropTypes.function            //解析查询值 显示的方法 读取到的  {pwr:1} 显示为 开启---- ({pwr:1})=>{return '开启'}

    }
    componentDidMount() {
        // let today = new moment()
        this.showHistory(this.state.date)
    };
    nextDay = () => {
        let {formatMessage} = this.props.intl
        if (this.state.date.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
            Toast.info(formatMessage({id:'internal.HistoryRecord.selectValidDate'}));
            return;
        }

        this.state.date.add(1, 'days')
        this.setState({
            dataText: this.state.date.format('MM-DD')
        })
        this.showHistory(this.state.date);
    };
    prevDay = () => {
        this.state.date.subtract(1, 'days')
        this.setState({
            dataText: this.state.date.format('MM-DD')
        })
        this.showHistory(this.state.date);
    };
    showHistory = (date) => {
        const { did } = this.props; //
        let begin = moment(date);
        begin.hour(0);
        begin.minute(0);
        begin.second(0);
        begin = this.timeToEast8(begin);
        let end = moment(date);
        end.hour(23);
        end.minute(59);
        end.second(59);
        end = this.timeToEast8(end);
        let East8Time = this.timeToLoacl(date);
        this.setState({
            loading: true
        })
        let beginTime = begin.format("YYYY-MM-DD_HH:mm:ss");
        let endTime = end.format("YYYY-MM-DD_HH:mm:ss");
        let params = this.makeHistParams(did, beginTime, endTime);
        this.getHistInfo(params);
    }

    makeHistParams = (did, beginTime, endTime) => {
        let { params } = this.props;
        let queryParams;
        if (params === undefined) {
            queryParams = []
        } else if (Array.isArray(params)) {
            queryParams = JSON.parse(JSON.stringify(params));
            queryParams.push('time');
        } else {
            queryParams = [params, 'time'];
        }

        let sentParams = {
            "device": [
                {
                    "start":beginTime,
                    "did": did,
                    "end":endTime,
                    "params": queryParams,
                }
            ],
            "report": "fw_currentstate_v1"
        };
        let tempParams = JSON.stringify(sentParams);
        let appParams = { "method": "post", "interfaceName": 'v1/device/status', "serviceName": "dataservice", 'httpBody': tempParams };
        return [appParams];
    }

    getHistInfo = (params) => {
        let {formatMessage} = this.props.intl
        
        this.setState({
            loading: true
        });
        sdk.platformSDK.callNative('cloudServices', params).then((data) => {
            console.log(data);


            if (data === "" || data === null) {
                Toast.info(formatMessage({id:'internal.HistoryRecord.getHistoryFailed'}));
                this.setState({
                    data: [],
                    loading: false
                });
            } else {

                var histInfo = data.table[0].values;
                if (histInfo == null) {
                    this.setState({
                        data: [],
                        loading: false
                    });
                } else {
                    this.setState({
                        data: histInfo,
                        loading: false
                    });
                }
            };

        }).catch((e) => {
            console.info(e);
            this.setState({
                data: [],
                loading: false
            });
            Toast.info(formatMessage({id:'internal.HistoryRecord.getHistoryFailed'}));
        });
    };

    timeToLoacl = (time) => {
        let timeCopy = moment(time);
        return timeCopy.add(-480 + moment().utcOffset(), 'minutes');
    };
    timeToEast8 = (time) => {
        let timeCopy = moment(time);
        return timeCopy.subtract(-480 + moment().utcOffset(), 'minutes');
    };
    closeSelf = () => {
        this.setState({
            showPicker: false
        });
        return true;
    };
    openPicker = () => {
        this.setState({
            showPicker: true
        })
    };
    changeTime = () => {
        let {formatMessage} = this.props.intl;
        let instDate = moment(this.instValue)
        if (instDate > moment()) {
            Toast.info(formatMessage({id:'internal.HistoryRecord.selectValidDate'}));
            return false;
        }
        this.setState({
            date: instDate,
            dataText: instDate.format('MM-DD')
        });
        this.showHistory(instDate);
        return true
    };

    onChange = (date) => {
        this.instValue = date;
    };

    render() {
        let {formatMessage} = this.props.intl;
        let switchText, timeText, isToday, noRecord, isNextDayClickable = false;
        let data = this.state.data;
        let histHtml = data.map((info) => {
            switchText = this.props.desc(info);

            let getTime = moment(new Date(info.occurtime.replace("_", " ").replace(/-/g, "/")));
            let localTime = this.timeToLoacl(getTime);
            timeText = localTime.format("H:mm");
            return (
                <div className={style.useList}>
                    <div><i className={classNames({ [style.light]: (info.pwr == 1) })}></i> <p></p></div>
                    <div><h4>{timeText}</h4><span>{switchText}</span></div>
                </div>
            );
        });
        let dateText = this.state.dataText;
        if (data.length == 0) {
            noRecord = true;
        }
        if (this.state.date.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
            isToday = formatMessage({id:'internal.HistoryRecord.today'});
            isNextDayClickable = false;
        } else {
            isToday = "";
            isNextDayClickable = true;
        }

        return (
            <Page saveBottom>
                <NavBar title={formatMessage({id:'internal.HistoryRecord.useHistory'})} right={[]} opacity={false} />
                <div className={style.useTop}>
                    <p className={style.prevDay} onClick={this.prevDay}><FormattedMessage id="internal.HistoryRecord.previousDay"/></p>
                    <div onClick={this.openPicker}><span>{dateText}</span> <span>{isToday} <img src={downIcon} alt="" /> </span></div>
                    <p className={style.nextDay} onClick={this.nextDay} style={{color:isNextDayClickable?'#000':'#aaa'}}><FormattedMessage id="internal.HistoryRecord.nextDay"/></p>
                </div>
                {
                    !noRecord && (<div className={style.useDetail}>
                        {histHtml}
                    </div>)
                }
                {
                    noRecord && (<div className={style.noRecord}>
                        <img src={recordIcon} alt="" />
                        <p><FormattedMessage id="internal.HistoryRecord.noUsingHistory"/></p>
                    </div>)
                }
                {this.state.showPicker &&
                    <Popup title={formatMessage({id:'internal.HistoryRecord.selectDate'})}
                           closeSelf={this.closeSelf}
                           clickaway
                           leftButton={{ text:formatMessage({id:'internal.HistoryRecord.cancel'}), onClick: this.closeSelf }}
                           rightButton={{ text: formatMessage({id:'internal.HistoryRecord.confirm'}), onClick: this.changeTime }}
                    >
                        <TimePicker type='date'
                                    defaultValue={moment(this.state.date)}
                                    dateOrder={'yymmdd'}
                                    onChange={this.onChange}/>
                    </Popup>
                }

                {this.state.loading && <Loading />}
            </Page>
        );
    };
})