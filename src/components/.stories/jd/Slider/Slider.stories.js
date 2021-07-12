import React from 'react';
import {
	storiesOf
} from '@storybook/react';
import Slider from '../../../jd/Slider';
import {
	action
} from '@storybook/addon-actions';
import {
	select,
	array,
	boolean,
	number
} from '@storybook/addon-knobs';
import styles from "@sambego/storybook-styles";

const stories = storiesOf('JD/Slider', module)
const SliderDesc = `
## 用法1：基础设置 
SliderBasicSetting
~~~js
    <Slider  min={0} max={20} step={1} value={5}/>
  ~~~  
## 用法2：基础设置  禁用 
SliderDisable
~~~js
    <Slider  min={0} max={20} step={1} value={5} enabled={false}/>
   ~~~
## 用法3：标记slider下方标签  均分  无ticks 
 SliderLabelsAverage
~~~js
    const ticks=[0, 100];
    const ticks_label=['0', '100'];

    <Slider ticks={ticks} ticksLabels={ticks_label}/>
~~~
## 用法4：标记slider下方标签  均分SliderLabelsAverage
 ~~~js
    const ticks=[0, 100, 200];
    const ticks_label=['0', '100','200'];

    <Slider ticks={ticks} ticksLabels={ticks_label} step={100}/>
 ~~~
## 用法5：标记slider下方标签  未均分 SliderLabelsNoAverage
 ~~~js
    const ticks=[0, 50,100];
    const ticks_labels=['默认', 90, 100];
    <Slider ticks={ticks} ticksLabels={ticks_labels} step={50}/>
 ~~~
## 用法6：显示图片 SliderWithImg
 ~~~js
    const btn  = require('../PowerButton/pwr-on.svg');
    const ticks=[0, 100, 200, 300, 400];
    const Images=[btn,btn,btn,btn,btn];

    <Slider ticks={ticks} ticksImages={Images} step={100}/>
  ~~~
  ## slider上事件用法
   ~~~js
    <Slider 
	onChange={action("onChange")}
	slideStart={action("slideStart")}
	slideStop={action("slideStop")}
	change={action("change")}
	slide={action("slide")}
	  />
  ~~~
`;
const InfoConfig = {
	inline: false,
	source: false,
	propTables: [Slider]
};
stories.addDecorator(styles({
	width: "60%",
	"margin": "30% 0 0 20%"
}))

const ticks = [0, 100];
const ticks_label = ['0', '100'];

const ticks1 = [0, 100, 200];
const ticks_label1 = ['0', '100', '200'];

const btn = require('./pwr-on.svg');
const ticks2 = [0, 100, 200, 300, 400];
const Images = [btn, btn, btn, btn, btn];

stories.addWithInfo("SliderWithEvent", SliderDesc, () => (

	<Slider 
	onChange={action("onChange")}
	slideStart={action("slideStart")}
	slideStop={action("slideStop")}
	change={action("change")}
	slide={action("slide")}
	  />

), InfoConfig)
const options = {
	range: true,
	min: 0,
	max: 20,
	step: 1,
};

stories.addWithInfo("SliderBasicSetting", SliderDesc, () => (

	<Slider 
	min={number("min",0)} max={number("min",20)} step={number("step",1)} value={number("value",5,options)}
	  />

), InfoConfig)
stories.addWithInfo("SliderDisable", SliderDesc, () => (

	<Slider  min={number("min",0)} max={number("min",20)} step={number("step",1)} 
	value={number("value",5,options)} enabled={boolean("enabled",false)}/>

), InfoConfig)

stories.addWithInfo("SliderLabels", SliderDesc, () => (
	<Slider ticks={array("ticks",ticks)} ticksLabels={array("ticksLabels",ticks_label)}/>
), InfoConfig)

stories.addWithInfo("SliderLabelsAverage", SliderDesc, () => (
	<Slider ticks={array("ticks",ticks1)} ticksLabels={array("ticksLabels",ticks_label1)} step={100}/>
), InfoConfig)

stories.addWithInfo("SliderLabelsNoAverage", SliderDesc, () => (
	<Slider ticks={array("ticks",ticks1)} ticksLabels={array("ticksLabels",ticks_label1)}  step={50}/>
), InfoConfig)

stories.addWithInfo("SliderWithImg", SliderDesc, () => (
	<Slider ticks={array("ticks",ticks2)} ticksImages={array("ticksImages",Images)} step={100}/>
), InfoConfig)