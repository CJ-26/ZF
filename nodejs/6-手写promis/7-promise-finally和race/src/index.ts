type resolveFn = (value?: any) => void;
type rejectFn = (reason: any) => void;
interface IpromiseParam {
  (resolve: resolveFn, reject: rejectFn): void;
}

// Promise的三中状态
const enum STATUS {
  pending = "PENDING",
  fulfilled = "FULFILLED",
  rejected = "REJECTED",
}
//判断是不是promise
function isPromise(x) {
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    if (typeof x.then === "function") {
      return true;
    }
  } else {
    return false;
  }
}

// 处理如果第一次then返回的是一个promise，核心逻辑解析x的类型来决定promise2返回成功还是失败
function resolvePromise(
  promise2: Promise,
  x: any,
  resolve: resolveFn,
  reject: rejectFn
): void {
  //判断x的值决定promise的关系，（注意x有可能是别人的promise,也就是说then中可以返回别人的promise，但如果是别人的promise就有可能会出现问题）
  if (x === promise2) {
    // promise A+ 规定如果then返回的promise于promise2相同则抛出一个类型错误
    return reject(new TypeError("出错了"));
  }
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    // 这个判断条件考虑到了被人的promise(typeof x==='object' && x !== null) || typeof x === 'function'因为我自己写的promise为对象，但是别人写的有可能是函数，（promise A+ 中写道promise可以是对象也可以是函数）
    //根据 promise A+ 中规定promise只能是对象或者是函数，也就是说只有 (typeof x==='object' && x !== null) || typeof x === 'function'这个条件x才有可能是promise
    let called = false; //为保证promise的状态是不可逆的开关（主要是为了防止then里面返回的promise有可能不是自己的,因为不是自己的那就没办法确定他人的promise的状态是否可逆，所以要设置开关，如果调了一次成功就不能在调成功或者失败了，同理如果调了失败就不能在调一次失败或者成功）
    try {
      // 为何取then要捕获异常那，如果返回的对象是这样的：let obj={} Object.defineProperty(obj,'then',{get(){throw new Error("出错了")}}) 返回这样的obj对象肯定就出现异常了
      let then = x.then;
      if (typeof then === "function") {
        //判断then为一个函数；
        // 并且调用x的then传入y为成功的值传入r为失败的值，但为何是这种写法then.call(x,y=>{},x=>{})而不是x.then(y=>{},r=>{}),因为在上面有 let then = x.then进行了异常捕获了一次，如果这使用x.then如果传入的对象的为let obj={} let index=0 Object.defineProperty(obj,'then',{get(){ index++ if(index==2){throw new Error("出错了")}}})第一次取没有报错但第二次在取就报错了，所以x.then着这样调用有可能会出现异常；
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true; // 开关，调了成功就不能调失败，也不能再次调成功
            // 如果这个y还是promise那，所以就要递归调用resolvePromise解析y 直到为普通值位置
            resolvePromise(promise2, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true; //开关如果调了失败就不能在调成功或者在调一次失败
            reject(r); //失败是不用在解析判断是不是promise的因为已经都失败了，所以就没必要在继续了
          }
        );
      } else {
        // 如果不是一个函数那就是普通值了，普通值直接resolve就可以了
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true; //开关如果异常调了失败就不能在调成功或者在调一次失败
      reject(e);
    }
  } else {
    // 如果x不是对象也不是函数，那只能是一个普通值(promise A+中规定如果是普通值，将这个值做为成功参数传入)
    resolve(x);
  }
}

class Promise {
  static deferred;
  status: STATUS;
  value: any;
  reason: any;
  onResolvedCallback: Function[];
  onRejectedCallback: Function[];
  constructor(executor: IpromiseParam) {
    this.status = STATUS.pending; // 默认为pending 状态
    this.value = undefined; //成功的值
    this.reason = undefined; //失败的值
    this.onResolvedCallback = []; // 当为pending状态的时候将成功的resolve函数存起来（发布订阅模式）
    this.onRejectedCallback = []; //当为pending状态的时候将失败的reject函数存起来 （发布订阅模式）

    const resolve = (value?: any) => {
      //成功调用函数
      if (value instanceof Promise) {
        /*
      value instanceof Promise（这里的Promise就是上面class Promise）的意思就是判断value是不是自己的promise
      instanceof的用法  class App{}; let a = new App()  console.log(a instanceof App) 输出为true
      为何要加这个判断：
      例如：
      const promise= new Promise((resolve,reject)=>{
       resolve(new Promise((resolve,reject)=>{
           resolve("ok")
         }))}).then((data)=>{ console.log(data)}) 打应出来的是第一给resolve中传的 new Promise而不是ok
        因为resolve的时候， 将new Promise()传给了promise中resolve方法并执行，执行resolve先 改变状态成fulfilled成功态后，将传竟来的 new Promise直接赋给this.value之后then的时候发现为成功态
        就直接将this.value传给了成功的回调所以输出的不是ok而是Promise
        
        所以这里判断是不是自己的promise，为和不判断是不是别人的promise，因为promise A+ 规范中规定不用判断是不不是别人的promise
        
        如果是自己的promise 则调用该promise的then，将 该promise的resolvehereject两个方法传入
        它的then中，执行then方法是会调用传入的resolve后者是rejec只要看传入的promis里调用的是哪个了，
        调用之后，就会改变状态为fulfilled或者为 rejected，在将传入的promise里执行的resolve或者是
        reject中的参数赋值给this.value这样在then的时候就不会打印出传入的Promise而是ok
        因为时新传入的promise，此时的状态为prending，

       将 return value.then(resolve, reject)写着这里 也就是递归调用了resolve方法解析resolve中传进来的promise（因为当前的方法就是reslve，在reslve中在调用reslve肯定是递归呀）
        这就在resolve方法中有了这样的一行代码：if(value instanecof Promise){return value.then(resole,reject)}
       value.then(resolve, reject); //这里的resolve和reject就是class Promise{}中的resolve和reject方法
      */
        return value.then(resolve, reject);
      }
      if (this.status === STATUS.pending) {
        //只有在pending状态下才能修改状态
        this.status = STATUS.fulfilled; // 调用成功resolve函数 改变状态为，成功态 fulfilled
        this.value = value; // 赋成功值
        this.onResolvedCallback.forEach((fn) => fn()); //发布成功的方法
      }
    };
    const reject = (reason?: any) => {
      //失败调用函数

      /*
      resolve方法中判断了是否传入的自己的promise但是这
      这里不用判断，因为reject是失败函数，都失败了还判断个球呀；
    */
      if (this.status === STATUS.pending) {
        //只有在pending状态下才能修改状态
        this.status = STATUS.rejected; // 调用失败reject函数 改变状态为，失败态 rejected
        this.reason = reason; //赋失败值
        this.onRejectedCallback.forEach((fn) => fn()); //发布失败的方法
      }
    };
    try {
      // 当   executor(resolve, reject);执行异常的时候走下面的catch （例如  executor方法种有  throw new Error()就会走catch）
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
  then(onfulfilled?, onRejected?) {
    //? 表示这个参数可传 ，可不传。(promise A+ 规定then的两个参数可传可不传)
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
    onfulfilled =
      typeof onfulfilled === "function" ? onfulfilled : (val) => val;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (err) => {
            throw err;
          };

    //为何不能  let promise2 = new Promise((resolve,reject)=>{ resolve(x)}这样写而将then中的逻辑再用new Promise包起来因为上次then中return的值是拿不到的，而new Promise中的逻辑会立即执行所以就这样包起来写了，在去拿返回值
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === STATUS.fulfilled) {
        // 成功状态时
        setTimeout(() => {
          //setTimeout的作用是 在调用resolvePromise(promise2,x,resolve,reject) 拿到promise2
          try {
            //用于第二次then的时候捕获异常如果异常走reject()，否则走resolve()
            let x = onfulfilled(this.value); // 调用成功执行的函数
            resolvePromise(promise2, x, resolve, reject); //resolvePromise的作用是处理当第一个then返回一个promise的时候下一个then接受上一个then中返回的promise的成功或者失败的值；
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      if (this.status === STATUS.rejected) {
        //失败状态时：
        setTimeout(() => {
          //setTimeout的作用是 在调用resolvePromise(promise2,x,resolve,reject) 拿到promise2
          try {
            //用于第二次then的时候捕获异常如果异常走reject()，否则走resolve()
            let x = onRejected(this.reason); //调用失败的函数
            resolvePromise(promise2, x, resolve, reject); //resolvePromise的作用是处理当第一个then返回一个promise的时候下一个then接受上一个then中返回的promise的成功或者失败的值；
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      if (this.status === STATUS.pending) {
        //  pending状态时
        //订阅，成功和失败的方法
        this.onResolvedCallback.push(() => {
          // 储存成功的函数，当状态为成功的时候在去调用；   // 为何 this.onResolvedCallback.push(()=>{ onfulfilled()})而不是this.onResolvedCallback.push(onfulfilled)直接push 因为这样写的原因是还可以在onfulfilled执行之前在添加别的逻辑(切片模式)
          // 可以写其它逻辑 之后在执行 onfulfilled
          setTimeout(() => {
            //setTimeout的作用是 在调用resolvePromise(promise2,x,resolve,reject) 拿到promise2
            try {
              //用于第二次then的时候捕获异常如果异常走reject()，否则走resolve()
              let x = onfulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject); //resolvePromise的作用是处理当第一个then返回一个promise的时候下一个then接受上一个then中返回的promise的成功或者失败的值；
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.onRejectedCallback.push(() => {
          // 储存失败的函数，当状态为失败的时候在在执行
          setTimeout(() => {
            //setTimeout的作用是 在调用resolvePromise(promise2,x,resolve,reject) 拿到promise2
            try {
              //用于第二次then的时候捕获异常如果异常走reject()，否则走resolve()
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject); //resolvePromise的作用是处理当第一个then返回一个promise的时候下一个then接受上一个then中返回的promise的成功或者失败的值；
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });
    return promise2;
  }
  catch(errfn) {
    return this.then(null, errfn);
  }
  finally(callback) {
    /*
     finally可以链式所以会返回一个prmise，then方法也会返回
     所以return this.then
     不过promise成功还是失败都会走所以传进来的callback在then成功和失败的回调中都要执行
     //同时finally有等待的效果要等它执行完在继续执行，只有Peomise.resolve有等待效果
     所以将callback()丢到Peomise.resolve里面
     
     当finally中的不回只或者普通值或者promise但是调用成功的promise，都不会对后续逻辑影响，也就是
     finally后续的then的成功或者失败的值与没有finally的情况一样的
     所以 下面的这行代码中Promise.resolve(callback()).then(()=>data)的then是将上一次的值传下去，这个
     then执行的是成功的回调，传入下次then的成功的回调中

     但是当finally中返回的promise中调用的时reject会将失败的原因传入下一次
      then的失败的回调中代码中 Promise.resolve(callback()).then(()=>{throw err})
      的then(()=>{throw err}执行的虽然是成功的回调但是throw为抛出一个异常
      异常就会传递到下一次的then中的失败的回调中，
    */
    return this.then(
      (data) => {
        return Promise.resolve(callback()).then(() => data);
      },
      (err) => {
        return Promise.resolve(callback()).then(() => {
          throw err;
        });
      }
    );
  }
  static all(values) {
    return new Promise((resolve, reject) => {
      let arr = [];
      let times = 0;
      values.forEach((value, index) => {
        if (isPromise(value)) {
          value.then((y) => {
            arr[index] = y;
            if (++times === values.length) {
              //这里只能用计数器来判断如果
              //这样用返回的数组的长度来判断将会出错例如if(arr.length===values.length){}
              //因为返回的值要和传入的promise一一对应所以arr的赋值方式是以下标赋值的
              //这也就和导致当我赋最后一个值的时候前面的不管赋没赋值此数组的长度都会与传入的的promise数组的长度相同；
              //例如：出入的数组为[prmise1,prmise2,1,2] 前两项是promise后两项时普通值
              //循环为异步并行也就是说先将1赋给arr的第2项在将2赋给arr的最后一项，这个时候arr的长度已经和values的长度相同了
              //就返回了
              //例如：
              // let list = [] let list1 = [1,2,4], list[2] = 5 ,console.log(list.length===list1) 输出为true
              resolve(arr);
            }
            /*
              下面的reject的就是当前promise中的reject方法(当前promise的方法就是返回给all的promise的方法)
              当传入的promise有一个是失败all方法就会抛出这个错误，原理：
              传入的promise数组循环调用个自then方当有一个抛错，走它本身then的
               失败的方法发，这个给该promise的then传入的失败的方法就是要放回给
               all方法的promise中的reject方，也就是当传入的promise为失败的就调用all的rject方法
              
               但如果有多个失败的为什么只走了第一那，上面的forEach的循环并没有停止呀为什么不走最后一个？
               因为失败调用的方法为返回给all的promise中的reject方法，所以多个失败也是调
               用同一个reject方法，但是promise的状态是不可逆，已经有了一个失败的状态
               不可能在走失败后者成功的方法了；所以即使循环么有停止也不会执行下一个失败的了
              */
          }, reject);
        } else {
          arr[index] = value;
          if (arr.length === values.length) {
            resolve(arr);
          }
          // if(++times===values.length){
          //   resolve(arr)
          // }
        }
      });
    });
  }
  static resolve(val) {
    return new Promise((resolve, reject) => {
      resolve(val);
    });
  }
  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason);
    });
  }
  static race(val) {
    return new Promise((resolve, reject) => {
      val.forEach((v, i) => {
        if (isPromise(v)) {
          v.then((y) => {
            if (i === 0) {
              resolve(resolve(y));
            }
          }, reject);
        } else {
          return resolve(v);
        }
      });
    });
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
interface Idfd {
  promise: Promise;
  resolve: (val: any) => any;
  reject: (val: any) => any;
}
Promise.deferred = function () {
  let dfd = {} as Idfd;
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};
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
