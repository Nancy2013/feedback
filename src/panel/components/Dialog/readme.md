
## 属性

属性 | 类型 | 必填 | 默认值 |说明
----|------|-----|-----|-----
className | string | 否 | '' | 自定义的class，可用来自定义样式
visible | boolean | 是 | true |是否显示dialog
confirmText | string | 否 | 确定 | 确认按钮的显示文案
cancelText | string | 否 | '' | 取消按钮的显示文案
onConfirm | function | 否 | ()=>{} | 确认的回调函数
cancelText | function | 否 | ()=>{} | 取消的回调函数
text | string | 否 | 'dialog显示的文案' | 显示的内容


## 使用方式

### 第一种： 纯文本的显示

```
    <Dialog text={"显示相应的文案"} visible={true} onConfirm={()=>{}} />
```

### 第二种： 自定义内容


- 若props配置了text，则不会显示双标签内的内容 

```
    <Dialog visible={true} onConfirm={()=>{}}>
        <div>{"可自定义显示的内容"}</div>
    </Dialog>
```