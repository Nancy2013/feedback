import {control} from './logic';
import { connect} from 'react-redux';
import * as selectors from './reducers/index'

function currying(fn,state){
    return (...args) =>fn.apply(null,[state,...args]);
}
/*

 mapStatusToProps:
     如果传入的是string，比如‘pwr’。则注入当前将pwr值注入组件。eg:
        <Component state={1}/>
     如果传入的是Array，比如 ['pwr','light'].则注入当前将pwr&light值注入组件。eg:
        <Component state={{pwr:1,light:0}}/>
        or
        <Component pwr={1} light={0}/>
     如果传入的是Function，该回调函数必须返回一个纯对象，这个对象会与组件的 props 合并，
        mapStateToProps(selectors(从state中获取数据的选择器), [ownProps]): stateProps

 mapControlToProps:Function 该回调函数必须返回一个纯对象，这个对象会与组件的 props 合并
     mapControlToProps(control, [allProps]): stateProps
        allProps:当前组件的所有props,包括注入的StatusProps

     如果不传会注入 control属性

 options:  (Object) 如果指定这个参数，可以定制注入的行为。
    {
        propName:'pwr', //注入props的名称，默认为‘state’
        spread:false, //为true则忽略propName，使用参数本身名称，多个参数则会被spread。在mapStatusToProps为数组的情况下，默认为true，否则为默认为false
                        eg:如果为true,<Component pwr={1} light={0}/>
                           如果为false,<Component state={{pwr:1,light:0}}/>
    }
* */

export const inject = (mapStatusToProps,mapControlToProps,options={})=>{
    const {propName='state',spread=Array.isArray(mapStatusToProps)} = options;

    const mapStateToProps = mapStatusToProps?
        (state, ownProps) => {
            if(typeof mapStatusToProps === 'function'){
                //不需要传入state参数的selector
                let simpleSelector = {};
                Object.keys(selectors).forEach(s=>{
                    const selector = selectors[s];
                    if(typeof selector === 'function'){
                        simpleSelector[s] = currying(selector,state)
                    }
                });

                return mapStatusToProps(simpleSelector,ownProps);
            }else if(typeof mapStatusToProps === 'string' ){
                return {
                    [spread?mapStatusToProps:propName]: selectors.getStatus(state,mapStatusToProps),
                };
            }else if(Array.isArray(mapStatusToProps)){
                let props = selectors.getStatus(state,mapStatusToProps);
                return spread?props:{
                    [propName]: props
                };
            }else{
                throw new Error('unsupported argument type');
            }
        }
        :null;

    const mapDispatchToProps = {};

    const mergeProps = mapControlToProps?
        (stateProps, dispatchProps, ownProps)=>{
            const props = {...stateProps ,...ownProps};
            return {...props,...mapControlToProps(control,props)}
        }
        :(stateProps, dispatchProps, ownProps)=>({...stateProps,...ownProps,control});

    return component=>connect(mapStateToProps,mapDispatchToProps,mergeProps)(component);
};


export const toggleInject = (status,clickPropName = 'onClick') => inject(status,(control,{state})=>({
    [clickPropName]:()=>control({[status]:state===0?1:0})
}));

