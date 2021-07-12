import React from 'react';
import {
	storiesOf
} from '@storybook/react';
import Swiper from '../../../dna/Swiper';
import {
	action
} from '@storybook/addon-actions';
import {
	boolean,
	text,
	select,
	object
} from '@storybook/addon-knobs';
// const {text,enable} = this.props;


const SwiperIdxArr = [1, 2, 3, 4]
const PopupChild = (props) => {
	return (
		<div style={{"height":"200px",display:"flex","justify-content":"center","align-items":"center"}}>{props.swiperIdx}</div>
	)
}

const childCss = {
	"height": "100px",
	width: "33%",
	display: "flex",
	"justify-content": "center",
	"align-items": "center",
	float: "left",
	'border-right': '1px solid #000'
};
const PopupChildMulti = (props) => {
	return (
		<div style={{"height":"200px",width:"100%"}}>
		<div style={childCss}>{props.swiperIdx}</div>
		<div style={childCss}>{props.swiperIdx}</div>
		<div style={childCss}>{props.swiperIdx}</div>
		</div>
	)

}

const directionSelect = ['horizontal', 'vertical']

const paginationStyleSelect = ['bullets', 'button', 'scrollbar']

const handleSlideTo = (slide, speed, runCallbacks) => {
	console.log('handleSlideTo')
}

const sayEvent = (name) => {
	console.log(`Event ${name}`)
}

const SwiperDesc = `
## Swiper组件，下方滑动，轮播组件
  ** 轮播用法 **
  ~~~js
  import Swiper from '../../../dna/Swiper';
  const SwiperIdxArr = [1, 2, 3, 4]
  const PopupChild = (props) => {
	return (
		<div style={{"height":"200px",display:"flex","justify-content":"center","align-items":"center"}}>{props.swiperIdx}</div>
	)
    }
   const directionSelect = ['horizontal', 'vertical']

   const paginationStyleSelect = ['bullets', 'button', 'scrollbar']

		<Swiper
		 paginationStyle={paginationStyleSelect} 
		 autoplay={true}
		  direction={directionSelect} 
		   zoom={true}
		   paginationClickable={true}
		   >

       {SwiperIdxArr.map((swiperIdx)=>
     <PopupChild swiperIdx={swiperIdx}/>
       	)}

		</Swiper>
 
  ~~~
`;

const SwiperMultiWithEventDesc = `
## Swiper组件，下方滑动，轮播组件
  ** 做下方滑动，并附带事件用法 **
  ~~~js
  import Swiper from '../../../dna/Swiper';
  const SwiperIdxArr = [1, 2, 3, 4]
   const childCss = {
	"height": "100px",
	width: "33%",
	display: "flex",
	"justify-content": "center",
	"align-items": "center",
	float: "left",
	'border-right': '1px solid #000'
    };
   const PopupChildMulti = (props) => {
	return (
		<div style={{"height":"200px",width:"100%"}}>
		<div style={childCss}>{props.swiperIdx}</div>
		<div style={childCss}>{props.swiperIdx}</div>
		<div style={childCss}>{props.swiperIdx}</div>
		</div>
	)

}
   const directionSelect = ['horizontal', 'vertical']

   const paginationStyleSelect = ['bullets', 'button', 'scrollbar']

		<Swiper
		 paginationStyle = {
		 	paginationStyleSelect
		 }
		 onInit = {
		 	()=>{sayEvent('onInit')}
		 }
		  slideTo={()=>{sayEvent('slideTo')}}
		   slideChange={()=>{sayEvent('slideChange')}}
		   >

       {SwiperIdxArr.map((swiperIdx)=>
    <PopupChildMulti swiperIdx={swiperIdx}/>
       	)}

		</Swiper>
 
  ~~~
`
const InfoConfig = {
	inline: false,
	source: false,
	propTables: [Swiper]
};



storiesOf('dna/Swiper', module)
	.addWithInfo('Swiper', SwiperDesc, () => (
		<Swiper
		 paginationStyle={select('paginationStyle',paginationStyleSelect)} 
		 autoplay={boolean("autoplay",true)}
		  direction={select('direction',directionSelect)} 
		   zoom={boolean("zoom",true)}
		   paginationClickable={boolean("paginationClickable",true)}
	   >

       {SwiperIdxArr.map((swiperIdx)=>
    <PopupChild swiperIdx={swiperIdx}/>
       	)}

		</Swiper>
	), InfoConfig)
	.addWithInfo('SwiperMultiWithEvent', SwiperMultiWithEventDesc, () => (
		<Swiper
		 paginationStyle = {
		 	text('paginationStyle', 'button')
		 }
		 onInit = {
		 	()=>{sayEvent('onInit')}
		 }
		  slideTo={()=>{sayEvent('slideTo')}}
		   slideChange={()=>{sayEvent('slideChange')}}
		   >

       {SwiperIdxArr.map((swiperIdx)=>
    <PopupChildMulti swiperIdx={swiperIdx}/>
       	)}

		</Swiper>
	), InfoConfig)