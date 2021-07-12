/**
 * Created by Administrator on 2018/4/10 0010.
 */
import React from 'react';
import Highcharts from 'highcharts';
import $ from 'jquery';
import sdk from 'broadlink-jssdk';
import NavBar from "../../NavBar";
import FixBottom from "../../FixBottom";
import Page from '../../Page';
import Loading from '../../../ActivityIndicator';
import Toast from "../../Toast"
import moment from 'moment'
import style from './style.less';
import {formatNum} from '../../utils'
import {ratio,isIOS} from '../../device'
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

const themeColor=THEME_COLOR;
const CAHRT_LEN=7,INIT_LEN=12,Hour_LEN=48;
let right,chart;  //native bar right button
const {xAxisY=20,lineHeight=20,maxPointWidth=60,pointWidth=25}=(()=>{
    if(isIOS){
        return {
            xAxisY:ratio*20,
            lineHeight:ratio*20,
            maxPointWidth:ratio*60,
            pointWidth:ratio*25,
        }
    }else {
        return {
            xAxisY:undefined,
            lineHeight:undefined,
            maxPointWidth:undefined,
            pointWidth:undefined,
        }
    }
})()

function UnitItem({label,state,unit,selectUnit}){
    return(
        <p className={state===unit?style.select:''}  onClick={()=>{selectUnit(unit)}}>{label}</p>
    )
}

export default injectIntl(class extends React.PureComponent {
    constructor(props){
        super(props);
        this.state={
            loading:true,
            unit:'day',   //请求数据的时间单位
            title:'',
            data:[],
            time:[],
            currentElectric:0,
            end:'',
        }
        this.supplementsLength = 0;
        this.isUpdate = true;   //判断为空时是否继续请求
        this.minLength = 0;
    };
    static propTypes = {
        //负载类型
        did: PropTypes.string.isRequired,
        history:PropTypes.object.isRequired,//react Route里的参数
        hasPowerStatistics:PropTypes.bool//是否有功率统计页面
    };
    static defaultProps = {
        did: "00000000000000000000780f77314c5d",
        hasPowerStatistics:true
    };
    componentWillMount() {
        const {unit}=this.state;
        this.addEventListener();    //给插件添加滑动监听事件
        right=this.setRight();  //avoid in render
        this.selectUnit(unit)   //初始化
    }

    componentDidMount() {}

    componentWillUnmount(){
        if(chart){
            chart.destroy ();
        }
    }

    makeParams=(start,end)=>{    //fw_energystats_v1 fw_currentstate_v1
        const {did}=this.props;

        const params={
            report:'fw_energystats_v1', //数据粒度为小时,current:当前电流, power:当前功率, totalconsum:总功耗
            device:[
                {
                    did:did,
                    start:start,   //开始时间YYYY-MM-DD_HH:MM:SS
                    end:end,     //结束时间YYYY-MM-DD_HH:MM:SS
                    sortk:"-occurtime",	//倒序返回最新数据
                    params:['totalconsum','occurtime'],   //请求的参数
                }
            ],
        }
        const postParams={  //请求cloudServices参数 stats
            "method": "post",
            "interfaceName": 'v1/device/stats',
            "serviceName": "dataservice",
            'httpBody': JSON.stringify(params)
        }
        console.log("******postParams******");
        console.log(JSON.stringify(postParams))
        return [postParams];
    }

    getTime=(flag)=>{   //获得点击按钮的时间段
        const {unit,end}=this.state;
        let startTime,endTime;
        if(flag){
            startTime=moment().clone().subtract(INIT_LEN,unit).startOf(unit).format('YYYY-MM-DD_HH:mm:ss');
            endTime=moment().format('YYYY-MM-DD_HH:mm:ss');
        }else {
            const standartEnd=moment(end.replace('_',' '),'YYYY-MM-DD HH:mm:ss');
            startTime=standartEnd.clone().subtract(CAHRT_LEN,unit).format('YYYY-MM-DD_HH:mm:ss');
            if(unit==='hour'){
                endTime=standartEnd.clone().format('YYYY-MM-DD_HH:mm:ss');    //获得前一个小时数据
                startTime=standartEnd.clone().subtract(Hour_LEN,unit).format('YYYY-MM-DD_HH:mm:ss');
            }else {
                endTime=standartEnd.clone().subtract(1,'seconds').format('YYYY-MM-DD_HH:mm:ss');    //过滤重复日期
            }
        }
        console.log(`startTime:  ${startTime}  endTime:  ${endTime}`);
        return{start:startTime,end:endTime};
    }

    newDataHandler = (data) => {
        const default_len=Math.floor(CAHRT_LEN/2);
        const data_len= Math.floor(data.time.length/2);
        if (data && data.time) {
            this.supplementsLength = data.time.length < CAHRT_LEN ? data_len : default_len
            let supplementsArr = [...new Array(this.supplementsLength)].map(()=>'')
            data.time = [...supplementsArr,...data.time,...supplementsArr]
            data.data = [...supplementsArr,...data.data,...supplementsArr] 
        }
        return data;
    }

    getElectric = (start,end,flag)=> {    //外网
        const {unit}=this.state;
        const {formatMessage} = this.props.intl
        sdk.platformSDK.callNative('cloudServices',this.makeParams(start,end)).then(result=>{
            if(result){
                if(result.status===0){
                    if(result.table&&result.table[0].values){
                        const newData=this.formatElectricData(result.table[0].values)
                        let time,data;
                        if(flag){
                            let _data = this.newDataHandler(newData)
                            time=_data.time,data=_data.data;
                        }else {
                            const addData=this.newDataHandler(this.updateData(newData));
                            time=addData.time,data=addData.data;
                        }
                        this.setState({
                            time:time,
                            data:data
                        },()=>{
                            this.updateChart(flag,newData.time.length);
                        })
                    }else {
                        if(unit!='hour'){
                            this.isUpdate = false;
                            Toast.info(formatMessage({id:'internal.ElectricStatistics.emptyData'}));
                        }

                    }
                }else {
                    Toast.info(result.msg);
                }
            }else {
                Toast.info(formatMessage({id:'internal.ElectricStatistics.requestError'}));
            }
            this.setState({
                loading:false
            });
        });
    }

    updateData=(newData)=>{ //添加数据更新点
        let {time,data}=this.state;
        if(newData){
            time = time.slice(this.supplementsLength, time.length-this.supplementsLength)
            data = data.slice(this.supplementsLength, data.length-this.supplementsLength)
            const {time:addTime,data:addData}=newData;
            addTime.reverse().forEach(t=>{
                time.unshift(t);
            });
            addData.reverse().forEach(d=>{
                data.unshift(d)
            });
        }
        console.log("*****updateData*****");
        return {time:time,data:data};
    }

    updateChart=(flag,newDataLength)=>{
        if(flag){   //初始化
            this.initElectric();
        }else { //滑动更新数据
            const {time,data}=this.state;
            this.updateElectric(time,data,newDataLength);
        }
    }

    updateElectric=(time,electric,newDataLength)=>{    //update chart data when slide  the page
        console.log("*******updateElectric******");
        chart.xAxis[0].setCategories(time,false);   //update xAxis
        chart.series[0].setData(electric, false, false);    //added data,whether to redraw,whether to delete the first
        //chart.xAxis[0].setExtremes(this.supplementsLength+newDataLength-this.minLength,3*this.supplementsLength+newDataLength-this.minLength)
        chart.xAxis[0].setExtremes(this.supplementsLength+newDataLength,3*this.supplementsLength+newDataLength)
        chart.series[0].data[2*this.supplementsLength+newDataLength].select(true,false)
        //chart.series[0].data[Math.round(2*this.supplementsLength+newDataLength-this.minLength)].select(true,false)
        chart.redraw(); //redraw chart
    }

    formatElectricData=(data)=>{
        const {unit}=this.state;
        if(unit==='hour'){  //小时
            return this.formatCurrentData(data);
        }
        if(unit==='day'){   //每天
            return this.getDayElectric(data);
        }
        if(unit==='month'){ //每月
            return this.getMonthElectric(data);
        }
    }

    getDayElectric=(data)=>{    //获得每天用电量
        let timeArray=[],newData=[];
        if(data){
            data.forEach(d=>{
                const formatTime=moment(d.occurtime,'YYYY-MM-DD_HH:mm:ss');
                const date=formatTime.format('MM-DD');
                const pos=timeArray.map(e=>{return e}).indexOf(date);
                if(pos===-1){
                    timeArray.push(date);
                    newData[newData.length]={
                        occurtime:d.occurtime,
                        totalconsum:d.totalconsum,
                        initialconsum:d.totalconsum,
                    };
                }else {
                    if(newData[pos].occurtime<d.occurtime){
                        newData[pos].occurtime=d.occurtime;
                        newData[pos].totalconsum=d.totalconsum;
                    }
                    newData[pos].initialconsum=d.totalconsum;   //取每天最早的数据
                }
            });
            return this.formatCurrentData(newData);
        }else {
            return {};
        }
    }

    getMonthElectric=(data)=>{  //每月数据
        let timeArray=[],newData=[];
        if(data){
            data.forEach(d=>{
                const formatTime=moment(d.occurtime,'YYYY-MM-DD_HH:mm:ss');
                const date=formatTime.format('YYYY-MM');

                const pos=timeArray.map(e=>{return e}).indexOf(date);
                if(pos===-1){
                    timeArray.push(date);
                    newData[newData.length]={
                        occurtime:d.occurtime,
                        totalconsum:d.totalconsum,
                    };
                }else {
                    if(newData[pos].occurtime<d.occurtime){
                        newData[pos].occurtime=d.occurtime;
                        newData[pos].totalconsum=d.totalconsum;
                    }
                    newData[pos].initialconsum=d.totalconsum;   //取每天最早的数据
                }
            });
            console.log(newData);
            return this.formatCurrentData(newData);
        }else {
            return {};
        }
    }

    formatCurrentData=(data)=>{ //生成当前数据
        const {unit}=this.state;
        let newData={
            time:[],
            data:[],
        }
        if(data){
            data.forEach((d,i)=>{
                if(unit==='day'||unit==='month'){   //每天及每月时可以显示当前数据
                    if(i===data.length-1){    //当前用电量为差值
                        d.currentConsum=data[i].totalconsum-data[i].initialconsum;
                        newData.time[i]=d.occurtime.replace('_',' ');
                        newData.data[i]=parseFloat(d.currentConsum>=0?d.currentConsum.toFixed(2):0);
                    }else {
                        d.currentConsum=data[i].totalconsum-data[i+1].totalconsum;
                        newData.time[i]=d.occurtime.replace('_',' ');
                        newData.data[i]=parseFloat(d.currentConsum>=0?d.currentConsum.toFixed(2):0);
                    }
                }else {
                    if(i>0){    //当前用电量为差值
                        d.currentConsum=data[i-1].totalconsum-data[i].totalconsum;
                        newData.time[i-1]=d.occurtime.replace('_',' ');
                        newData.data[i-1]=parseFloat(d.currentConsum>=0?d.currentConsum.toFixed(2):0);
                    }
                }
            });
        }
        newData={
            time:this.formatTime(newData.time.reverse()),
            data:newData.data.reverse(),
        }
        return newData;
    }

    formatTime=(time)=>{
        const {unit}=this.state;
        const {formatMessage} = this.props.intl
        const lang={
            currentHour:formatMessage({id:'internal.ElectricStatistics.currentHour'}),
            currentDay:formatMessage({id:'internal.ElectricStatistics.currentDay'}),
            currentMonth:formatMessage({id:'internal.ElectricStatistics.currentMonth'})
        };
        let newTime=[];
        if(time){
            time.forEach((t,i)=>{
                const formatTime=moment(t,'YYYY-MM-DD HH:mm:ss');
                if(unit==='hour') {
                    if (formatTime.format('YYYY-MM-DD HH')===moment().format('YYYY-MM-DD HH')) {
                        newTime[i] = lang.currentHour;
                    }else {
                        newTime[i]=formatNum(formatTime.hours())+':00';
                    }
                    if(i<time.length-1){
                        const next=moment(time[i+1],'YYYY-MM-DD HH:mm:ss');
                        if(next.dates()!==formatTime.dates()){
                            const month=formatTime.months()+1;
                            newTime[i]=newTime[i]+' '+formatNum(month)+'/'+formatNum(formatTime.dates());
                        }
                    }
                }
                if(unit==='day'){
                    if(formatTime.dates()===moment().dates()){
                        newTime[i]=lang.currentDay;
                    }else {
                        const month=formatTime.month()+1;
                        newTime[i]=formatNum(month)+"."+formatNum(formatTime.dates())
                    }
                    if(i<time.length-1){
                        const next=moment(time[i+1],'YYYY-MM-DD HH:mm:ss');
                        if(next.years()!==formatTime.years()){
                            newTime[i]=newTime[i]+' '+formatTime.years()
                        }
                    }
                }
                if(unit==='month'){
                    if(formatTime.months()===moment().months()){
                        newTime[i]=lang.currentMonth;
                    }else {
                        newTime[i]=formatNum(formatTime.months()+1);
                    }
                    if(i<time.length-1){
                        const next=moment(time[i+1],'YYYY-MM-DD HH:mm:ss');
                        if(next.years()!==formatTime.years()){
                            newTime[i]=newTime[i]+' '+formatTime.years()
                        }
                    }
                }
            })
        }
        return newTime;
    }

    formatXLabel=(label)=>{
        if(label){
            let newLabel;
            const {unit}=this.state;
            const formatTime=moment(label,'YYYY-MM-DD HH:mm:ss');
            if(unit==='hour'){
               newLabel=formatNum(formatTime.hours())+':00'
            }
            if(unit==='day'){
                const month=formatTime.month()+1;
                newLabel=formatNum(month)+"."+formatNum(formatTime.dates())
            }
            if(unit==='month'){
                newLabel=formatNum(formatTime.month()+1)
            }
            return newLabel;
        }
    }

    selectUnit=(unit)=>{   //切换颗粒度
        this.setState({
            loading:true,
            unit:unit,
            currentElectric:'',
            end:'',
        },()=>{
            const {start,end}=this.getTime('init');
            this.setTitleDesc();    //set top title
            this.isUpdate=true; //初始化
            if(start){
                this.setState({
                    end:start
                },()=>{
                    this.getElectric(start,end,'init');  //需要重绘
                });
            }
        });
    }

    setTitleDesc=()=>{
        const {unit}=this.state;
        const {formatMessage} = this.props.intl
        const lang={
            unitHour:formatMessage({id:'internal.ElectricStatistics.unitHour'}),
            unitMonth:formatMessage({id:'internal.ElectricStatistics.unitMonth'}),
            unitDay:formatMessage({id:'internal.ElectricStatistics.unitDay'}),
        };
        let currentUnit;
        switch (unit){
            case 'hour':
                currentUnit=lang.unitHour;
                break;
            case 'month':
                currentUnit=lang.unitMonth;
                break;
            default :
                currentUnit=lang.unitDay;
        }
        this.setState({
            title:'当' + currentUnit + '用电'
        });
    }

    setRight = ()=> {
        const {formatMessage} = this.props.intl
        const params = [
            {
                text: formatMessage({id:'internal.ElectricStatistics.powerBtn'}),
                handler: ()=>{
                    const {history} = this.props;
                    history.push('/electric/power');
                }
            }
        ];
        return params;
    }

    initElectric=()=>{  //init chart data
        const {data,time,unit}=this.state;
        const that=this;
        let options={
            chart: {
                panning: true,
                pinchType: 'x', //同zoomType，如果禁止则同时不能平移
                resetZoomButton: {
                    position: {
                        y: -1000
                    }
                },
                backgroundColor:themeColor,
                type: 'column',
                zoomType: 'none',
                scrollablePlotArea: {
                        scrollPositionX: 1
                }
            },
            credits:{
                enabled:false
            },
            title: {
                text: '',
                style:{
                    visibility:'hidden'
                }
            },
            xAxis: [{
                categories: time,
                labels:{
                    /*padding:50,*/
                    style:{
                        fontSize:0.3466666666666667+'rem',
                        color:'#fff',
                        lineHeight:lineHeight,
                        textOverflow: 'none'
                    },
                    autoRotationLimit:50,
                    y:xAxisY,
                },
                lineColor:themeColor,
                tickWidth:0,
                minRange: 1,
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
                }
            },
                { // Secondary yAxis
                    title: {
                        enabled:false
                    },
                    labels: {
                        enabled:false
                    },
                    opposite: true,
                    gridLineColor:themeColor,
                    gridLineDashStyle:'line'
                }
            ],
            tooltip: {
                enabled:false,
                shared: true,
                followTouchMove: false
            },
            legend: {
                enabled:false
            },
            series: [{
                name: '电量',
                maxPointWidth: maxPointWidth,  //最大宽度
                yAxis: 1,
                data: [...data],
                tooltip: {
                    valueSuffix: '度'
                },
                color:'rgba(255,255,255,0.2)',
                borderColor:'rgba(255,255,255,0.2)',
            }],
            plotOptions: {
                series: {
                    allowPointSelect: true,
                    states:{
                        hover:{
                            color:'#fff',
                            borderColor:'#fff'
                        },
                        select:{
                            color:'#fff',
                            borderColor:'#fff'
                        },
                    },
                    point: {
                        events: {
                            click: function () {
                                if(this.selected){  //已选中时禁止点击
                                    return false;
                                }else {
                                    that.clickElectric(this.index,this.y);
                                }
                            },
                        }
                    },
                    selected:true,
                    turboThreshold:0, //不限制数据点个数,默认1000
                    pointWidth: pointWidth,
                }
            },
        }
        chart=Highcharts.chart(this.refs.container,options, function(c) {
            // 动态改变 x 轴范围即可实现拖动
            let i =  time.length-1-that.supplementsLength;
            if(time.length>CAHRT_LEN && c.series){
                c.xAxis[0].setExtremes(time.length-CAHRT_LEN, time.length-1);
            } else if (time.length&&c.series){
                c.xAxis[0].setExtremes(time.length-1-2*that.supplementsLength,time.length-1);
            }
            c.series[0].data[i].select(true,false);
            that.getCurrentElectirc(c.series[0].data[i].y);
        });
    }

    addEventListener=()=>{
        const that=this;

        Highcharts.Chart.prototype.callbacks.push(function (chart) {
            Highcharts.addEvent(chart.xAxis[0], 'afterSetExtremes', function (e) {
                const currentPath=that.props.location.pathname;
                if(currentPath==='/electric'){
                    console.log(e,'Set extremes to ' + e.min + ', ' + e.max);
                    if (e.trigger === 'zoom') {
                        let i = Math.round((e.max-e.min)/2+e.min)
                        chart.series[0].data[i].select(true,false);
                        that.getCurrentElectirc(chart.series[0].data[i].y)
                    }

                    if(that.isUpdate&&e.min<=that.supplementsLength){  //滑动到最左端
                        const {start,end}=that.getTime();
                        that.setState({
                            end:start,
                            loading:true
                        });
                        that.getElectric(start,end);
                        //that.minLength = that.supplementsLength-e.min
                    }
                }
            });
        });
    }

    clickElectric=(index,value)=>{
        chart.xAxis[0].setExtremes(index-this.supplementsLength, index+this.supplementsLength);
        this.getCurrentElectirc(value);
    }

    getCurrentElectirc=(current)=>{
        this.setState({
            currentElectric:current
        });
    }

    render() {
        console.log("******ElectricStatistics******");
        const {hasPowerStatistics}=this.props
        const {loading,title,unit,currentElectric}=this.state;
        const {formatMessage} = this.props.intl
        return (
            <Page saveBottom className={style.bgColor}>
                <NavBar opacity title={formatMessage({id:'internal.ElectricStatistics.electricStatistics'})} right={hasPowerStatistics?right:[]}/>
                <div className={style.showInfo}>
                    <div>
                        {title}
                        <p><span>{currentElectric}</span><em>{formatMessage({id:'internal.ElectricStatistics.KWH'})}</em></p>
                    </div>
                </div>
                <div ref="container" className={style.container}></div>
                <FixBottom className={style.padStyle}>
                    <div className={style.selectBtn}>
                        <UnitItem label={formatMessage({id:'internal.ElectricStatistics.everyHour'})} state={unit} unit='hour' selectUnit={this.selectUnit}/>
                        <UnitItem label={formatMessage({id:'internal.ElectricStatistics.everyDay'})} state={unit} unit='day' selectUnit={this.selectUnit}/>
                        <UnitItem label={formatMessage({id:'internal.ElectricStatistics.everyMonth'})} state={unit} unit='month' selectUnit={this.selectUnit}/>
                    </div>
                </FixBottom>
                {/* {loading && <Loading />} */}
            </Page>
        );
    }
})