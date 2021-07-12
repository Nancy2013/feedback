import Scroller from '../../Scroller';
import React from 'react';
import PropTypes from 'prop-types';
import sdk from 'broadlink-jssdk';
import moment from 'moment';
import {fixSunMoment, calDelta, clacTable} from './timer-util';
import { injectIntl } from 'react-intl';
import connect from 'react-redux/es/connect/connect';
import { dnaSelectors } from '../../reducers';

const { AFTER_SUN_SET } = sdk.platformSDK.taskV2;
const SUNRISE = 'U';
const SUNSET = 'D';

const tempArr = [...new Array(12)].map((item, index) => 5 * (index + 1));
const reverseArr = [...new Array(12)].map((item, index) => -5 * (index + 1)).reverse();
const timeArr = [...reverseArr, 0, ...tempArr];

function formatDefaultValue([sun = AFTER_SUN_SET, duration = moment.duration()] = []) {
	// ['U+', duration] => ['U', +duration.minutes]
	const [sunKey, sunSym] = sun.split('');
	return [sunKey, parseInt(sunSym + duration.asMinutes())];
}

export default connect(state => {
	return {
		table: clacTable(dnaSelectors.timerSelectors.getCurrentLocation(state))
	};
})(
	injectIntl(
		class extends React.PureComponent {
			static propTypes = {
				onChange: PropTypes.func,
				defaultValue: PropTypes.array,
				table: PropTypes.array
			};

			constructor(props) {
				super(props);
				this.initScroll();
			}

			initScroll = () => {
				const {
					intl: { formatMessage }
				} = this.props;

				this.wheels = [
					[
						{
							values: [formatMessage({ id: 'internal.SDKTimerV2.sunrise' }), formatMessage({ id: 'internal.SDKTimerV2.sunset' })],
							keys: [SUNRISE, SUNSET],
							label: ''
						},
						{
							values: timeArr.map(item => formatMessage({ id: 'internal.SDKTimerV2.deltaTime' }, { delta: calDelta(item), time: Math.abs(item) })),
							keys: [...reverseArr, 0, ...tempArr],
							label: ''
						}
					]
				];
				/* 
				1. 先计算出可选的日出日落和duration选项 validSun
				2. 根据validSun和props.defaultValue计算出一个valid的defaultValue
				3. 每次滑动判断哪些选项不可选， 不可选去除dw-v， 可选加上dw-v
				*/
				if (this.props.table) {
					this.invalid = this.formatInvalid(this.props.min, this.props.max); // [{start, end}, ...]
					this.validSun = this.calcValidMoment(this.invalid); // {U:[{durationNum, enable, moment}...], D:[{}]}
					this.defaultValue = this.calcDefaultValue(this.props.defaultValue); // 计算默认时间
					this.validate = (html, index, time, direction, inst) => {
						// scroll组件的validate配置项，用来配置不可选选项
                        // eslint-disable-next-line
						if (document.getElementsByClassName('dw-ul')[0] == undefined) return;
	
						const nowSun = inst.temp[0];
						const nowDuration = inst.temp[1];
						const sunListEl = [...document.getElementsByClassName('dw-ul')[0].getElementsByClassName('dw-li')];
						const durtionListEl = [...document.getElementsByClassName('dw-ul')[1].getElementsByClassName('dw-li')];
	
						this.validSun[nowSun].forEach((item, index) => {
							// sun固定， 判断 哪些duration不可选
							if (item.enable === false) {
								durtionListEl[index].classList.remove('dw-v');
							} else {
								durtionListEl[index].classList.add('dw-v');
							}
						});
	
						if (nowSun === SUNRISE) {
							// duration 固定， 判断另一个sun是否可选
							this.validSun[SUNSET].forEach(item => {
								if (item.durationNum === nowDuration) {
									if (item.enable === false) {
										sunListEl[1].classList.remove('dw-v');
									} else {
										sunListEl[1].classList.add('dw-v');
									}
								}
							});
						}
	
						if (nowSun === SUNSET) {
							this.validSun[SUNRISE].forEach(item => {
								if (item.durationNum === nowDuration) {
									if (item.enable === false) {
										sunListEl[0].classList.remove('dw-v');
									} else {
										sunListEl[0].classList.add('dw-v');
									}
								}
							});
						}
					};
				}
			};

			formatInvalid = (min, max) => {
				//获得无效时间段
				let invalid = [];

				min = min || moment().startOf('day');
				max = max || moment().endOf('day');

				if (min.isBefore(moment().endOf('day')) || (min.isAfter(moment().endOf('day')) && max.isAfter(moment().endOf('day')))) {
					invalid.push({
						start: max,
						end: min
					});
				} else {
					if (moment().startOf('day').isBefore(min)) {
						//判断最小值是否小于最小时间点，
						invalid.push({
							start: moment().startOf('day'),
							end: min
						});
					}
					if (max.isBefore(moment().endOf('day'))) {
						//判断最大值是否大于最大时间点，
						invalid.push({
							start: max,
							end: moment().endOf('day')
						});
					}
				}

				invalid.forEach(inv => {
					inv.start.set('date', moment().get('date'));
					inv.end.set('date', moment().get('date'));
				});

				return invalid;
			};

			enhanceItem = (index, moment) => {
				console.log()
				return {
					durationNum: index,
					moment: moment.clone().add(index, 'minutes'),
					enable: true
				};
			};

			calcValidMoment = invalid => {
				// return {U: [{durationNum, moment, enable}]}
				const sunriseMoment = fixSunMoment(this.props.table, { sun: 'U+', duration: moment.duration() });
				const sunsetMoment = fixSunMoment(this.props.table, { sun: 'D+', duration: moment.duration() });
				const riseRange = timeArr.map(item => this.enhanceItem(item, sunriseMoment)); // [日出前60分钟，..., 0, 日出后60分钟]
				const setRange = timeArr.map(item => this.enhanceItem(item, sunsetMoment));

				invalid.forEach(({ start, end }) => {
					riseRange.forEach(item => {
						if (!item.moment.isBefore(start) && !item.moment.isAfter(end)) {
							item.enable = false;
						}
					});
					setRange.forEach(item => {
						if (!item.moment.isBefore(start) && !item.moment.isAfter(end)) {
							item.enable = false;
						}
					});
				});
				return {
					[SUNRISE]: riseRange,
					[SUNSET]: setRange
				};
			};

			calcDefaultValue = value => {
				let defaultValue = formatDefaultValue(value);
				const [sun, duration] = defaultValue;
				let isDefaultValueValid = false;
				this.validSun[sun.split('')[0]].forEach(item => {
					if (item.durationNum === duration && item.enable === true) {
						// 判断props.defaultValue是不是有效的
						isDefaultValueValid = true;
					}
				});
				if (!isDefaultValueValid) {
					try {
						// 选第一个可选时间
						Object.keys(this.validSun).forEach(sun => {
							this.validSun[sun].forEach(item => {
								if (item.enable === true) {
									defaultValue = [sun, item.durationNum];
                                    // eslint-disable-next-line
									throw '';
								}
							});
						});
					} catch (e) {}
				}
				return defaultValue;
			};

			onChange = vals => {
				// [u/d, 60]
				let valArr = vals.split(' ');
				let sun = valArr[0] + (calDelta(valArr[1]) <= 0 ? '-' : '+');
				let duration = moment.duration(Math.abs(valArr[1]), 'minutes');
				this.props.onChange(sun, duration);
			};

			render() {
				const _defaultValue = this.defaultValue || [this.props.defaultValue[0].split('')[0], this.props.defaultValue[1]];
				return <Scroller defaultValue={_defaultValue} showLabel={false} wheels={this.wheels} showScrollArrows onChange={this.onChange} validate={this.validate} />;
			}
		}
	)
);
