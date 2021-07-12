 ## GOME平台带svg的GridItem

  ** usage **
  ~~~js
    import GridItem from '../components/gome/GridItem';
    import {ReactComponent as manu} from './img/manu.svg';
      //svg以以上方式引入，并传入组件props的svg属性
      /* 
      此处 svg 要求: 
       1.不带外围圆圈(按钮外围圆圈由组件自动添加) 
       2.svg的颜色属性为fill属性实现，若不是纯fill属性实现颜色填充需找UI调整svg 
      */
    <GridItem
        disable = {false}
        svg={manu}
        text={'手动'}
        onClick={action('click')}
        pressingHighlight={true}
         />
  ~~~


 ## GOME平台纯文字的GridItem

  ** usage **
  ~~~js
   import GridItem from '../components/gome/GridItem';

   	<GridItem
   		on={false}
   		disable = {false}
   		text={'高速'}
   		onClick={action('click')}
   		pressingHighlight={true}
   		/>
  ~~~
