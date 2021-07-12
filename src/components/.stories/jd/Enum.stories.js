import React from 'react';
import {
	storiesOf
} from '@storybook/react';
import Enum from '../../jd/Enum';
import {
	object,
	array,
	boolean,
} from '@storybook/addon-knobs';

const stories = storiesOf('JD/Enum', module)
const EnumDesc = `
  ## 枚举 呈一列 组件
  usage
  ~~~js
  import Enum from '../../jd/Enum';
  
  const EnumChild = () => <div>子元素</div>
  <Enum more={true}>
    {[1,2,3,4].map(()=>EnumChild())}
	</Enum>
  ~~~
`;
const InfoConfig = {
	inline: false,
	source: false,
	propTables: [Enum]
};

const EnumChild = () => <div>子元素</div>

stories.addWithInfo("Enum", EnumDesc, () => (
	<Enum more={boolean("more",true)}>
    {[1,2,3,4].map(()=>EnumChild())}
	</Enum>
), InfoConfig)