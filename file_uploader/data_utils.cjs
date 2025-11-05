
class Queue{
    constructor(){
        this.queue = [];
    }

    enqueue(object){
        this.queue.push(object);
    }

    dequeue(){
        return this.queue.length > 0 ? this.queue.shift() : null;
    }

    peek(){

        return this.queue.length > 0 ? this.queue[0] : null;
    }

    length(){
        return this.queue.length;
    }

}

module.exports = {Queue};