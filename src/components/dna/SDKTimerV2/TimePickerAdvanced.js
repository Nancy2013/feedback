import React from 'react';
import PropTypes from 'prop-types';
import SunPicker from './SunPicker';
import sdk from 'broadlink-jssdk';
import TimePicker from '../../TimePicker';
import moment from 'moment';
import style from './SDKTimer.less';
import { injectIntl } from 'react-intl';
import connect from 'react-redux/es/connect/connect';
import { dnaSelectors } from '../../reducers';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import { loading } from '../../actions';
import {loadBMap} from "./timer-util";

const { AFTER_SUN_SET } = sdk.platformSDK.taskV2;

const TIME_TYPE = {
	REGULAR: 0,
	SUN: 1
};


const makeCancelable = (promise) => {
	let hasCanceled_ = false;
  
	const wrappedPromise = new Promise((resolve, reject) => {
		promise.then(
			val => hasCanceled_ ? reject({isCanceled: true}) : resolve(val),
			error => hasCanceled_ ? reject({isCanceled: true}) : reject(error)
		);
	});

	return {
	  	promise: wrappedPromise,
	  	cancel() {
			hasCanceled_ = true;
	  	},
	};
};

function SettingItem({ title, content, onClick }) {
	return (
		<div onClick={onClick} className={style.list}>
			<span>{title}</span>
			<p>
				<span>{content}</span>
				<i className={style.arrow} />
			</p>
		</div>
	);
}

const Tab = injectIntl(function({ intl: { formatMessage }, chooseTab, tab }) {
	const clickHandler = type => () => {
		if (tab === type) return;
		chooseTab(type);
	};
	return (
		<div className={style.tabs}>
			<p className={classNames(style.tabItem, { [style.activeTab]: tab === TIME_TYPE.REGULAR })} onClick={clickHandler(TIME_TYPE.REGULAR)}>
				{formatMessage({ id: 'internal.SDKTimerV2.regularTimer' })}
			</p>
			<p className={classNames(style.tabItem, { [style.activeTab]: tab === TIME_TYPE.SUN })} onClick={clickHandler(TIME_TYPE.SUN)}>
				{formatMessage({ id: 'internal.SDKTimerV2.sunriseAndSunset' })}
			</p>
		</div>
	);
});

let timeCache = null;

class TimePickerAdvanced extends React.PureComponent {
	static propTypes = {
		onChange: PropTypes.func,
		time: PropTypes.object,
		currentLocation: PropTypes.object,
		supportSunriseAndSunset: PropTypes.bool
	};

	constructor(props) {
		super(props);
		this.state = {
			tab: TIME_TYPE.REGULAR,
			locationName: '',
			regularTime: null,
			sunTime: null
		};

		let _time = (props.history.action === "POP" && props.isCycle) ? (timeCache.tab === TIME_TYPE.SUN ? timeCache.sunTime : timeCache.regularTime) : props.time

		if (props.supportSunriseAndSunset) {
			this.state.tab = _time.sun ? TIME_TYPE.SUN : TIME_TYPE.REGULAR;
			const { sun = AFTER_SUN_SET, duration = moment.duration(), moment: momentObj } = _time;
			this.state.sunTime = {
				sun,
				duration,
				moment: momentObj
			};
			// this.geocoder = new window.BMap.Geocoder();
		}
		this.state.regularTime = _time.sun ? ((props.history.action === "POP" && props.isCycle) ? timeCache.regularTime : moment()) : _time;
	}

	componentDidMount() {
		if (this.props.supportSunriseAndSunset) {
			this.setLocationName(this.props.currentLocation.longitude, this.props.currentLocation.latitude);
		}
	}

	componentDidUpdate(preProps) {
		if (this.props.supportSunriseAndSunset) {
			let oldLocation = preProps.currentLocation;
			let newLocation = this.props.currentLocation;
			if (oldLocation.longitude !== newLocation.longitude || oldLocation.latitude !== newLocation.latitude) {
				this.setLocationName(newLocation.longitude, newLocation.latitude);
			}
		}
	}

	componentWillUnmount() {
		this.getLocationPromise && this.getLocationPromise.cancel()
	}

	getLocationName = (lnglat) => {

        loadBMap.then(BMap =>{
            return new Promise((res, rej) => {
                BMap.Geocoder().getLocation(lnglat, function(result) {
                    if (result) {
                        // result为对应的地理位置详细信息
                        console.log('geocoder.getAddress', result);
                        const locationName = `${result.addressComponents.province} ${result.addressComponents.city}`;
                        res(locationName)
                    }
                });
            })
		})
	};

	setLocationName = (longitude, latitude) => {
        // eslint-disable-next-line
		if (longitude == undefined || latitude == undefined) {
			this.setState({
				locationName: this.props.intl.formatMessage({id: 'internal.SDKTimerV2.pleaseChoose'})
			});
		} else {
            loadBMap.then(BMap => {
                var lnglat = new BMap.Point(longitude, latitude);
                this.getLocationPromise = makeCancelable(this.getLocationName(lnglat))
                this.getLocationPromise.promise.then(locationName => {
                    this.setState({
                        locationName
                    });
                }).catch(e => {
                    console.error('百度api获取地址名称',e)
                })
			});

		}
	};

	timeUpdate = (...args) => {
		const { onChange } = this.props;
		if (args.length === 1) {
			//  常规时间格式
			let [date] = args;
			date = moment(date);
			const time = moment({ hour: date.hour(), minute: date.minute() });
			this.setState({
				regularTime: { moment: time }
			});
			onChange({ moment: time });
		} else {
			// 日出日落
			const [sun = AFTER_SUN_SET, duration = moment.duration()] = args; // 默认 日落时
			const time = {
				sun,
				duration,
			};
			this.setState({
				sunTime: time
			});
			onChange(time);
		}
	};

	chooseTimeType = type => {
		if (type === TIME_TYPE.SUN) {
			this.timeUpdate(this.state.sunTime.sun, this.state.sunTime.duration, this.state.sunTime.moment);
		} else {
			this.timeUpdate(this.state.regularTime.moment);
		}
		this.setState({
			tab: type
		});
	};

	goToSelectRegion = () => {
		const {tab, regularTime, sunTime} = this.state
		timeCache = {
			tab,
			sunTime,
			regularTime
		}
		this.props.history.push('/timer/region')
	}

	render() {
		const { supportSunriseAndSunset, min, max, intl: { formatMessage } } = this.props;
		return (
			<div>
				{supportSunriseAndSunset && <Tab chooseTab={this.chooseTimeType} tab={this.state.tab} />}
				{this.state.tab === TIME_TYPE.REGULAR ? (
					<TimePicker min={min} max={max} onChange={this.timeUpdate} defaultValue={this.state.regularTime.moment || moment().add(1, 'minutes')} />
				) : (
					[
						<div key='locationCity' className={style.listBox + ' ' + style.mt20 + ' ' + style.mb20}>
							<SettingItem title={formatMessage({ id: 'internal.SDKTimerV2.locationCity' })} content={this.state.locationName} onClick={this.goToSelectRegion} />
						</div>,
						<SunPicker key={!!this.props.currentLocation.table} min={min} max={max} onChange={this.timeUpdate} defaultValue={[this.state.sunTime.sun, this.state.sunTime.duration]} />
					]
				)}
			</div>
		);
	}
}

export default withRouter(
	injectIntl(
		connect(
			(state, ownProps) => {
				return {
					currentLocation: dnaSelectors.timerSelectors.getCurrentLocation(state),
				};
			},
			{ loading }
		)(TimePickerAdvanced)
	)
);
