import React from 'react';
import {
	storiesOf
} from '@storybook/react';
import PowerButton from '../../jd/PowerButton';
import {
	action
} from '@storybook/addon-actions';
import {
	select,
	array,
	boolean,
} from '@storybook/addon-knobs';
import styles from "@sambego/storybook-styles";

const stories = storiesOf('JD/PowerButton', module)
const PowerButtonDesc = `
  ## 开关按钮
  ** 用法一  开状态**
  ~~~js
  import PowerButton from '../../jd/PowerButton';
  	<PowerButton 
	  state={"on"} 
	  onClick={action("clicked")}
	  />
  ~~~
    ** 用法二  关状态**
  ~~~js
  import PowerButton from '../../jd/PowerButton';
  	<PowerButton 
	  state={"off"} 
	  onClick={action("clicked")}
	  />
  ~~~
`;
const InfoConfig = {
	inline: false,
	source: false,
	propTables: [PowerButton]
};
stories.addDecorator(styles({
	'background': '#FFFFFF',
}))

stories.addWithInfo("PowerButtonOn", PowerButtonDesc, () => (

	<PowerButton 
	state={select("state",["on","off"])} 
	  onClick={action("clicked")}
	  />

), InfoConfig)
stories.addWithInfo("PowerButtonOff", PowerButtonDesc, () => (

	<PowerButton 
	state={select("state",["off","on"])} 
	  onClick={action("clicked")}
	  />

), InfoConfig)