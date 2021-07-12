
import Button from './Button'
import stateful from '../stateful'

export default function (stateMap,props) {
    const map = new Map();

    stateMap.forEach(function(value, key) {
        if(typeof value === 'string'){
            map.set(key,{image:value})
        }else if(typeof value === 'object'){
            map.set(key,value)
        }
    });

    return stateful(Button,map,props);
}
