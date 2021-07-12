import React from 'react';
import {
       storiesOf
} from '@storybook/react';
import {
       boolean,
       array,
       select,
       number
} from '@storybook/addon-knobs';
import {
       action
} from '@storybook/addon-actions';
import Slider from '../../dna/Slider';
import styles from "@sambego/storybook-styles";


const sliderMinVal = 0;
const sliderMaxVal = 100;
const step = 1;

const defaultSliderValue = 73;
const options = {
       range: true,
       min: sliderMinVal,
       max: sliderMaxVal,
       step: step,
};
const tooltipArr = ["show", "hide", "always"];

const ColortempTypeDesc = `
  ## 滑动条，基于bootstrap-slider实现
  ** Colortemp用法 **
  ~~~js
  import Slider from '../../dna/Slider';
  const sliderMinVal = 0;
  const sliderMaxVal = 100;
  const step = 1;

  const defaultSliderValue = 73;
  const options = {
       range: true,
       min: sliderMinVal,
       max: sliderMaxVal,
       step: step,
  };
  const tooltipArr = ["show", "hide", "always"];
  const classNameSelect = ["pageComponent", ["pageComponent", "margin20"]]
       <Slider 
       type={"colortemp"}
       value={defaultSliderValue}
       min={sliderMinVal}
       max={sliderMaxVal}
       tooltip={tooltipArr}
       enabled={true}
       ticks={[0,50,100]}
       ticksLabels={["低","中","高"]}
       change={action("change")}
       slideStop={action("slideStop")}
              />
 
  ~~~
`
const whitingTypeDesc = `
  ## 滑动条，基于bootstrap-slider实现
  ** Colortemp用法 **
  ~~~js
  import Slider from '../../dna/Slider';
  const sliderMinVal = 0;
  const sliderMaxVal = 100;
  const step = 1;

  const defaultSliderValue = 73;
  const options = {
       range: true,
       min: sliderMinVal,
       max: sliderMaxVal,
       step: step,
  };
  const tooltipArr = ["show", "hide", "always"];
  const classNameSelect = ["pageComponent", ["pageComponent", "margin20"]]
       <Slider 
       type={"whiting"}
       value={defaultSliderValue}
       min={sliderMinVal}
       max={sliderMaxVal}
       tooltip={tooltipArr}
       enabled={true}
       ticks={[0,50,100]}
       ticksLabels={["低","中","高"]}
       change={action("change")}
       slideStop={action("slideStop")}
              />
 
  ~~~
`
const InfoConfig = {
       inline: false,
       source: false,
       propTables: [Slider]
};

storiesOf('dna/Slider', module)
       .addDecorator(styles({
              'background': '#E1FFFF',
       }))
       .addWithInfo('ColortempType', ColortempTypeDesc, () => (
              <Slider 
       type={"colortemp"}
       value={number("value",defaultSliderValue,options)}
       min={number("min",sliderMinVal)}
       max={number("max",sliderMaxVal)}
       tooltip={select("tooltip",tooltipArr)}
       enabled={boolean("enabled",true)}
       ticks={array("ticks",[0,50,100])}
       ticksLabels={array("ticksLabels",["低","中","高"])}
       change={action("change")}
       slideStop={action("slideStop")}
		/>
       ), InfoConfig)
       .addWithInfo('whitingType', whitingTypeDesc, () => (
              <Slider 
       type={"whiting"}
       value={number("value",defaultSliderValue,options)}
       min={number("min",sliderMinVal)}
       max={number("max",sliderMaxVal)}
       tooltip={select("tooltip",tooltipArr)}
       enabled={boolean("enabled",true)}
       ticks={array("ticks",[0,50,100])}
       ticksLabels={array("ticksLabels",["无","一些","很多"])}
       change={action("change")}
       slideStop={action("slideStop")}
		/>
       ), InfoConfig)
       .addWithInfo('addproperties', () => (
              <Slider 
              
       type={"colortemp"}
       value={number("value",defaultSliderValue,options)}
       min={number("min",sliderMinVal)}
       max={number("max",sliderMaxVal)}
       tooltip={select("tooltip",tooltipArr)}
       enabled={boolean("enabled",true)}
       ticks={array("ticks",[0,50,100])}
       ticksLabels={array("ticksLabels",["低","中","高"])}
       change={action("change")}
       slideStop={action("slideStop")}
       showTicks={boolean("showTicks",false)}
       selection={boolean('selection',false)}
		/>
       ), InfoConfig);