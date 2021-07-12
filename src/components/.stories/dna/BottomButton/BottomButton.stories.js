import React from 'react';
import {
	storiesOf
} from '@storybook/react';
import BottomButton from '../../../dna/BottomButton';
import {
	action
} from '@storybook/addon-actions';
import {
	boolean,
	text,
} from '@storybook/addon-knobs';
import styles from "@sambego/storybook-styles";

storiesOf('dna/BottomButton', module)
	.addWithInfo('BottomButton',
		`
 ## 永远置于屏幕底部的Button

  ** usage **
  ~~~js
   import BottomButton from '../../../dna/BottomButton';

   	<BottomButton 
		text = {"底部按钮")}
		enable = {false}
		 />
  ~~~
  `,
		() => (
			<BottomButton 
		text = {text("text", "底部按钮")}
		enable = {boolean("enable", false)}
		 />
		), {
			inline: false,
			source: false,
			propTables: [BottomButton]
		}, );