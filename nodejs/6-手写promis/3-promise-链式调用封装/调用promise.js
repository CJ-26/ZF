/*try{}catch(){}的用法：

function fn (){
   throw new Error("失败")
}
try{
  fn()
}catch(e){
  console.log(1111)  //输出1111
}


function fn (){
   ttt
}
try{
  fn()
}catch(e){
  console.log(1111)  //输出1111
}
*/




const { convertTypeAcquisitionFromJson } = require("typescript");
const Promise = require("./dist/bundle");



// 自己封装的promise基本使用
let promise = new Promise((resolve,reject)=>{
 resolve("成功1")
 //reject("失败")
 throw new Error("异常")
})

promise.then((res)=>{
  console.log(res)
},(err)=>{
  console.log(err)
})



// 自己封装的promise的第二种情况：在promise中写setTimeout 1秒后在执行resolve
let promise1 = new Promise((resolve,reject)=>{
  setTimeout(()=>{
    resolve("成功2")
  },1000)
})
promise1.then((res)=>{
  console.log(res)
},(err)=>{
  console.log(err)
})
/*
promise中有setTimeout延时所以要是使用发布订阅模式去执行：
在封装的promise中添加两个订阅数组 储存成功的：onResolvedCallback:[]  储存失败的：onRejectedCallback:Function[];
在then的时候promise的状态为pending，这时去订阅 成功和失败，当setTimeout执行完之后去发布成功或者时订阅

*/




// promis链式调用
// 注意： 
//1、因为能链式then所以要返回一个新的promise(为啥要返回一个新的promise而不是this，如果是this就是老的promise了，例如：当第一个then的时候执行的是失败并返回一个1那么这个promise的状态就变成了rejected，在then时会走成功的如果还用这个promise那么状态就是失败态，现在走的是成功态，promise的状态是不可逆，那么还用老的promise就是不合理的了)
//2。链式调用的是时候第一个then里面如果返回一个普通值时不管是成功还是失败返回的，在下一次then的时候都会走成功的
// 3.如果第一个then里面异常在下一次then时候会走失败

/*
有上述3点封装promise的时候then方法需要返回一个新的promise，并将上一次then中的值传给这个新的peomise的resolve中，但如果有异常则要传入新的promise中的reject中，这样就需要使用try(resolve())catch(e)(reject(e)){}来捕获错误
*/


let promise2 = new Promise((resolve,reject)=>{
  resolve("成功===")
})
promise2.then((res)=>{
 return res; 
},(err)=>{
  return err
}).then((res)=>{
  console.log("res====2",res)   //res====2 成功===
})

// 异常

let promise3= new Promise((resolve,reject)=>{
  resolve("100")
})
promise3.then((res)=>{
   throw new Error("异常")
},(err)=>{
  return err
}).then((res)=>{
  console.log("res====3",res)   
},(err)=>{
  console.log("err",err) //err Error: 异常
})






// 链式用法
let promise4= new Promise((resolve,reject)=>{
  resolve("5666")
})
promise4.then((res)=>{
   throw new Error("异常")
},(err)=>{
  return err
}).then((res)=>{
  console.log("res====4",res)   
},(err)=>{
  console.log("err",err) //err Error: 异常
  return 1111111111111111
}).then((res)=>{
  console.log(res,"999999")   //1111111111111111 '999999'
})