export default class {

    constructor(){
        this.started = false;
        this.isStopped = false;
    }

    run(){}

    /*It is never legal to start a thread more than once.
    In particular, a thread may not be restarted once it has completed execution.*/
    start(){
        if(!this.started){
            this.result = this.run();
            this.started = true
        }
    }

    getResult(){
        return this.result;
    }


    stop(){
        this.isStopped = true
    }

}