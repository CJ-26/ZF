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



// // 自己封装的promise基本使用
// let promise = new Promise((resolve,reject)=>{
//  resolve("成功1")
//  //reject("失败")
//  throw new Error("异常")
// })

// promise.then((res)=>{
//   console.log(res)
// },(err)=>{
//   console.log(err)
// })



// // 自己封装的promise的第二种情况：在promise中写setTimeout 1秒后在执行resolve
// let promise1 = new Promise((resolve,reject)=>{
//   setTimeout(()=>{
//     resolve("成功2")
//   },1000)
// })
// promise1.then((res)=>{
//   console.log(res)
// },(err)=>{
//   console.log(err)
// })
// /*
// promise中有setTimeout延时所以要是使用发布订阅模式去执行：
// 在封装的promise中添加两个订阅数组 储存成功的：onResolvedCallback:[]  储存失败的：onRejectedCallback:Function[];
// 在then的时候promise的状态为pending，这时去订阅 成功和失败，当setTimeout执行完之后去发布成功或者时订阅

// */




// // promis链式调用
// // 注意： 
// //1、因为能链式then所以要返回一个新的promise(为啥要返回一个新的promise而不是this，如果是this就是老的promise了，例如：当第一个then的时候执行的是失败并返回一个1那么这个promise的状态就变成了rejected，在then时会走成功的如果还用这个promise那么状态就是失败态，现在走的是成功态，promise的状态是不可逆，那么还用老的promise就是不合理的了)
// //2。链式调用的是时候第一个then里面如果返回一个普通值时不管是成功还是失败返回的，在下一次then的时候都会走成功的
// // 3.如果第一个then里面异常在下一次then时候会走失败

// /*
// 有上述3点封装promise的时候then方法需要返回一个新的promise，并将上一次then中的值传给这个新的peomise的resolve中，但如果有异常则要传入新的promise中的reject中，这样就需要使用try(resolve())catch(e)(reject(e)){}来捕获错误
// */


// let promise2 = new Promise((resolve,reject)=>{
//   resolve("成功===")
// })
// promise2.then((res)=>{
//  return res; 
// },(err)=>{
//   return err
// }).then((res)=>{
//   console.log("res====2",res)   //res====2 成功===
// })

// // 异常

// let promise3= new Promise((resolve,reject)=>{
//   resolve("100")
// })
// promise3.then((res)=>{
//    throw new Error("异常")
// },(err)=>{
//   return err
// }).then((res)=>{
//   console.log("res====3",res)   
// },(err)=>{
//   console.log("err",err) //err Error: 异常
// })






// 链式用法
// let promise4= new Promise((resolve,reject)=>{
//   resolve("5666")
// })
// promise4.then((res)=>{
//    throw new Error("异常")
// },(err)=>{
//   return err
// }).then((res)=>{
//   console.log("res====4",res)   
// },(err)=>{
//   console.log("err",err) //err Error: 异常
//   return 1111111111111111
// }).then((res)=>{
//   console.log(res,"999999")   //1111111111111111 '999999'
// })





// 如果第一次then中返回一个promise和上一次返回的promise相同这抛出类型错误（相当于我在等我自己去东西，我怎么能等我自己去买东西那肯定就卡死了）
// let promise5=new Promise((resolve,reject)=>{
//   resolve("哈哈哈哈哈")
// })
// let promise6 =promise5.then((res)=>{
//    return promise6
// },(err)=>{console.log(err)})
// promise6.then((res)=>{
//   console.log("res类型异常",res)
// },(err)=>{
//   console.log("err类型异常",err)  // err类型异常 TypeError: 出错了
// })




// 如返回的的对象的then方法是抛出个异常，就会报错
// let obj = {};
// Object.defineProperty(obj,"then",{
//   get(){
//       throw new Error("异常了==========>>>>>>")
//   }
// })

// let promise7=new Promise((resolve,reject)=>{
//  resolve("哈哈哈哈哈")
// })
// let promise8 =promise7.then((res)=>{
//   return obj
// },(err)=>{console.log(err)})
// promise8.then((res)=>{
//  console.log("res成功哈啊哈哈哈",res)
// },(err)=>{
//  console.log("err异常哈哈哈",err)  //err异常哈哈哈 Error: 异常了==========>>>>>>

 



 
//如果第一次then中返回一个promise的成功的情况
// let promise9=new Promise((resolve,reject)=>{
//   resolve("哈哈哈哈哈")
// })
// let promise10 =promise9.then((res)=>{
//    return new Promise((resolve,reject)=>{
//      resolve("呵呵呵呵呵呵呵")
//    })
// },(err)=>{console.log(err)})
// promise10.then((res)=>{
//   console.log("res====res",res)  //res====res 呵呵呵呵呵呵呵
// },(err)=>{console.log(err)})


//如果第一次then中返回一个promise的失败的情况
// let promise11=new Promise((resolve,reject)=>{
//   resolve("哈哈哈哈哈")
// })
// let promise12 =promise11.then((res)=>{
//    return new Promise((resolve,reject)=>{
//      reject("呵呵呵呵呵呵呵")
//    })
// },(err)=>{console.log(err)})
// promise12.then((res)=>{
//   console.log("res====res",res)  
// },(err)=>{console.log('err===err',err)}) //err===err 呵呵呵呵呵呵呵



// 如果第一次then中返回一个promise的失败的情况并且有setTimeout
// let promise13 = new Promise((resolve,reject)=>{
//   resolve("ok")
// }).then((res)=>{
// return new Promise((resolve,reject)=>{
//  setTimeout(()=>{
//    resolve(new Promise((resolve,reject)=>{
//      setTimeout(()=>{
//       reject("ooooookk")
//      })
//    }))
//  })
// })
// },(err)=>{})

// promise13.then((res)=>{
// console.log('res====>>>',res) 
// },(err)=>{
// console.log('err====>>>',err) //err====>>> ooooookk
// })




//promise的then穿透(成功的穿透)
let promise14 = new Promise((resolve,reject)=>{
  resolve("哈哈哈")
})
promise14.then().then().then((res)=>{console.log("0008899",res)}) //0008899 哈哈哈

//promise的then穿透(失败的穿透)
let promise15 = new Promise((resolve,reject)=>{
  reject("哈哈哈")
})
promise15.then().then().then(null,(err)=>{console.log("err===",err)}) //err=== 哈哈哈