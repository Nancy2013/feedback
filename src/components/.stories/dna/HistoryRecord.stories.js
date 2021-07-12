// import React from 'react';
// import {
//   storiesOf
// } from '@storybook/react';
// import HistoryRecord from '../../dna/HistoryRecord';
// import {
//   action
// } from '@storybook/addon-actions';
// import {
//   boolean,
//   text,
//   select,
//   array,
//   date
// } from '@storybook/addon-knobs';
// import styles from "@sambego/storybook-styles";


// const HistoryRecordByParamsStrDesc = `
//   ## 历史记录组件
//   ** 参数为字符串用法 **
//   ~~~js
//   import HistoryRecord from '../../dna/HistoryRecord';

//       <HistoryRecord 
//             did="1")}
//            params={"pwr"}
//            desc={action("desc")}
//     />

//   ~~~
// `
// const HistoryRecordByParamsArrDesc = `
//   ## 历史记录组件
//   ** 参数为数组用法 **
//   ~~~js
//   import HistoryRecord from '../../dna/HistoryRecord';

//       <HistoryRecord 
//             did="1")}
//            params={["pwr","pwr1","pwr2"]}
//            desc={action("desc")}
//     />

//   ~~~
// `
// const InfoConfig = {
//   inline: false,
//   source: false,
//   propTables: [HistoryRecord]
// };

// storiesOf('dna/HistoryRecord', module)

//   .addWithInfo('HistoryRecordByParamsStr', HistoryRecordByParamsStrDesc, () => (
//     <HistoryRecord 
//             did={text("did","1")}
//            params={text("params","pwr")}
//            desc={action("desc")}
//     />
//   ), InfoConfig)

//   .addWithInfo('HistoryRecordByParamsArr', HistoryRecordByParamsArrDesc, () => (
//     <HistoryRecord 
//             did={text("did","1")}
//            params={array("params",["pwr","pwr1","pwr2"])}
//            desc={action("desc")}
//     />
//   ), InfoConfig)