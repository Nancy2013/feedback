用法1:(普通用法 title为一个string数值) topLeftIcon默认为删除按钮 closeSelf点击左上按钮关闭弹窗 clickaway为点击屏幕非弹窗的任意位置，可以隐藏弹窗

     <Popup title="风速选择" topLeftIcon="back" closeSelf={} clickaway>
        <div>"此处为Content"</div>
     </Popup>

用法2:(tab用法 title为tab切换) defaultActiveKey参数为当前popup显示的内容

     <Popup tab closeSelf defaultActiveKey="2">
         <Popup.TabPane key="1" tab="程序">
             <div>"此处为tab="程序"的Content"</div>
         </Popup.TabPane>
         <Popup.TabPane key="2" tab="调节">
             <div>"此处为tab="调节"的Content"</div>
         </Popup.TabPane>
     </Popup>
