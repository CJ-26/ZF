const fs = require("fs");
const Promise = require("./dist/bundle");
//在src下建立name.txt和age.txt
//name.txt的内容为age.txt的文件路径
//利用fs模块读取name.txt中的age.txt路径
//在用读出来的路径去读age.txt中的内容
// fs.readFile("./src/name.txt","utf-8",function(err,data){
//   console.log(data) //./src/age.txt
//   fs.readFile(data,"utf-8",function(err,data){
//     console.log(data); //18888
//   })
// })

/*
上面的代码如果有多层那就会出现恶魔金字塔（回调地狱）例如下下面：
fs.readFile("./src/name.txt","utf-8",function(err,data){
  fs.readFile(data,"utf-8",function(err,data){
       fs.readFile(data,"utf-8",function(err,data){
       fs.readFile(data,"utf-8",function(err,data){
       fs.readFile(data,"utf-8",function(err,data){
       fs.readFile(data,"utf-8",function(err,data){
       fs.readFile(data,"utf-8",function(err,data){
          console.log(data)
  })
  })
  })
  })
  })
  })
})

*/
// 用promise解决上面的回调地狱问题
// function read(path){
//   return new Promise((resolve,reject)=>{
//     fs.readFile(path,"utf-8",(err,data)=>{
//       if(err)reject(err)
//       resolve(data)
//     })
//   })
// }

// read("./src/name.txt").then((res)=>{
//   return read(res)
// },(err)=>err).then((res)=>{console.log(res)}) // 18







// promise单元测试的大致原理
/*
promise单元测试的方法：
Promise.deferred=function(){
  let dfd={} as any 
  dfd.promise = new Promise((resolve,reject)=>{
    dfd.resolve = resolve;
    dfd.reject = reject;
  })
  return dfd
}
*/
// function _read(path){
//   let dfd = Promise.deferred() //返回一个{promise:Promise,resolve:resole,reject:reject} 
//   //dfd为延迟对象，先把这个promise的实例挂在dfd对象上，之后在把该promise的实例上的resolve和reject也挂在dfd对象上
//   // 下面代码逻辑由于fs为异步的所以先返回了promise的实例，当我then的时候,
//   //promise发现当前为pending状态，会将then中的成功和失败的方法收集到对应的数组之中
//   //当异步的fs执行完调用了resolve或者reject之后promise在去调用收集的then中的成功或者失败的方法                                                                   
//    fs.readFile(path,'utf-8',function(err,data){
//      if(err)dfs.reject(err)
//      dfd.resolve(data)
//    })
//    return dfd.promise  
// }
// _read("./src/name.txt").then((res)=>{
//   return _read(res)
// }).then((res)=>{
//   console.log(res)  //18888
// })



// 在promise异常后者失败的时候链式then时中间的then不传失败执行的函数(第二个参数)，在最后的then中
//传失败的函数时，也会捕获到异常的 例如：
// function error(){
//     return new  Promise((res,rej)=>{
//       throw new Error("dddd")
//     })
// }
//  let err1 = error().then((res)=>{})
//  let err2 = err1.then((res)=>{})
//  let err3 = err2.then((res)=>{},(err)=>{console.log("1234567890",err)})  //1234567890 Error: dddd











// catch的用法：catch的的原理其实只是调用了then的方法第一参数没传而已(cahch=(errfn)=>{promise.then(null,errfn)})
// function read1(path){
//   let dfd = Promise.deferred()
//   fs.readFile(path,"utf-8",function(err,data){
//       if(err)dfd.reject(err)
//       dfd.resolve(data) 
//   })
//   return dfd.promise
// }

// read1("./src/name.txt")
// .then((res)=>read1(res +"1")) // 这里故意将res加了个"1",所以会报错，用catch来捕获错误 
// .then((res)=>{
//   console.log(res)
// }).catch((err)=>{
//   console.log("=eeee=e==",err)  //=eeee=e== { [Error: ....
// })







//将node的API变为Promise的API

//fs模块有一个属性promises 属性的值是把fs下的方法都变成了promise（fs模块为异步的）
/*
fs.promises.readFile('./age.txt', 'utf8').then((res)=>console.log(res))  //18
 
//还可以这样调用：
const { promises: { readFile } } = require('fs');  // 这种写法是取fs模块下的promises属性下的readFile相当于 let fs =require("fs") fs.promises.readFile()
 readFile('./age.txt', 'utf8').then((res)=>console.log(res))
*/



//封装fs的promises属性，(面试会问如何将node的API转化为Promise的API)
//fs.readFile有三个参数：url(要读的文件的路径) encoding(文件内用以及何种格式编码)  cb(回调函数)

// function promisify(fn){
//   return function(...args){
//     return new Promise((resolve,reject)=>{
//         fn(...args,function(err,data){
//           if(err)reject(err);
//           resolve(data)
//         })
//     })
//   }
//   }
//   let read = promisify(fs.readFile)
  
//   read("./src/name.txt","utf8").then(res=>read(res,"utf8")).then((res)=>{console.log("res===res",res)}) //res===res 18




// promise.all()的封装；
 //promise的all方法当多个promise同时执行时就可以使用promise.all([prmise1,promise2,promise3]) 所有的promise都执行成功了在返回返回的值为一个数组存放着所有promise的成功值
 //但如果有一个报错的就返回错误的信息，该信息就是报错的那个信息；
 

 function promisify1(fn){
  return function(...arge){
    return new Promise((resolve,reject)=>{
        fn(...arge,function(err,data){
          if(err)reject(err);
          resolve(data)
        })
    })
  }
  }
  let read1 = promisify1(fs.readFile)
  // Promise.all([read1("./src/name.txt","utf8"),read1('./src/age.txt','utf8')]).then((res)=>{
  //   console.log(res)  // promisne全部执行完输出：[ './src/age.txt', '18888' ]  
  //   // 这里输出的值和传入的promise是一一对应的，为什么可以做到一一对应因为传入的是数组，传出的也是数组，数组是有下标，就可以靠下标来把promise返回的值一一对应上
  // }) 

//promise的all方法中有 一个promise报错就报错返回
//例如：我把name.txt的文件名改成name4.txt，fs找不到就会抛错
//Promise.all([read1("./src/name4.txt","utf8"),read1('./src/age.txt','utf8')]).then((res)=>{}).catch((err)=>{console.log("====catch==",err)})  //====catch== { [Error: ENOENT....

// 如果promise.all的数组中有普通值就会直接返回
Promise.all([read1("./src/name.txt","utf8"),read1('./src/age.txt','utf8'),1,2]).then(res=>{
  console.log(res)//[ './age.txt', '18', 1, 2, 3 ]
})



//程序异步并行：就是一起去执行（js就是循坏）
//程序异步串行：执行完一个在执行下一个（回调套回调）










