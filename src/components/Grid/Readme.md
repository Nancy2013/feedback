  ## 自定义component或者div等标签元素配合Grid使用

  ** usage **
  ~~~js
   import Grid from '../components/Grid';

   <Grid border={true} equal={true} pyramid={true} linefeed={true}>
       <div style={{height:'100px',lineHeight:'100px',color:'#fff',fontSize:'30px'}}>制冷</div>
       <div style={{height:'100px',lineHeight:'100px',color:'#fff',fontSize:'30px'}}>制热</div>
       <div style={{height:'100px',lineHeight:'100px',color:'#fff',fontSize:'30px'}}>通风</div>
       <div style={{height:'100px',lineHeight:'100px',color:'#fff',fontSize:'30px'}}>制冷</div>
       <div style={{height:'100px',lineHeight:'100px',color:'#fff',fontSize:'30px'}}>制热</div>
   </Grid>

  ~~~
  
  ## DNA平台GridItem配合Grid使用
    
  ** usage **
  ~~~js
      import DNAGridItem from '../components/dna/GridItem';
      import Grid from '../components/Grid';
      import {ReactComponent as manu} from './img/manu.svg';
    
     <Grid linefeed={false}>
         <DNAGridItem text={"手动"} on={false} svg={manu} pressingHighlight={true} onClick={action('click')}/>
         <DNAGridItem text={"手动"} on={true} svg={manu} disable={true} onClick={action('click')}/>
         <DNAGridItem text={"手动"} on={true} svg={manu}  onClick={action('click')}/>
         <DNAGridItem text={"手动"} on={false} svg={manu} onClick={action('click')}/>
         <DNAGridItem text={"手动"} on={false} svg={manu} onClick={action('click')}/>
     </Grid>
    
  ~~~



  ## GOME平台GridItem配合Grid使用

   ** usage **
  ~~~js
    import GomeGridItem from '../components/gome/GridItem';
    import Grid from '../components/Grid';
    import {ReactComponent as manu} from './img/manu.svg';

    <Grid >
       <GomeGridItem text={"手动"} on={false} svg={manu} onClick={action('click')}/>
       <GomeGridItem text={"手动"} on={true} svg={manu} onClick={action('click')}/>
       <GomeGridItem text={"手动"} on={true} svg={manu} onClick={action('click')}/>
       <GomeGridItem text={"手动"} on={true} svg={manu} onClick={action('click')}/>
    </Grid>

  ~~~
  
   ## JD平台GridItem配合Grid使用
  
   ** usage **
   ~~~js
     import JDGridItem from '../components/jd/GridItem';
     import Grid from '../components/Grid';
     import {ReactComponent as auto} from './img/auto.svg';
     import {ReactComponent as sleep} from './img/sleep.svg';
     import {ReactComponent as preheat} from './img/preheat.svg';
     import {ReactComponent as sterilize} from './img/sterilize.svg';
  
       <Grid border={true} equal={true} pyramid={true}>
          <JDGridItem text={"智能"} on={false} svg={auto} onClick={action('click')}>
          <JDGridItem text={"睡眠"} on={true} svg={sleep} onClick={action('click')}>
          <JDGridItem text={"预热"} on={true} svg={preheat} onClick={action('click')}>
          <JDGridItem text={"杀菌"} on={true} svg={sterilize} onClick={action('click')}>
          <JDGridItem text={"杀菌"} on={true} svg={sterilize} onClick={action('click')}>
       </Grid>
  
    ~~~

