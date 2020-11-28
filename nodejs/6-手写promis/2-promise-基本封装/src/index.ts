// Promise的三中状态
const enum STATUS {
  pending = "PENDING",
  fulfilled = "FULFILLED",
  rejected = "REJECTED",
}

class Promise {
  status: STATUS;
  value: any;
  reason: any;
  onResolvedCallback:Function[];
  onRejectedCallback:Function[];
    constructor(executor) {
    this.status = STATUS.pending; // 默认为pending 状态
    this.value = undefined; //成功的值
    this.reason = undefined; //失败的值
    this.onResolvedCallback = [];  // 当为pending状态的时候将成功的resolve函数存起来（发布订阅模式）                                                                                                          
    this.onRejectedCallback = [];   //当为pending状态的时候将失败的reject函数存起来 （发布订阅模式） 
    
    const resolve = (value?:any) => {//成功调用函数
      if(this.status === STATUS.pending){  //只有在pending状态下才能修改状态
        this.status = STATUS.fulfilled;  // 调用成功resolve函数 改变状态为，成功态 fulfilled
        this.value = value       // 赋成功值
        this.onResolvedCallback.forEach(fn=>fn())  //发布成功的方法
      }
    };
    const reject = (reason?:any) => {   //失败调用函数
      if(this.status === STATUS.pending){  //只有在pending状态下才能修改状态
        this.status = STATUS.rejected;  // 调用失败reject函数 改变状态为，失败态 rejected
        this.reason = reason    //赋失败值
        this.onRejectedCallback.forEach(fn=>fn()) //发布失败的方法
      }
    };
        try {  // 当   executor(resolve, reject);执行异常的时候走下面的catch （例如  executor方法种有  throw new Error()就会走catch）
          executor(resolve, reject); //  executor为new Promise传入的函数 (new Promise((resolve,reject)=>{}))
          /*这里的executor就是new Promise((res,rej)=>{}) 的(res,rej)=>{},
         用try...catch包裹是因为当出现new Promise((res,rej)=>{throw new Error('异常')})的时候捕获错误传给reject，
         但是try..catch是捕获不了异步错误的例如：
         new Promise((res,rej)=>{ setTimeout(()=>{throw new Error('异常')})})
          如果这中情况程序将终止报错，原因就是try..catch是捕获不了异步错误
           */
		} catch (e) {
          reject(e); // 如果抛出异常直接调用reject
        }
  }
  then(onfulfilled,onRejected){
    if(this.status === STATUS.fulfilled){
      onfulfilled(this.value)
    }
    if(this.status === STATUS.rejected){
      onRejected(this.reason)
    }
    if(this.status===STATUS.pending){
      //订阅，成功和失败的方法
         this.onResolvedCallback.push(()=>{    // 为何 this.onResolvedCallback.push(()=>{ onfulfilled()})而不是this.onResolvedCallback.push(onfulfilled)直接push 因为这样写的原因是还可以在onfulfilled执行之前在添加别的逻辑(切片模式)
          // 可以写其它逻辑 之后在执行 onfulfilled
         onfulfilled(this.value)
         })
         this.onRejectedCallback.push(()=>{
           onRejected(this.reason)
         })
    }
  }
}

export default Promise;
