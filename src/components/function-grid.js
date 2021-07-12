import React from 'react';
import PropTypes from 'prop-types';
import Grid from './Grid';
import JDGridItem from './jd/GridItem';
import GomeGridItem from './dna/GridItem';
import DnaGridItem from './gome/GridItem';
import sdk from 'broadlink-jssdk';
const GridItem = {'jd': JDGridItem ,'gome': GomeGridItem ,'dna': DnaGridItem }[sdk.platform];
export default function (param/*参数名*/,stateMap,extraCmdMap=new Map()){

    return class extends React.PureComponent{
        /*
        * 支持Grid以及GridItem所有参数
        */
        static propTypes = {
            disabledValues:PropTypes.array,
            //整体disable ,如为true，忽略disabledValues这个参数
            disable:PropTypes.bool,
            value:PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number
            ]),
            onClick:PropTypes.func,
            checkCurrent:PropTypes.bool
        };
        static defaultProps = {
            disabledValues:[]
        };

        itemClick = (value)=>{
            const {checkCurrent,onClick} = this.props;
            // debugger
            const command = {[param]:value,...extraCmdMap[value]};
            if(checkCurrent){
                if(value !== this.props.value){
                    onClick && onClick(command,param,value);
                }
            }else{
                onClick && onClick(command,param,value);
            }

        };

        render(){
            const {disable,disabledValues,value,onClick,checkCurrent,...rest} = this.props;
            const nodeArray =[];
            /*
                Map type 1:(纯文字)
                1:'mode1',2:'mode2',...

                Map type 2:(图片与文字)
                1:{
                    text:'model',
                    img:'image1'
                }
            */
            stateMap.forEach((mapUnit, key) => {
                let isPureText=typeof mapUnit==='string';
                nodeArray.push(<GridItem { ...rest}
                                         key={key}
                                         disable={disable||disabledValues.indexOf(key)>=0}
                                         text={isPureText?mapUnit:mapUnit['text']}
                                         svg={isPureText?undefined:mapUnit['img']}
                                         on={key===value}
                                         onClick={() => this.itemClick(key)} />);
            });
            return (
                <Grid { ...rest}>
                    {nodeArray}
                </Grid>
            )
        }
    }
}
