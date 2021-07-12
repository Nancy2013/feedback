import React from 'react';
import {
	storiesOf
} from '@storybook/react';
import {
	action
} from '@storybook/addon-actions';
import SwitchButton from '../../../dna/SwitchButton';
import styles from "@sambego/storybook-styles";

import {
	boolean,
} from '@storybook/addon-knobs';

const SwitchButtonDesc = `
  ## checkbox风格的开关button
  ** 用法 **
  ~~~js
  import SwitchButton from '../../../dna/SwitchButton';
  <SwitchButton checked={false} onClick={action('clicked')} />
 
  ~~~
`
const InfoConfig = {
	inline: false,
	source: false,
	propTables: [SwitchButton]
};

storiesOf('dna/SwitchButton', module)
	.addDecorator(styles({
		// "background": "#000",
		'text-align': 'center',
	}))
	.addWithInfo('SwitchButton', SwitchButtonDesc, () => (
		<SwitchButton checked={boolean('open',false)} onClick={action('clicked')} />
	), InfoConfig)