import React from 'react';
import {
	storiesOf
} from '@storybook/react';
import {
	boolean,
	array,
	select
} from '@storybook/addon-knobs';
import Page from '../../dna/Page';

const classNameSelect = ["pageComponent", ["pageComponent", "margin20"]]
const PageDesc = `
  ## Page组件，同时提供了iphonex的实现
  ** 用法 **
  ~~~js
  import Page from '../../dna/Page';
  const classNameSelect = ["pageComponent", ["pageComponent", "margin20"]]
  		<Page 
         saveTop={true}
         saveBottom ={false}
         className={classNameSelect}
		/>
 
  ~~~
`
const InfoConfig = {
	inline: false,
	source: false,
	propTables: [Page]
};
storiesOf('dna/Page', module)
	.addWithInfo('Page', PageDesc, () => (
		<Page 
         saveTop={boolean("saveTop",true)}
         saveBottom ={boolean("saveBottom",false)}
         className={select("className",classNameSelect)}
		/>
	), InfoConfig);