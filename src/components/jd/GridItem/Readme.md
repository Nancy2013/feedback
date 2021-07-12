 ## JD平台带svg的GridItem

  ** usage **
  ~~~js
   import GridItem from '../components/jd/GridItem';
   import {ReactComponent as auto} from './img/auto.svg';
      //svg以以上方式引入，并传入组件props的svg属性
      /* 
      此处 svg 要求: 
       1.带外围圆圈
       2.svg的颜色属性为fill属性实现，若不是纯fill属性实现颜色填充需找UI调整svg 
      */
   	<GridItem
   		on={true}
   		disable = {false}
   		svg={auto}
   		text={'自动'}
   		onClick={action('click')}
   		/>
  ~~~


 ## JD平台纯文字的GridItem

  ** usage **
  ~~~js
   import GridItem from '../components/jd/GridItem';

   	<GridItem
   		on={true}
   		disable = {false}
   		text={'高速'}
   		onClick={action('click')}
   		/>
  ~~~
