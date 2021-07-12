/**
 * Created by Administrator on 2018/4/10 0010.
 */
import React from 'react';
import Highcharts from 'highcharts';
import $ from 'jquery';
import NavBar from "../../NavBar";
import sdk from 'broadlink-jssdk';
import Page from '../../Page';
import Loading from '../../../ActivityIndicator';
import moment from 'moment'
import Toast from "../../Toast"
import {formatNum} from '../../utils'
import {ratio,isIOS} from '../../device'
import style from './style.less';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

const themeColor=THEME_COLOR;
let chart;
const HOUR_LEN=6,CAHRT_LEN=7;   //默认时间长度

const {xAxisY=20,lineHeight=20,tipPadding=10}=(()=>{
    if(isIOS){
        return {
            xAxisY:ratio*20,
            lineHeight:ratio*20,
            tipPadding:ratio*10
        }
    }else {
        return {
            xAxisY:undefined,
            lineHeight:undefined,
            tipPadding:undefined
        }
    }
})()

export default injectIntl(class extends React.PureComponent {
    constructor(props){
        super(props)
        this.state={
            loading:true,
            timeCategories:[],
            data:[],
        }
    };
    static propTypes = {
        //负载类型
        did: PropTypes.string.isRequired
    };
    static defaultProps = {
        did: "00000000000000000000780f77314c5d"
    };
    componentWillMount() {
        this.getElectric();   //初始化
    }

    componentDidMount() {
        this.initElectric();
    }

    componentWillUnmount(){
        if(chart){
            chart.destroy ();
        }
    }

    /*
    * params:['power','time'],   //请求的参数
    * */
    makeParams=()=>{    //fw_energystats_v1  fw_energystatus_v1 fw_currentstate_v1
        const {did}=this.props;
        const {page,pageNum}=this.state
        const start=moment().clone().subtract(HOUR_LEN,'hours').format('YYYY-MM-DD_HH:mm:ss');
        const end=moment().format('YYYY-MM-DD_HH:mm:ss');
        this.formatXLabel
        const params={
            report:'fw_energystatus_v1', //数据粒度为小时,current:当前电流, power:当前功率, totalconsum:总功耗
            device:[
                {
                    did:did,
                    start:start,   //开始时间YYYY-MM-DD_HH:MM:SS
                    end:end,     //结束时间YYYY-MM-DD_HH:MM:SS
                    sortk:"-occurtime",	//倒序返回最新数据
                }
            ],
        }
        const postParams={  //请求cloudServices参数 stats
            "method": "post",
            "interfaceName": 'v1/device/status',
            "serviceName": "dataservice",
            'httpBody': JSON.stringify(params)
        }
        console.log("******postParams******");
        console.log(JSON.stringify(postParams))
        return [postParams];
    }

    getElectric = ()=> {    //外网
        const {formatMessage} = this.props.intl
        sdk.platformSDK.callNative('cloudServices',this.makeParams()).then(result=>{
            console.log("******getElectric*******");
            console.log(result);
            if(result){
                if(result.status===0){
                    if(result.table&&result.table[0].values){
                        this.setState({
                            timeCategories:this.formatData(result.table[0].values).time,
                            data:this.formatData(result.table[0].values,'power').data,

                        },()=>{
                            this.initElectric();
                        })
                    }else {
                        Toast.info(formatMessage({id:'internal.PowerStatistics.emptyData'}));
                    }

                }else {
                    Toast.info(result.msg);
                }
            }else {
                Toast.info(formatMessage({id:'internal.PowerStatistics.requestError'}));
            }
            this.setState({
                loading:false
            });
        });
    }

    initElectric=()=>{  //初始化图表
        let that=this;
        const{timeCategories,data}=this.state;
        const options={
            chart: {
                panning: true,
                pinchType: 'x',
                resetZoomButton: {
                    position: {
                        y: -1000
                    }
                },
                backgroundColor:themeColor
            },
            credits:{
                enabled:false
            },
            title: {
                text: '功率统计',
                style:{
                    visibility:'hidden'
                }
            },
            xAxis: [{
                categories:timeCategories,
                labels:{
                    style:{
                        fontSize:0.3466666666666667+'rem',
                        color:'#fff',
                        background:'#fff'
                    },
                    formatter:function(){
                        return that.formatXLabel(this.value)
                    },
                    step:6,
                    y:xAxisY,
                },
                tickWidth:0,
                lineColor:themeColor,
                crosshair: {
                    width: 1,
                    color: '#fff',
                    dashStyle: 'ShortDash'
                }
            }],
            yAxis: [{ // Primary yAxis
                labels: {
                    enabled:true,
                    style:{
                        color:'#fff',
                        fontSize:0.3466666666666667+'rem',
                    }
                },
                title: {
                    enabled:false
                },
                crosshair:false,
                gridLineColor:'#fff',
                gridLineDashStyle:'Dot'

            },
                { // Secondary yAxis
                    title: {
                        enabled:false
                    },
                    labels: {
                        enabled:false
                    },
                    opposite: true,
                    gridLineColor:'#fff',
                    gridLineDashStyle:'Dot'
                }],
            tooltip: {
                padding:tipPadding,
                style:{
                    color:themeColor,
                    fontSize:0.3466666666666667+'rem',
                    lineHeight:lineHeight+'rem',
                },
                shared: true,
                followTouchMove: false,
                formatter:function(){
                    return that.formatTooltip(this);
                }
            },
            legend: {
                enabled:false
            },
            series: [{
                name: '功率',
                type: 'areaspline',
                data:data,
                tooltip: {
                    valueSuffix: 'w'
                },
                fillColor:'rgba(255,255,255,0.2)',
                color:'#fff',
                marker:{
                    enabled:false
                },
                lineWidth:1
            },
            ]
        }
        chart=Highcharts.chart(this.refs.container,options, function(c) {
            // 动态改变 x 轴范围即可实现拖动
        });
    }

    formatTooltip=(tip)=>{
        const point=tip.points[0];
        const time=moment(point.x,'YYYY-MM-DD HH:mm:ss').format('HH:mm');
        return `<b style='padding-top: 15px;'>${point.series.name}: ${point.y}W</b><br/>${time}`;
    }

    formatXLabel=(label)=>{ //格式化X轴Label标签
        const formatTime=moment(label,'YYYY-MM-DD HH:mm:ss');
        const newLabel=(formatNum(formatTime.hour())+":00");
        return newLabel;
    }

    formatData=(data)=>{    //获得功率数据
        let newData={
            time:[],
            data:[]
        };
        if(data){
            data.forEach((d,i)=>{   //每10min统计一次
                if(i%2===0){
                    newData.data[newData.data.length]=d.power;
                    newData.time[newData.time.length]=d.occurtime.replace('_',' ');
                }
            });
        }
        newData={
            time:newData.time.reverse(),
            data:newData.data.reverse(),
        }
        console.log(newData);
        return newData;
    }

    render() {
        console.log("******PowerStatistics******");
        const {formatMessage} = this.props.intl
        const {loading}=this.state;
        return (
            <Page saveBottom className={style.bgColor}>
                <NavBar opacity title={formatMessage({id:'internal.PowerStatistics.powrStatistics'})} right={[]}/>
                <div className={style.pwCss}><div ref="container" className={style.container1}></div></div>
                {loading && <Loading />}
            </Page>
        );
    }
})