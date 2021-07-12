import React from 'react';
// import PropTypes from 'prop-types';
import ismobilejs from 'ismobilejs'

const MutexSlipItem = (WrappedComponent,mutexClassName) => {
    let scroller = {}, forbidScrolling,scrollerHide;
    return class extends React.Component {

        onTouchStart = (event) => {
            this.scrollTouchStart(event,mutexClassName)
        }

        onTouchEnd = (event, index) => {
            this.scrollTouchEnd(event, index,mutexClassName)
        }
        checkTouches = (touches) => {
            // console.debug(touches, "touches",touches.length > 1&&"禁止多个手指触碰")
            return touches && touches.length > 1;
        }
        setRightElementDisplay=(display)=>{
            scrollerHide=display;
            const {itemIndex}=this.props;
            const deleteButton = document.getElementsByClassName(mutexClassName)[itemIndex]
            deleteButton&&(deleteButton.style.display=display?"none":"");
        }
        checkScrollHideStateOnTouchStart = () => {
          
            if (scroller && scroller.scrollLeft) {
                scroller.scrollLeft = 0;
                this.resetLeft = true;
                this.setRightElementDisplay(true)
            } else if (scrollerHide) {
                this.setRightElementDisplay(false)
                this.resetLeft = false;
            }
        }
        scrollTouchStart = (event,mutexClassName) => {
            if (event.touches) {
                forbidScrolling = this.checkTouches(event.touches);
                if (forbidScrolling) return;
            }
            if (mutexClassName&&event.target.className === mutexClassName) {
                return;
            }
            const { clientX } = event.touches[0];
            this.scrollerStartX = clientX;
            this.checkScrollHideStateOnTouchStart();
        }
        scrollTouchEndAnimate = (event, index,mutexClassName) => {
            if (mutexClassName&&scroller && scroller.scrollLeft > 0) {
                const { clientX } = event.changedTouches[0]
                const isLeft = clientX < this.scrollerStartX;
                const deleteButton = document.getElementsByClassName(mutexClassName)[index]
                const deleteWidth = deleteButton && parseInt(window.getComputedStyle(deleteButton).width, 10)
                if (isLeft && scroller.scrollLeft > deleteWidth / 3) {
                    scroller.scrollLeft = deleteWidth;
                } else {
                    scroller.scrollLeft = 0;
                }
            }
        }
        repairScrollerStateOnAppleTouchEnd = () => {
            if (ismobilejs.apple.phone && scroller && scroller.scrollLeft === 0 && scrollerHide) {
                this.setRightElementDisplay(false)
            }
        }
        scrollTouchEnd = (event, index,mutexClassName) => {
            this.scrollTouchEndAnimate(event, index,mutexClassName)
            this.repairScrollerStateOnAppleTouchEnd();
        }
        scroll = (event, key) => {
            if(scrollerHide)return
            if (forbidScrolling) return
            if (!scroller) {
                scroller = event.target
            } else if (scroller !== event.target) {
                scroller.scrollLeft = 0;
                scroller = event.target;
            }
            // scroller && console.log(scroller.scrollLeft, key, scroller, "scroll")
        }

        eventLog(fn, ...rest) {
            // console.log(`${rest[rest.length - 1]},${scrollerHide},${scroller && scroller.scrollLeft},eventLog2`, scroller)
            if (rest[rest.length - 1] === "onclick") {
                if (this.checkScrollStateOnClick()) {
                    fn.apply(this, rest);
                }
            } else {
                fn.apply(this, rest);
            }
        }

        checkScrollStateOnClick = () => {
            let result = true;
            if (scroller) {
                if (this.resetLeft || scroller.scrollLeft) {
                    result = false
                    if (this.resetLeft) this.resetLeft = false;
                    if (scroller.scrollLeft) scroller.scrollLeft = 0;
                }
            }
            return result
        }
        render() {
            const {  itemIndex, onClick, ...rest } = this.props
            
            return <div  onTouchStart={(event) => this.eventLog(this.onTouchStart, event, "onTouchStart")}
            onTouchEnd={(event) => this.eventLog(this.onTouchEnd, event, itemIndex, "onTouchEnd")}
            onScroll={(event) => this.eventLog(this.scroll, event, itemIndex, "onScroll")}
          >
                <WrappedComponent onClick={() => this.eventLog(onClick, "onclick")}  {...rest}></WrappedComponent>
            </div>
        }
    }

}
export default MutexSlipItem;