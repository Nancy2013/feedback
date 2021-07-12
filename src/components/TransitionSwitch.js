import {
    Switch,
} from 'react-router-dom'
import React from 'react';
import device from './device'

import { CSSTransition,Transition,TransitionGroup } from 'react-transition-group'

const duration = 100;

const childFactoryCreator = (classNames) => (
    (child) => (
        React.cloneElement(child, {
            classNames
        })
    )
);

let lastLocation;
const isBelowAndroid5=device.isBelowAndroid5();
export default function ({level ,location ,history, children}){
    const classNames = history.action === 'POP'? 'exit':'enter';

    let local;
    if(history.action === 'REPLACE'){
        local = lastLocation;
    }else{
        local = location;
        lastLocation = location;
    }

    return (
        <TransitionGroup style={{height:'100%'}}  childFactory={childFactoryCreator(classNames)}>
            {
                isBelowAndroid5&&
                <Transition>
                    <Switch location={location}>
                        {children}
                    </Switch>
                </Transition>
            }
            {
                !isBelowAndroid5&&
                <CSSTransition
                    key={local.pathname.split('/')[level] || '/'}
                    classNames={classNames}
                    timeout={duration}
                    mountOnEnter={true}
                    unmountOnExit={true}
                >
                    <Switch location={location}>
                        {children}
                    </Switch>

                </CSSTransition>
            }
        </TransitionGroup>
    )
}