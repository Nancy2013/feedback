import React from 'react';
import style from './LoadingPage.less';

class LoadingPag extends React.Component {
    render() {
        return (
               <div className={style.box}>
                   <div className={style.loadBox}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
               </div>
        )
    }
}
export default LoadingPag;