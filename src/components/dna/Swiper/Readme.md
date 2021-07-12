/**
 * Created by Administrator on 2018/3/9 0009.
 */
 
 # Project Title    Swiper组件

## Getting Started
 improt Swiper from "./Swiper"
<Swiper></Swiper>

## Versioning    V1.0

## Contributing

## Authors   Juliette

##Params
zoom：放大功能
    true:启用放大功能
    fale:禁用放大功能（默认）
    （tips:仅对图片内容有效）
    
slideChange:监听滑动事件

paginationStyle：分页器样式
    bullets：下面点样式（默认）
    button：左右箭头按钮样式（样式可修改）
    scrollbar：下面滑杆模式
    
direction：滑动方向
    horizontal：水平方向（默认）
    vertical：垂直方向
    
autoplay:是否支持自动滑动
    true:支持
    false:不支持（默认）
    Number：间隔时间

##Event
slideTo:滑块滑动到
slideTo(index,speed,callbacks); //index:slide下标从0开始，speed滑动速度，callbacks是否触发滑动事件

<Swiper ref={(swiper)=>{this.swiper=swiper}}>
this.swiper.slideTo(0,1000,true);

##Example

 <Swiper zoom={true} slideChange={this.slideChange} autoplay={true}>
    <div>
        <img src={img} alt=""/>
    </div>
    <div>
        <img src={img} alt=""/>
    </div>               
    <div>
        <img src={img} alt=""/>
    </div>
</Swiper>

 <Swiper paginationStyle="button"  ref={(swiper)=>{this.swiper=swiper}}>
 
<Swiper paginationStyle="scrollbar">
