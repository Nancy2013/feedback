import React from 'react';

const imgWidth = [
    {
        width:"100%"
    },
    {
        width:"99.99999%"
    }
];
export default class extends React.PureComponent {
    lastWidth=0;
    componentWillReceiveProps(nextProps) {
        if(nextProps.src!==this.props.src){
            this.lastWidth = this.lastWidth===0?1:0;
        }
    }

    render() {
        const {style,...rest} = this.props
        return (
            <img {...rest} style={{...style,...imgWidth[this.lastWidth]}} alt=""/>
        );
    }
}
