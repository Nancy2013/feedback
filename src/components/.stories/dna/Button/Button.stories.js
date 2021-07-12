import React from 'react';
import {
	storiesOf
} from '@storybook/react';
import {
	action
} from '@storybook/addon-actions';
import Button from '../../../dna/Button';

import pwrImg from './pwr-on.svg';

storiesOf('dna/Button', module)
	.addWithInfo('with label',
		`
 A common Button component, usually used with a stateful- Button or stateful HOC component
 with label usage
  ~~~js
   import Button from '../../../dna/Button';

   <Button image={pwrImg}  label="总开关"/>
  ~~~
 without label usage
  ~~~js
   import Button from '../../../dna/Button';

   <Button image={pwrImg}  />
  ~~~
  `,

		() => (
			<Button image={pwrImg} onClick={action('clicked')} label="总开关"/>
		), {
			inline: false,
			source: false,
			propTables: [Button]
		},
	)

	.addWithInfo('without label',
		`
 A common Button component, usually used with a stateful- Button or stateful HOC component
 with label usage
  ~~~js
   import Button from '../../../dna/Button';

   <Button image={pwrImg}  label="总开关"/>
  ~~~
 without label usage
  ~~~js
   import Button from '../../../dna/Button';

   <Button image={pwrImg}  />
  ~~~
  `,
		() => (
			<Button image={pwrImg} onClick={action('clicked')}/>
		), {
			inline: false,
			source: false,
			propTables: [Button]
		}, );