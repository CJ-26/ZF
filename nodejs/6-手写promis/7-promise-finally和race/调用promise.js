const Promise = require("./dist/bundle");

/// resolve中一个promise会有等待的效果，因为是resolve中的promise，在源码中的resolve方法中会进行判断resolve是不是传入了一个promise
// const promise= new Promise((resolve,reject)=>{
//   resolve(new Promise((resolve,reject)=>{//resolve出入一个promise有等待效果
//     setTimeout(()=>{
//       resolve("ok")
//     })
//   }))
// })
// promise.then((data)=>{
//   console.log(data)  //  等一秒输出 ：ok
// })

// reject中一个promise是没有等待效果的，因为源码中的reject方法不会去判断传入的是不promise，为何不判断，因为reject为失败的放法，都失败了还判断啥呀；
// const promise1= new Promise((resolve,reject)=>{
//   reject(new Promise((resolve,reject)=>{   // reject传入一个promise没有等待效果的
//     setTimeout(()=>{
//       resolve("ok")
//     })
//   }))
// })
// promise1.then((data)=>{
//   console.log(data)
// },(err)=>{console.log("===err",err)}) // 直接输出不等待1秒 ：==err Promise {}

// promise的静态成功方法
//Promise.resolve("成功").then((res)=>{console.log(res)})  //成功

// promise的静态失败方法
//Promise.reject("失败").then(null,(err)=>{console.log(err)})  //失败

//Promise，原型上的方法 finally的用法：
// 不管成功还是失败或者异常只要调了finally就会走
//finally的后面也是了可以链then的
//finally的返回值不会影响后续的逻辑不但是又一中情况除外，当返回一个失败的promise的时候，就会将这个错误传递到下面的then的失败函数中
//finally没有参数
//finally的后续逻辑要等finally执行完后在执行

// Promise.resolve("122121").finally(()=>{
//   console.log('finally1') //finally1
//   return 12
// }).then((res)=>{
//   console.log(res)  //122121
// })
// Promise.reject("99900").finally(()=>{
//   console.log('finally2'); //finally2
//   return 12
// }) .then(null,(err)=>{
//   console.log(err) //99900
// })

// Promise.resolve("666666").finally(()=>{
//   console.log('finally1') //finally1
//   return new Promise((resolve,reject)=>{
//     setTimeout(()=>{
//       resolve("9977633")
//     },2000)
//   })
// }).then((res)=>{
//   console.log(res)  //延迟两秒 输出：666666
// })

// Promise.resolve("666666").finally(()=>{
//   console.log('finally1') //finally1
//   return new Promise((resolve,reject)=>{
//     setTimeout(()=>{
//       reject("错错错")
//     },2000)
//   })
// }).then((res)=>{

// },(err)=>{console.log("err===err",err)}) //err===err 错错错




// Promise.race() 用法，一个promise数组，不管返回的是成功还是失败的那个先返回就用那个返回的结果,返回的是一个结果不是数组
// let p1 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve("p1p1p1p1p1");
//   }, 2000);
// });
// let p2 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     reject("p2p2p2p2");
//   }, 3000);
// });

// Promise.reca([p1, p2]).then(
//   (res) => {
//     console.log("res--res",res); //res--res p1p1p1p1p1
//   },
//   (err) => {
//     console.log("err--err",err);
//   }
// );


//利用Promise.reca来做延时终止




// promise 超时终断：
let abort
let promise_1 = new Promise((res,rej)=>{
  abort = rej
  setTimeout(()=>{
    res("ook")
  },3000)
})

setTimeout(()=>{
  abort("!!!!超时。。。")
},2000)
promise_1.catch(err=>{console.log(err)}) // !!!!超时。。。




// 当promise执行超过2秒就输出超时
let promise = new Promise((resolve,reject)=>{
  setTimeout(()=>{
    resolve("oook")
  },3000)
})

function wrap(p){
  let abort; //记录 
  let _p = new Promise((resolve,reject)=>{
     abort = reject
  })
  let p2 =Promise.race([p,_p])
   p2.abort = abort
   return p2
}

let p = wrap(promise)
setTimeout(()=>{
  p.abort("超时。。。")
},2000)

p.catch(err=>{
  console.log(err)
})