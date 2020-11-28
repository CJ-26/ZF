type  resolveFn =(value?:any)=>void;
type  rejectFn  = (reason:any)=>void
interface IpromiseParam {
   (resolve:resolveFn,reject:rejectFn):void;
}


// Promise的三中状态
const enum STATUS {
  pending = "PENDING",
  fulfilled = "FULFILLED",
  rejected = "REJECTED",
}
//判断是不是promise
function isPromise(x){
  if((typeof x==='object' && x !== null) || typeof x === 'function'){ 
    if(typeof x.then === "function"){
         return true
    }
  }else{
    return false
  }
}

// 处理如果第一次then返回的是一个promise，核心逻辑解析x的类型来决定promise2返回成功还是失败
function resolvePromise(promise2:Promise,x:any,resolve:resolveFn,reject:rejectFn):void{
    //判断x的值决定promise的关系，（注意x有可能是别人的promise,也就是说then中可以返回别人的promise，但如果是别人的promise就有可能会出现问题）
   if(x===promise2){ // promise A+ 规定如果then返回的promise于promise2相同则抛出一个类型错误
     return reject(new TypeError('出错了'))
   }
   if((typeof x==='object' && x !== null) || typeof x === 'function'){ // 这个判断条件考虑到了被人的promise(typeof x==='object' && x !== null) || typeof x === 'function'因为我自己写的promise为对象，但是别人写的有可能是函数，（promise A+ 中写道promise可以是对象也可以是函数）
        //根据 promise A+ 中规定promise只能是对象或者是函数，也就是说只有 (typeof x==='object' && x !== null) || typeof x === 'function'这个条件x才有可能是promise
         let called = false; //为保证promise的状态是不可逆的开关（主要是为了防止then里面返回的promise有可能不是自己的,因为不是自己的那就没办法确定他人的promise的状态是否可逆，所以要设置开关，如果调了一次成功就不能在调成功或者失败了，同理如果调了失败就不能在调一次失败或者成功）
        try{  // 为何取then要捕获异常那，如果返回的对象是这样的：let obj={} Object.defineProperty(obj,'then',{get(){throw new Error("出错了")}}) 返回这样的obj对象肯定就出现异常了
           let then = x.then
           if(typeof then === "function"){ //判断then为一个函数；
             // 并且调用x的then传入y为成功的值传入r为失败的值，但为何是这种写法then.call(x,y=>{},x=>{})而不是x.then(y=>{},r=>{}),因为在上面有 let then = x.then进行了异常捕获了一次，如果这使用x.then如果传入的对象的为let obj={} let index=0 Object.defineProperty(obj,'then',{get(){ index++ if(index==2){throw new Error("出错了")}}})第一次取没有报错但第二次在取就报错了，所以x.then着这样调用有可能会出现异常；
             then.call(x,y=>{
                 if(called) return;
                  called=true; // 开关，调了成功就不能调失败，也不能再次调成功
                  // 如果这个y还是promise那，所以就要递归调用resolvePromise解析y 直到为普通值位置
                  resolvePromise(promise2,y,resolve,reject)
             },r=>{
               if(called)return
               called = true; //开关如果调了失败就不能在调成功或者在调一次失败
               reject(r)  //失败是不用在解析判断是不是promise的因为已经都失败了，所以就没必要在继续了
             })
           }else{
             // 如果不是一个函数那就是普通值了，普通值直接resolve就可以了 
             resolve(x)
           }
        }catch(e){
          if(called)return
          called = true; //开关如果异常调了失败就不能在调成功或者在调一次失败
          reject(e)
        }
      }else{
      // 如果x不是对象也不是函数，那只能是一个普通值(promise A+中规定如果是普通值，将这个值做为成功参数传入)
      resolve(x)
   }
  }



class Promise {
  static deferred;
  status: STATUS;
  value: any;
  reason: any;
  onResolvedCallback:Function[];
  onRejectedCallback:Function[];
    constructor(executor:IpromiseParam) {
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
  then(onfulfilled?,onRejected?){  //? 表示这个参数可传 ，可不传。(promise A+ 规定then的两个参数可传可不传)
    /* promise A+ 中规定then的参数可传可不传,
    在不传的情况下将会有then穿透例如：
     new Promise((resolve,reject)=>{ resolve("成功")}).then().then().then((res)=>{console.log(res)}) 将会输出成功，
     所以要判断是否传了参，如果表示成功函数没有传(onfulfilled),将赋给表示成功的参参数一个有返回值的函数例如：onfulfilled=val=>val，因为在传参的情况下就是传进来一个函数，但有穿透就的有return了
     如果失败的函数没有传，则将表示失败的参数(onRejected),赋给一个抛出错误的函数onRejected:err=>{throw err} 
     throw:
     throw 语句抛出一个错误。当错误发生时， JavaScript 会停止执行并抛出错误信息,抛出的异常。可以是字符串、数字、逻辑值或对象。
     为何throw会终止程序，还要onRejected:err=>{throw err}因为代码中有这样的逻辑：
                try{ 
                let x =onRejected(this.reason)
                resolvePromise(promise2,x,resolve,reject)
               }catch(e){ 
                 reject(e)
               }
           catch会捕获throw抛出的错误，并将这个错误传给catch的参数：例如：
           try{
             throw "异常了了了了"
           }catch(e){
             console.log(e) // 出输出:异常了了了了
           }  
          所以throw会配合try{}catch(e){}来使用，就不会终止程序了   
    */ 
    onfulfilled = typeof onfulfilled ==="function"?onfulfilled:val=>val;
    onRejected = typeof onRejected==="function"?onRejected:err=>{throw err};
    
    //为何不能  let promise2 = new Promise((resolve,reject)=>{ resolve(x)}这样写而将then中的逻辑再用new Promise包起来因为上次then中return的值是拿不到的，而new Promise中的逻辑会立即执行所以就这样包起来写了，在去拿返回值
    let promise2 = new Promise((resolve,reject)=>{  
      if (this.status === STATUS.fulfilled) {  // 成功状态时
        setTimeout(()=>{   //setTimeout的作用是 在调用resolvePromise(promise2,x,resolve,reject) 拿到promise2
          try { //用于第二次then的时候捕获异常如果异常走reject()，否则走resolve()
            let x = onfulfilled(this.value);  // 调用成功执行的函数
            resolvePromise(promise2,x,resolve,reject)    //resolvePromise的作用是处理当第一个then返回一个promise的时候下一个then接受上一个then中返回的promise的成功或者失败的值；
          } catch (e) {
            reject(e);
          }
        },0)
      }
      if (this.status === STATUS.rejected) { //失败状态时：
        setTimeout(()=>{  //setTimeout的作用是 在调用resolvePromise(promise2,x,resolve,reject) 拿到promise2
          try {  //用于第二次then的时候捕获异常如果异常走reject()，否则走resolve()
            let x = onRejected(this.reason);  //调用失败的函数
            resolvePromise(promise2,x,resolve,reject) //resolvePromise的作用是处理当第一个then返回一个promise的时候下一个then接受上一个then中返回的promise的成功或者失败的值；
          } catch (e) {
            reject(e);
          }
        },0)
      }
      if(this.status===STATUS.pending){  //  pending状态时
        //订阅，成功和失败的方法
           this.onResolvedCallback.push(()=>{ // 储存成功的函数，当状态为成功的时候在去调用；   // 为何 this.onResolvedCallback.push(()=>{ onfulfilled()})而不是this.onResolvedCallback.push(onfulfilled)直接push 因为这样写的原因是还可以在onfulfilled执行之前在添加别的逻辑(切片模式)
            // 可以写其它逻辑 之后在执行 onfulfilled
            setTimeout(()=>{  //setTimeout的作用是 在调用resolvePromise(promise2,x,resolve,reject) 拿到promise2
              try{   //用于第二次then的时候捕获异常如果异常走reject()，否则走resolve()
                let x = onfulfilled(this.value)
                resolvePromise(promise2,x,resolve,reject)//resolvePromise的作用是处理当第一个then返回一个promise的时候下一个then接受上一个then中返回的promise的成功或者失败的值；
              }catch(e){
                  reject(e)
              }
            },0)
           })
           this.onRejectedCallback.push(()=>{   // 储存失败的函数，当状态为失败的时候在在执行
            setTimeout(()=>{  //setTimeout的作用是 在调用resolvePromise(promise2,x,resolve,reject) 拿到promise2
              try{ //用于第二次then的时候捕获异常如果异常走reject()，否则走resolve()
                let x =onRejected(this.reason)
                resolvePromise(promise2,x,resolve,reject)//resolvePromise的作用是处理当第一个then返回一个promise的时候下一个then接受上一个then中返回的promise的成功或者失败的值；
               }catch(e){
                 reject(e)
               }
            },0)
           })
      }
    })
    return promise2
  }
  catch(errfn){
    return this.then(null,errfn)
  }
  static all(values){
     return new Promise((resolve,reject)=>{
       let arr = [];
       let times = 0;
       values.forEach((value,index) => {
          if(isPromise(value)){
            value.then((y)=>{
              arr[index] = y
              if(++times===values.length){  
                //这里只能用计数器来判断如果 
                //这样用返回的数组的长度来判断将会出错例如if(arr.length===values.length){} 
                //因为返回的值要和传入的promise一一对应所以arr的赋值方式是以下标赋值的
                //这也就和导致当我赋最后一个值的时候前面的不管赋没赋值此数组的长度都会与传入的的promise数组的长度相同；
                //例如：出入的数组为[prmise1,prmise2,1,2] 前两项是promise后两项时普通值
                //循环为异步并行也就是说先将1赋给arr的第2项在将2赋给arr的最后一项，这个时候arr的长度已经和values的长度相同了
                //就返回了
                //例如：
                // let list = [] let list1 = [1,2,4], list[2] = 5 ,console.log(list.length===list1) 输出为true
                resolve(arr)
              }
              
            },reject)
          }else{
            arr[index] =value
            console.log("普通")
            if(arr.length===values.length){
              resolve(arr)
            }
              // if(++times===values.length){
              //   resolve(arr)
              // }
          }
       });
     })
  }
}

/*单元测试Premise是否符合规范
用法在premise是需要有一个静态方法deferred(必须叫这个名字)，方法内部有一个对象dfd ,该对象上
有promise属性值为premise的实例，并且dfd上还要有该promise实例上的resolve和reject
具体写法如下：
测试promise和 resolve和reject是否符合规范
需要安装 npm i promises-aplus-tests -g
输入命令 promises-aplus-tests 要测试的文件名
*/
interface Idfd{
  promise:Promise;
  resolve:(val:any)=>any;
  reject:(val:any)=>any
}
Promise.deferred=function(){
  let dfd={} as any 
  dfd.promise = new Promise((resolve,reject)=>{
    dfd.resolve = resolve;
    dfd.reject = reject;
  })
  return dfd
}
export default Promise;



/*
promise链式调用then方法中的thie问题

因为promise中有这样的逻辑(这里只拿成功举例子)： //因为thien返回promise在当链式then的时候，then中的逻辑是将所有的逻辑都包
到了 let promise2 = new Promise((resolve,reject)=>{})的(resolve,reject)=>{。。。逻辑}里了
很容易将(resolve,reject)=>{  this  } 的this就认为是 当前new的promins的this了，但是this吗谁调用就是
谁，例如：
let p1 = new Promise((res,rej)=>{res('成功')}) 
let p2 = p1.then() 因为是p1掉的then所以此时的this为p1，p1.then()有返回了一个新的promis实例给了p2
let p3 = p2.then  因为是p2调用then所以此时then中的this是p2

let index = 0; //标识是判断是哪个App实例
class App {
  constructor(fn) {
    index++;
    console.log(index);
    this.name = "小明";
    this.age = index;
    const c = (val) => {
      this.name = val;
    };
    fn(c);
  }
  then(t, r) {
    let app2 = new App((fn) => {
      console.log(this);
    });
    return app2;
  }
}
let p1 = new App((c)=>{c('小红')})
let p2 = p1.then();
let p3 = p2.then();
输出的顺序：
先打印 ：1  说明： new了一个 App 也就是p1
在打印 2    说明： 又new了一个 App 也就是p2(调了then方法)
在打印 App { name: '小红', age: 1 }    说明第一次调用then 打印this时age为1则this为p1的
在打印 3     说明： 又new了一个 App 也就是p3(又调了then方法)
最后打印 App { name: '小明', age: 2 }    说明 第二次调用then 打印this时 age为2 则this为p2的

*/





































