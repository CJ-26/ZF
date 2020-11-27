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

