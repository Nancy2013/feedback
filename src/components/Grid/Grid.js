import React from 'react';
import style from './Grid.less';
import PropTypes from 'prop-types';
import classNames from 'classnames';
/**
* 通用布局、排版
* */
class Grid extends React.PureComponent {
    /*
    * 1.无columns参数,传入子组件个数4个及4个以下，该组件默认处理为1行
    *
    * 2.无columns参数且linefeed参数为true，且传入4个以上子组件，该组件自动分配列数(即每行个数)为3或4，
    * 处理规则以每行空余个数最少为算(例如5处理成3+2或2+3、7处理成4+3或3+4)。
    *
    * 3.有columns参数且>=2时，每行列数为columns的值
    *注：该组件会为每个子组件注入columns参数(表示父元素宽度范围内子元素的列数)，以供子组件封装样式适配，值范围(2,3,4分别代表排满屏幕列数),
    * 例如：各平台GridItem组件可根据columns自动适配不同的样式。
    * */
    static propTypes = {
        border:PropTypes.bool, //true: 京东默认边框;  false:无边框
        pyramid:PropTypes.bool,//true:子元素个数少的一行作为第一行;   false:子元素个数少的一行作为最后一行
        equal:PropTypes.bool, //true:每个子元素相同大小;  false:子元素个数少的一行自动均分整行宽度
        linefeed:PropTypes.bool,//true:超过4个子元素默认换行; false:n(n>4)个子元素依然排列一行，超出父元素范围为(n-4)*25%,支持滑动;
        columns:PropTypes.number //不传根据组件余数最小算法分组，columns>2,当linefeed为false的时候可以传入非整数例如：5.5，linefeed为true时暂不支持传入小数
    };
    static defaultProps = {
        border:false, //默认无边框
        pyramid:false,//默认倒金字塔状，即子元素个数少的一行为最后一行
        equal:true, //默认每个子元素相同大小
        linefeed:true,//默认超出4个子元素自动换行
    };
    render(){
        const {children,border,pyramid,equal,linefeed,columns} = this.props;
        const count = React.Children.count(children);
        if(count===0){
            //gird组件 无子节点返回空
            return null
        }
        const lines = [
            {column: 3},
            {column: 4}
            ];
        let line ;
        if(count>2){
            if(count>4&&!linefeed){
                line={column: 4}
            }else{
                const lefts = lines.map(line=>{
                    const column =line.column;
                    const divisionLeft= (count/column)-parseInt(count/column);
                    return divisionLeft===0?1:divisionLeft;
                });
                line = lefts[0]>lefts[1] ? lines[0]:lines[1];
            }
        }else{
            line = {column: 2};
        }
        let lessLineCount;//较少一行元素个数
        if(columns){
            lessLineCount=count%(Math.floor(columns));
        }else {
            lessLineCount=count%(line.column);
        }
        //判断child是否为react组件注入对应column属性,但不注入到嵌套的grid组件中
        // console.log('--columns--',columns);
        let wrappedChildren=React.Children.map(children,function (child,index) {
            return <div key={index}
                        style={{
                            'width':(!linefeed? (100/count+'%') : (100/(columns?columns:line.column)+'%')),
                            'borderRight':border?
                                ((linefeed
                                    &&
                                    ((pyramid&&((index>lessLineCount&&(index+1-lessLineCount)%(columns?columns:line.column)===0) || (!equal&&(index+1===lessLineCount))))
                                    ||
                                    (!pyramid&&((index+1)%(columns?columns:line.column)===0 || (!equal&&(index+1 ===count))))))?(columns&&columns>count?'1px solid #D8D8D8':''):'1px solid #D8D8D8')
                                :'',
                            'borderTop':border?'1px solid #D8D8D8':'',
                        }}>
                {child&&typeof child.type ==='function'&&child.type.name!=='Grid'?React.cloneElement(child,{columns:columns ? columns : line.column}):child}
            </div>
        });
        //上半部分
        let topChildren=linefeed?wrappedChildren.slice(0,pyramid?lessLineCount:wrappedChildren.length-lessLineCount):wrappedChildren;
        if(linefeed&&pyramid&&equal&&lessLineCount>0){//此处处理border参数为true且有一行元素未填满时，填充空div保持边框完整
            for(let i=0;i<(columns?columns : line.column)-lessLineCount;i++){
                topChildren.push(
                    <div key={'top'+i}
                         style={{
                             'borderRight':'none',
                         }}>
                    </div>
                );
            }
        }
        //下半部分
        let bottomChildren=linefeed?wrappedChildren.slice(pyramid?lessLineCount:wrappedChildren.length-lessLineCount,wrappedChildren.length):null;
        if(linefeed&&!pyramid&&equal&&lessLineCount>0){//此处处理border参数为true且有一行元素未填满时，填充空div保持边框完整
            for(let i=0;i<((columns?columns : line.column)-lessLineCount);i++){
                bottomChildren.push(
                    <div key={'bottom'+i}
                         style={{
                             'borderRight':'none',
                             'borderTop':columns&&columns>count?'':(border?'1px solid #D8D8D8':''),
                             'width':(100/(columns?columns:line.column))+'%'
                         }}>
                    </div>
                );
            }
        }
        let singleLineWidth=!linefeed&&count>(columns?columns:4)?((100+(count-(columns?columns:4))*(columns?parseInt(100/columns,10):25))+'%'):'100%';
        return (
            <div className={classNames(style.box,{[style.scrollBox]:!linefeed})}>
                {React.Children.count(topChildren)>0&&
                <div style={{'width':singleLineWidth}}
                     className={classNames({[style.flex]:columns?(columns<=count &&(!equal&&pyramid&&lessLineCount>0)):(!equal&&pyramid&&lessLineCount>0)})}>
                    {topChildren}
                </div>}
                {linefeed&&React.Children.count(bottomChildren)>0&&
                <div className={classNames({[style.flex]:columns?(columns<=count &&(!equal&&!pyramid&&lessLineCount>0)):(!equal&&!pyramid&&lessLineCount>0)})}>
                    {bottomChildren}
                </div>}
            </div>
        );
    }
}
export default Grid;
