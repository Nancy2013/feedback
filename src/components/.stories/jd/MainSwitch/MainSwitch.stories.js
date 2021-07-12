import React from 'react';
import {
	storiesOf
} from '@storybook/react';
import MainSwitch from '../../../jd/MainSwitch';
import pwrOnSvg from './pwr-on.svg';
import pwrOffSvg from './pwr-off.svg';
import {
	action
} from '@storybook/addon-actions';
import {
	object,
	array,
	boolean,
	text
} from '@storybook/addon-knobs';
import styles from "@sambego/storybook-styles";

const stories = storiesOf('JD/MainSwitch', module)
const MainSwitchDesc = `
  ## 插座类型设备的总开关部分
  usage
  ~~~js
  import MainSwitch from '../../../jd/MainSwitch';
  import pwrOnSvg from './pwr-on.svg';
  import pwrOffSvg from './pwr-off.svg';
  
  	<MainSwitch 
	  image={pwrOffSvg}
	text={总开关}
	on={false}
	 onClick = {
	 	action('clicked')
	 }
	  />
  ~~~
`;
const InfoConfig = {
	inline: false,
	source: false,
	propTables: [MainSwitch]
};
// stories.addDecorator(styles({
// 	'background': '#00FA9A',
// }))



stories.addWithInfo("MainSwitchOff", MainSwitchDesc, () => (
	<MainSwitch 
	  image={text("text",pwrOffSvg)}
	text={text("text","总开关")}
	on={boolean("on",false)}
	 onClick={action('clicked')}
	  />
), InfoConfig)

stories.addWithInfo("MainSwitchOn", MainSwitchDesc, () => (
	<MainSwitch 
	  image={text("text",pwrOnSvg)}
	text={text("text","总开关")}
	on={boolean("on",true)}
	 onClick={action('clicked')}
	  />
), InfoConfig)