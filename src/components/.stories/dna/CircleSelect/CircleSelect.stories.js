import React from 'react';
import {
        storiesOf
} from '@storybook/react';
import {
        action
} from '@storybook/addon-actions';
import CircleSelect from '../../../dna/CircleSelect';

import {
        boolean,
        text,
        select,
        number
} from '@storybook/addon-knobs';


storiesOf('dna/CircleSelect', module)
        .addWithInfo('CircleSelect',
                `
 ## 空调中圆形选择框的组件

  ** usage **
  ~~~js
   import CircleSelect from '../../../dna/CircleSelect';
    <CircleSelect
        value={25}
        min={16}
        max={31}
        disable={false}
        unit={'℃'}
         up={action('upEvent')}
        down={action('downEvent')}
        />
  ~~~
  `,
                () => (
                        <CircleSelect
        value={number("value",25)}
        min={number("min",16)}
        max={number("max",31)}
        disable={false}
        unit={text("unit",'℃')}
        up={action('upEvent')}
        down={action('downEvent')}
        />
                ), {
                        inline: false,
                        source: false,
                        propTables: [CircleSelect]
                }, )

        .addWithInfo('CircleSelectDisable',
                `
 ## 空调中圆形选择框的组件 禁用状态

  ** usage **
  ~~~js
   import CircleSelect from '../../../dna/CircleSelect';
    <CircleSelect
        value={25}
        min={16}
        max={31}
        disable={true}
        unit={'℃'}
                up={action('upEvent')}
        down={action('downEvent')}
        />
  ~~~
  `, () => (
                        <CircleSelect
        value={number("value",25)}
        min={number("min",16)}
        max={number("max",31)}
        disable={true}
        unit={text("unit",'℃')}
        up={action('upEvent')}
        down={action('downEvent')}
        />
                ), {
                        inline: false,
                        source: false,
                        propTables: [CircleSelect]
                }, )