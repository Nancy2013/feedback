import React from 'react';
import {
        storiesOf
} from '@storybook/react';
import {
        action
} from '@storybook/addon-actions';
import ColorPicker from '../../dna/ColorPicker';
import styles from "@sambego/storybook-styles";

import {
        boolean,
        text,
        array,
        number
} from '@storybook/addon-knobs';

const ticksArr = [0, 100]
const ticksLabelsArr = ["最小值", "最大值"]

const ColorPickerDesc = `
  ## 颜色选择组件
  ** 颜色选择组件用法 **
  ~~~js
  import ColorPicker from '../../dna/ColorPicker';
  const ticksArr = [0, 100]
  const ticksLabelsArr = ["最小值", "最大值"]
    <ColorPicker
                type={'color'}
                min={0)}
                max={100}
                ticks={ticksArr}
                ticksLabels={ticksLabelsArr)}
                step={1}
                trackColor={"#fff"}
                slide={'slide'}
                slideStart={action('slideStart')}
                slideStop={action('slideStop')}
                change={action('change')}
                slideEnabled={action('slideEnabled')}
                slideDisabled={action('slideDisabled')}
        />
 
  ~~~
`
const saturationPicker = `
  ## 颜色选择组件
  ** 色温选择用法 **
  ~~~js
  import ColorPicker from '../../dna/ColorPicker';
  const ticksArr = [0, 100]
  const ticksLabelsArr = ["最小值", "最大值"]
    <ColorPicker
                type={'saturation'}
                min={0)}
                max={100}
                ticks={ticksArr}
                ticksLabels={ticksLabelsArr)}
                step={1}
                trackColor={"#fff"}
                slide={'slide'}
                slideStart={action('slideStart')}
                slideStop={action('slideStop')}
                change={action('change')}
                slideEnabled={action('slideEnabled')}
                slideDisabled={action('slideDisabled')}
        />
 
  ~~~
`
const InfoConfig = {
        inline: false,
        source: false,
        propTables: [ColorPicker]
};

storiesOf('dna/ColorPicker', module)
        .addDecorator(styles({
                'padding-top': '30%',
        }))
        .addWithInfo('ColorPicker', ColorPickerDesc, () => (
                <ColorPicker
                type={'color'}
                min={number("min",0)}
                max={number("max",100)}
                ticks={array("ticks",ticksArr)}
                ticksLabels={array("ticksLabels",ticksLabelsArr)}
                step={number("step",1)}
                trackColor={text("trackColor","#fff")}
                slide={action('slide')}
                slideStart={action('slideStart')}
                slideStop={action('slideStop')}
                change={action('change')}
                slideEnabled={action('slideEnabled')}
                slideDisabled={action('slideDisabled')}
        />
        ), InfoConfig)
        .addWithInfo('saturationPicker', saturationPicker, () => (
                <ColorPicker
                type={"saturation"}
                min={number("min",0)}
                max={number("max",100)}
                ticks={array("ticks",ticksArr)}
                ticksLabels={array("ticksLabels",ticksLabelsArr)}
                step={number("step",1)}
                trackColor={text("trackColor","#fff")}
        />
        ), InfoConfig)