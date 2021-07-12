import React from 'react';
import PropTypes from 'prop-types';
import Page from '../Page';
import style from './SDKTimer.less';
import NavBar from '../NavBar';
import { injectIntl } from 'react-intl';
import connect from 'react-redux/es/connect/connect';
import { configureSun } from '../../actions/timer';
import { loading } from '../../actions';
import { dnaSelectors } from '../../reducers';
import {loadBMap} from "./timer-util";

const ZOOM_LEVEL = 12;
const THEME_COLOR = process.env.THEME_COLOR;

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

function PointSvg() {
	return (
		<svg width="24px" height="36px" viewBox="0 0 24 36" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<title>icon_locatin@2x</title>
			<desc>Created with Sketch.</desc>
			<defs></defs>
			<g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
				<g id="a24-选择地区" transform="translate(-176.000000, -262.000000)">
					<g id="Group" transform="translate(176.000000, 262.000000)">
						<circle id="Oval-2" stroke={THEME_COLOR} strokeWidth="8" fill="#FFFFFF" fillRule="nonzero" cx="12" cy="12" r="8"></circle>
						<rect id="Rectangle-2" fill={THEME_COLOR} x="11" y="20" width="2" height="16"></rect>
					</g>
				</g>
			</g>
		</svg>
	)
}
function BackSvg() {
	return (
		<svg width="46px" height="46px" viewBox="0 0 46 46" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<title>icon_back_location@2x</title>
			<desc>Created with Sketch.</desc>
			<defs>
				<circle id="path-1" cx="23" cy="23" r="17"></circle>
				<filter x="-26.5%" y="-26.5%" width="152.9%" height="152.9%" filterUnits="objectBoundingBox" id="filter-2">
					<feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
					<feGaussianBlur stdDeviation="3" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
					<feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.1 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
				</filter>
			</defs>
			<g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
				<g id="a24-选择地区" transform="translate(-320.000000, -432.000000)">
					<g id="Group-2" transform="translate(320.000000, 432.000000)">
						<g id="Oval-3">
							<circle fill="black" fillOpacity="1" filter="url(#filter-2)" cx="23" cy="23" r="17"></circle>
							<circle fill="#FFFFFF" fillRule="evenodd" cx="23" cy="23" r="17"></circle>
						</g>
						<path d="M22.267272,31.7699291 C17.9916021,31.4174888 14.5825112,28.0083979 14.2300709,23.732728 C14.2200972,23.7331303 14.2100723,23.7333333 14.2,23.7333333 L12.7333333,23.7333333 C12.3283245,23.7333333 12,23.4050088 12,23 C12,22.5949912 12.3283245,22.2666667 12.7333333,22.2666667 L14.2,22.2666667 C14.2100723,22.2666667 14.2200972,22.2668697 14.2300709,22.267272 C14.5825112,17.9916021 17.9916021,14.5825112 22.267272,14.2300709 C22.2668697,14.2200972 22.2666667,14.2100723 22.2666667,14.2 L22.2666667,12.7333333 C22.2666667,12.3283245 22.5949912,12 23,12 C23.4050088,12 23.7333333,12.3283245 23.7333333,12.7333333 L23.7333333,14.2 C23.7333333,14.2100723 23.7331303,14.2200972 23.732728,14.2300709 C28.0083979,14.5825112 31.4174888,17.9916021 31.7699291,22.267272 C31.7799028,22.2668697 31.7899277,22.2666667 31.8,22.2666667 L33.2666667,22.2666667 C33.6716755,22.2666667 34,22.5949912 34,23 C34,23.4050088 33.6716755,23.7333333 33.2666667,23.7333333 L31.8,23.7333333 C31.7899277,23.7333333 31.7799028,23.7331303 31.7699291,23.732728 C31.4174888,28.0083979 28.0083979,31.4174888 23.732728,31.7699291 C23.7331303,31.7799028 23.7333333,31.7899277 23.7333333,31.8 L23.7333333,33.2666667 C23.7333333,33.6716755 23.4050088,34 23,34 C22.5949912,34 22.2666667,33.6716755 22.2666667,33.2666667 L22.2666667,31.8 C22.2666667,31.7899277 22.2668697,31.7799028 22.267272,31.7699291 Z M23,30.3333333 C27.0500882,30.3333333 30.3333333,27.0500882 30.3333333,23 C30.3333333,18.9499118 27.0500882,15.6666667 23,15.6666667 C18.9499118,15.6666667 15.6666667,18.9499118 15.6666667,23 C15.6666667,27.0500882 18.9499118,30.3333333 23,30.3333333 Z M23,27.4 C20.5699471,27.4 18.6,25.4300529 18.6,23 C18.6,20.5699471 20.5699471,18.6 23,18.6 C25.4300529,18.6 27.4,20.5699471 27.4,23 C27.4,25.4300529 25.4300529,27.4 23,27.4 Z M23,25.9333333 C24.6200353,25.9333333 25.9333333,24.6200353 25.9333333,23 C25.9333333,21.3799647 24.6200353,20.0666667 23,20.0666667 C21.3799647,20.0666667 20.0666667,21.3799647 20.0666667,23 C20.0666667,24.6200353 21.3799647,25.9333333 23,25.9333333 Z" id="Combined-Shape" fill={THEME_COLOR} fillRule="nonzero"></path>
					</g>
				</g>
			</g>
		</svg>
	)
}

class SelectRegion extends React.PureComponent {
	static propTypes = {
		currentLocation: PropTypes.object 
	};

	static defaultProps = {};

	constructor(props) {
		super(props);
		this.mapContainer = React.createRef();
		this.state = {
			locationName: props.intl.formatMessage({id: 'internal.SDKTimerV2.unKnownCity'}),
			location: null
		};
	}

	componentDidMount() {
		this.initMap();
	}

	componentWillUnmount() {
		this.getLocationPromise && this.getLocationPromise.cancel();
	}

	initMap = () => {
        loadBMap().then(BMap =>{
            this.geocoder = new BMap.Geocoder();
            this.map = new BMap.Map('container');
            const { longitude, latitude } = this.props.currentLocation;
            if (longitude && latitude) {	// 有当前定位则使用当前定位
                const centerPoint = new BMap.Point(longitude, latitude);
                this.map.centerAndZoom(centerPoint, ZOOM_LEVEL);
                this.setLocation(centerPoint);
                this.originPoint = centerPoint;
            } else {	// 没有当前定位则使用百度地图ip定位
                this.props.loading(true);
                new BMap.LocalCity().get(result => {
                    if (!this.props.currentLocation.longitude || !this.props.currentLocation.latitude) {
                        this.props.loading(false);
                        this.setLocation(result.center);
                        this.map.centerAndZoom(result.center, ZOOM_LEVEL);
                        this.originPoint = result.center;
                    }
                });
            }

            function throttle(method, context, ...args) {
                clearTimeout(method.tId);
                method.tId = setTimeout(function() {
                    method.apply(context, args);
                }, 100);
            }

            this.map.addEventListener('moveend', () => {
                throttle(this.setLocation, this, this.map.getCenter());
            });
		});

	};

	getLocation = (point) => { 
		return new Promise((res, rej) => {
			this.geocoder.getLocation(point, result => {
				if (result) {
					// result为对应的地理位置详细信息
					const locationName = `${result.addressComponents.province} ${result.addressComponents.city}`;
					res(locationName)
				}
			});
		})
	}

	setLocation = centerPoint => {
		this.getLocationPromise = makeCancelable(this.getLocation(centerPoint));
		this.getLocationPromise.promise.then(locationName => {
			this.setState({
				locationName,
				location: {
					longitude: centerPoint.lng,
					latitude: centerPoint.lat
				}
			});
		}).catch(e => {
			console.error('set location failed.',e)
		})
	};

	resetOriginPoint = () => {
		if (this.originPoint) {
			this.map.panTo(this.originPoint);
		}
	};

	confirm = () => {
		const { longitude, latitude } = this.state.location;
		this.props.configureSun(
			{
				longitude,
				latitude,
			},
			() => {
				this.props.history.go(-1);
			}
		);
	};

	render() {
		const {intl: { formatMessage }} = this.props;
		return (
			<Page className={style.mapPage}>
				<NavBar title={formatMessage({id: 'internal.SDKTimerV2.chooseCity'})} right={[]} />
				<div className={style.section}>
					<div className={style.wrapper}>
						<div id="container" className={style.container} ref={this.MapContainer} />
						<div className={style.positionPicker}>
							<PointSvg />
						</div>
					</div>
				</div>
				<div className={style.regionControlPanel}>
					<p className={style.regionLocation}>{formatMessage({id: 'internal.SDKTimerV2.locationCity'})}</p>
					<p className={style.regionLocationName}>{this.state.locationName}</p>
					<div className={style.regionConfirm} onClick={this.confirm}>
						{formatMessage({id: 'internal.SDKTimerV2.confirmConfigLocation'})}
					</div>
					<div className={style.resetPoint} onClick={this.resetOriginPoint}>
						<BackSvg />
					</div>
				</div>
			</Page>
		);
	}
}

export default injectIntl(
	connect(
		(state) => {
			return {
				currentLocation: dnaSelectors.timerSelectors.getCurrentLocation(state),
			};
		},
		{ loading, configureSun }
	)(SelectRegion)
);
