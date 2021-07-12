import React from 'react';
import {
	storiesOf
} from '@storybook/react';
import FromNowDescription from '../../dna/FromNowDescription';
import {
	boolean,
	text,
	select,
	object,
	date
} from '@storybook/addon-knobs';
import styles from "@sambego/storybook-styles";
import moment from 'moment';

const FromNowDescriptionDesc = `
  ## 现实给定时间距离现在的描述
  ** 用法 **
  ~~~js
  import FromNowDescription from '../../dna/FromNowDescription';
  import moment from 'moment';
  	<FromNowDescription 
            action={text("action","开")}
            time={moment(date("time", new Date('2018-05-29 18:24:54')))}
		/>
 
  ~~~
`
const InfoConfig = {
	inline: false,
	source: false,
	propTables: [FromNowDescription]
};
storiesOf('dna/FromNowDescription', module)

	.addWithInfo('FromNowDescription', FromNowDescriptionDesc, () => (
		<FromNowDescription 
            action={text("action","开")}
            time={moment(date("time", new Date('2018-05-29 18:24:54')))}
		/>
	), InfoConfig)