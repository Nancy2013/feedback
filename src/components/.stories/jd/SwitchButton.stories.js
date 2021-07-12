import React from 'react';
import {
	storiesOf
} from '@storybook/react';
import SwitchButton from '../../jd/SwitchButton';
import {
	action
} from '@storybook/addon-actions';
import {
	object,
	array,
	boolean,
} from '@storybook/addon-knobs';
import styles from "@sambego/storybook-styles";
const stories = storiesOf('JD/SwitchButton', module)
const SwitchButtonDesc = `
  ## checkbox风格的开关button
  usage
  ~~~js
  import SwitchButton from '../../jd/SwitchButton';
  
  	<SwitchButton checked={true}  disable={false}  onClick={action("clicked")}/>
  ~~~
`;
const InfoConfig = {
	inline: false,
	source: false,
	propTables: [SwitchButton]
};
stories.addDecorator(styles({
	'background': '#FFFFFF',
}))

stories.addWithInfo("SwitchButton", SwitchButtonDesc, () => (

	<SwitchButton 
	checked={boolean("checked",true)} 
	 disable={boolean("disable",false)} 
	  onClick={action("clicked")}
	  />

), InfoConfig)