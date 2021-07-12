# Project Title    SocketStatistics组件
统计插座的电力和功率图表组件
# 主要包含以下参数：
did: PropTypes.string.isRequired, //设备的deviceID<br/>
history: PropTypes.object.isRequired,//react Route里的参数<br/>
location: PropTypes.object.isRequired,//react Route里的参数<br/>
hasPowerStatistics: PropTypes.bool.isRequired//是否有功率统计页面
# 注意点
可以单独引用ElectricStatistics电力统计组件和PowerStatistics功率统计组件<br/>