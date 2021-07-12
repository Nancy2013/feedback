import React from 'react';
import {
	storiesOf
} from '@storybook/react';
import Loading from '../../ActivityIndicator';


const stories = storiesOf('dna/Loading', module)

stories.addWithInfo(
	'Loading',
	`
  Embed the entire interface in the loading interface
  usage
  ~~~js
  import Loading from '../../dna/ActivityIndicator';

  <Loading />
  ~~~
  `,
	() => (
		<Loading />
	), {
		inline: false,
		source: false,
		propTables: [Loading]
	},
);