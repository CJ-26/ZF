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
     //为何不能  let promise2 = new Promise((resolve,reject)=>{ resolve(x)}这样写而将then中的逻辑再用new Promise包起来因为上次then中return的值是拿不到的，而new Promise中的逻辑会立即执行所以就这样包起来写了，在去拿返回值
    let promise2 = new Promise((resolve,reject)=>{  
      if (this.status === STATUS.fulfilled) {  // 成功状态时
        try { //用于第二次then的时候捕获异常如果异常走reject()，否则走resolve()
          let x = onfulfilled(this.value);  // 调用成功执行的函数
          resolve(x);
        } catch (e) {
          reject(e);
        }
      }
      if (this.status === STATUS.rejected) { //失败状态时：
        try {  //用于第二次then的时候捕获异常如果异常走reject()，否则走resolve()
          let x = onRejected(this.reason);  //调用失败的函数
          resolve(x);
        } catch (e) {
          reject(e);
        }
      }
      if(this.status===STATUS.pending){  //  pending状态时
        //订阅，成功和失败的方法
           this.onResolvedCallback.push(()=>{ // 储存成功的函数，当状态为成功的时候在去调用；   // 为何 this.onResolvedCallback.push(()=>{ onfulfilled()})而不是this.onResolvedCallback.push(onfulfilled)直接push 因为这样写的原因是还可以在onfulfilled执行之前在添加别的逻辑(切片模式)
            // 可以写其它逻辑 之后在执行 onfulfilled
            try{   //用于第二次then的时候捕获异常如果异常走reject()，否则走resolve()
              let x = onfulfilled(this.value)
              resolve(x)
            }catch(e){
                reject(e)
            }
          
           })
           this.onRejectedCallback.push(()=>{   // 储存失败的函数，当状态为失败的时候在在执行
             try{ //用于第二次then的时候捕获异常如果异常走reject()，否则走resolve()
              let x =onRejected(this.reason)
              resolve(x)
             }catch(e){
               reject(e)
             }
             
           })
      }
    })
    return promise2
  }
}

export default Promise;
