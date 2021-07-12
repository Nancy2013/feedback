import React from 'react'
import BS from 'better-scroll'
import NavBar from '../NavBar';
import Page from '../Page';
import sdk from 'broadlink-jssdk'
import {inject} from "../../injector";
import {injectIntl} from 'react-intl'
import moment from 'moment'
import style from './HistoryRecord.less'
import PropType from 'prop-types'

const FORMAT = 'YYYY-MM-DD_HH:mm:ss'
const PULL_DOWN_THRESHOLD = 50
const PULL_DOWN_STOP = 40

export default inject()(injectIntl(class extends React.PureComponent{
    static propTypes = {
        // offset: PropType.number,
        step: PropType.number,  // 每次查询记录条数
        params: PropType.array,   // 查询的设备参数
        desc: PropType.func,    // 记录描述
        filter: PropType.func   // 记录筛选
    };

    static defaultProps = {
        step: 20,
        filter: () => true
    }

    state = {
        list: [],               // 历史记录
        elStyle: {},            // wrapper style
        contentStyle: {},       // content style
        offset: 0,              // 当前历史记录下标
        pullDownState: 0,       // 下拉刷新状态 0：下拉刷新； 1：释放立即刷新； 2：正在刷新； 3：刷新完成； 4：刷新失败
        pullUpState: 0,         // 上拉加载状态 0：上拉加载； 1：正在加载; 2: 加载失败
        isFull: false           // 数据是否已经查完
    }
    el = React.createRef();
    contentEl = React.createRef();
    pullDownTextArray = [
        this.props.intl.formatMessage({id: 'internal.HistoryRecordV2.pullDownToRefresh'}),
        this.props.intl.formatMessage({id: 'internal.HistoryRecordV2.releaseToRefresh'}),
        this.props.intl.formatMessage({id: 'internal.HistoryRecordV2.refreshing'}),
        this.props.intl.formatMessage({id: 'internal.HistoryRecordV2.refreshCompleted'}),
        this.props.intl.formatMessage({id: 'internal.HistoryRecordV2.refreshFailed'}),
    ];
    pullUpTextArray = [
        this.props.intl.formatMessage({id: 'internal.HistoryRecordV2.pullUpToLoad'}),
        this.props.intl.formatMessage({id: 'internal.HistoryRecordV2.loading'}),
        this.props.intl.formatMessage({id: 'internal.HistoryRecordV2.loadFailed'}),
    ];

    componentDidMount() { 
        this.initWrapper()
    }

    initWrapper = () => {
        const domElHeight = document.documentElement.clientHeight
        const navBarHeight = this.el.current.getBoundingClientRect().top
        this.contentEl.current.style.minHeight = domElHeight - navBarHeight + 3 + 'px'
        this.setState({
            elStyle: {
                marginTop: navBarHeight + 'px',
                position: 'absolute',
                top: '0',
                height: domElHeight - navBarHeight + 'px',
                width: '100%',
                boxSizing: 'border-box',
                overflow: 'hidden'
            }
        }, () => {
            this.getHistoryRecord(0).then((newRecords) => {
                if (newRecords.length > 0) {
                    this.setState({
                        list: newRecords
                    }, () => {
                        this.initScroll()
                    })
                }
            })
        })
    }

    initScroll = () => {
        this.scroll = new BS(this.el.current, {
            pullDownRefresh: {
                threshold: PULL_DOWN_THRESHOLD,
                stop: PULL_DOWN_STOP
            },
            pullUpLoad:true,
            scrollbar: true,
        })
        this.scroll.on('pullingUp', () => { // 上拉加载
            this.onPullingUp();
        })
        this.scroll.on('pullingDown', () => {
            this.onPullingDown();
        })
        this.scroll.on('scroll', (pos) => {
            if (pos.y <= 0 && this.state.pullDownState != 0) {
                this.setState({
                    pullDownState: 0
                })
            }
            if (pos.y > 0) {
                if (this.state.pullDownState !== 3 && this.state.pullDownState != 2) {
                    this.setState({
                        pullDownState: pos.y > 50 ? 1 : 0
                    })
                }
            }
        })
    }

    onPullingDown = () => {
        this.setState({
            pullDownState: 2
        })
        this.getHistoryRecord(0).then((newRecords) => {
            if (newRecords.length > 0) {
                this.setState({
                    list: newRecords,
                    isFull: false
                })
            }
            this.setState({
                pullDownState: 3
            });
            setTimeout(() => {
                // this.scroll.refresh()
                this.scroll.finishPullDown()
            },1000);
        }).catch(e => { // 刷新失败
            this.setState({
                pullDownState: 4
            });
            setTimeout(() => {
                // this.scroll.refresh()
                this.scroll.finishPullDown()
            },1000);
        })
    }

    onPullingUp = () => {
        this.setState({
            pullUpState: 1
        });
        this.getHistoryRecord(1).then((newRecords) => {
            if (newRecords.length > 0) {
                this.setState({
                    list: [
                            ...this.state.list,
                            ...newRecords
                        ],
                        isFull: false
                }, () => {
                    this.scroll.refresh()
                });
            } else {
                this.setState({
                    isFull: true
                });
            }
            this.setState({
                pullUpState: 0
            });
            this.scroll.finishPullUp();
        }).catch(e => { //  加载失败
            this.setState({
                pullUpState: 2
            });
            this.scroll.finishPullUp();
        })
    }

    getHistoryRecord = (type) => {  // type: 0 => pulldown refresh, 1 => pullup load
        const {params, step} = this.props;
        return this.queryHistoryRecord(params, type === 1 ? this.state.offset : 0, step).then(data => {
            console.debug('queryHistoryRecord', data);
            if (data && data.status == 0) {
                if (data.table.length != 0 && data.table[0].cnt != 0) {
                    this.setState({
                        offset: type === 1 ? (this.state.offset + data.table[0].cnt) : data.table[0].cnt  // 1 查询成功offset加一步
                    })
                    let newRecords = []
                    data.table[0].values.forEach(item => {// 该时段无历史记录，values为null
                        newRecords.push({
                            ...item,
                            occurtime: moment(item.occurtime, FORMAT)
                        })
                    })
                    return newRecords;
                } else {
                    return []
                }
            } else {
                throw new Error('query failed.');
            }
        })
    }

    queryHistoryRecord = (params, offset, step) => {  // 云端历史记录接口
        return sdk.platformSDK.getDevice().then(dev => {
            const httpBody = {
                device: [
                    {
                        did: dev.subDeviceID,
                        params,
                        offset,
                        step,
                        sortk: '-occurtime',
                    }
                ],
                report: 'fw_snapshot_v1'
            }
            return sdk.platformSDK.callNative('cloudServices', [{
                method: 'post',
                serviceName:'dataservice', 
                interfaceName:"v1/device/status",
                httpBody:JSON.stringify(httpBody)
            }])
        }) 
    }

    formatDate = (time) => {
        let date = time instanceof Date ? time : new Date(parseInt(time));
        return this.props.intl.formatDate(date, {month: 'short', day: 'numeric', weekday: 'long'});
    }

    render() {
        const {pullUpState, pullDownState, isFull} = this.state;
        const {filter, desc, intl:{formatMessage}} = this.props;
        let listObj = {};   // {[UTC_millseconds]: [{pwr: 1}, ...]}
        if (this.state.list) {
            this.state.list.forEach(item => {
                if (filter(item)) {
                    const occurtime = item.occurtime.clone().startOf('day');
                    const time = occurtime.toDate().getTime();
                    if (time in listObj) {
                        listObj[time].push(item);
                    } else {
                        listObj[time] = [item];
                    }
                }
            })
        }
        const pullDownText = this.pullDownTextArray[pullDownState];
        const pullUpText = (pullUpState !== 1 && isFull) ? formatMessage({id: 'internal.HistoryRecordV2.noRecords'}) : this.pullUpTextArray[pullUpState];
        return (
            <Page>
                <NavBar title={formatMessage({id: 'internal.HistoryRecordV2.historyRecord'})} right={[]}></NavBar>
                <div className={style.wrapper} ref={this.el} style={this.state.elStyle}>
                    <ul ref={this.contentEl} className={style.content}>
                        <div className={style.pullDownText}>{pullDownText}</div>
                        {
                            Object.keys(listObj).map(time => (
                                <div key={time} className={style.formatContainer}>
                                    <h2 className={style.format1}>{this.formatDate(time)}</h2>
                                    {
                                        listObj[time].map((item, index) => {
                                            return (
                                                <li key={index}>{item.occurtime.format('HH:mm')} {desc(item)}</li>
                                            )
                                        })
                                    }
                                </div>
                            ))
                        }
                        <div className={style.loading}>{pullUpText}</div>
                    </ul>
                </div>
            </Page>
        )
    }
}))