import React, {
	Component
} from 'react';
import {
	storiesOf
} from '@storybook/react';
import FunctionBlock from '../../jd/FunctionBlock';
import SwitchButton from '../../jd/SwitchButton';
import {
	object,
	array,
	boolean,
} from '@storybook/addon-knobs';
import styles from "@sambego/storybook-styles";

const stories = storiesOf('JD/FunctionBlock', module)
const FunctionBlockDesc = `
  ## 京东UI上的一个功能区域，一般代表一个功能参数如 pwr、mode
  ** 此处例子为开关的用法**
  ~~~js
  import FunctionBlock from '../../jd/FunctionBlock';
  import SwitchButton from '../../jd/SwitchButton';
  import React, {
	Component
   } from 'react';
  const childStyle = {
	display: "flex",
	"justify-content": "space-between",
	"align-items": "center",
	padding: "0 5%",
 }
 class FunctionBlockChild extends Component {
	render() {
		return (
			<div style={childStyle}>开关 <SwitchButton checked={true}  disable={this.props.disable} /></div>
		)
	}
  }
 <FunctionBlock disable={false} >
	{<FunctionBlockChild />}
	</FunctionBlock>

  ~~~
`;
const InfoConfig = {
	inline: false,
	source: false,
	propTables: [FunctionBlock]
};

stories.addDecorator(styles({
	'background': '#FFFFFF',
	"paddingBottom": "20%"
}))

const childStyle = {
	display: "flex",
	"justify-content": "space-between",
	"align-items": "center",
	padding: "0 5%",
}
class FunctionBlockChild extends Component {
	render() {
		return (
			<div style={childStyle}>开关 <SwitchButton checked={true}  disable={this.props.disable} /></div>
		)
	}
}

stories.addWithInfo("FunctionBlock", FunctionBlockDesc, () => (
	<FunctionBlock disable={boolean("disable",false)} >
	{<FunctionBlockChild />}
	</FunctionBlock>

), InfoConfig)