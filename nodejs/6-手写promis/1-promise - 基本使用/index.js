let fs= require("fs")
const { resolve } = require("path")


// // promis可以解决多个异步多个并行执行，最终得到结果
// //异步嵌套问题；

// // promise可以解决多个异步多个并行执行，最终得到结果
// //解决异步嵌套问题；

// //每个promise都会有三个状态，pending等待状态 ，fulfilled成功态（被resolve标识后就会变成成功态）  rejected失败态（被reject标识后就会变成失败态）
// //每个promise都会有一个then方法，then方法有两个参数，参数一为成功执行的方法，参数二位失败执行的方法
// //new Promise会立即执行，例如： new Promise((resolve,reject)=>{console.log(22)})console.log(2) 会先打印22之后在打印2，说明newPromise是同步的 
// //new Promis传入一个函数这个函数有两个参数两个参数都是函数，resolve为成功后执行的函数，reject为失败执行的函数，     
// // promise的状态是不可逆的，一但成功就不能失败，一旦失败就不能成功
// // 当promise抛出异常也会走失败状态；             







// //成功的
// let promise = new Promise((resolve,reject)=>{
//   resolve(2)  //成功调用resolve
// })

// promise.then((res)=>{ //then的第一个参数为函数，这个函数的参数为成功调用传入的就是resolve()传入的参数
// console.log(res)  //输出为2 
// })




// //失败的
// let promise1 = new Promise((resolve,reject)=>{
// reject("失败了")  //失败调用
// })
// promise1.then((res)=>{},(err)=>{  //then的第二个参数为函数，函数的参数为失败执行传入的参数也就是 reject()传入的参数
// console.log(err) // 输出为失败了
// })




// //状态不可逆的

// let promise2 = new Promise((resolve,reject)=>{
// resolve("成功") //只会执行resolve()  状态不可逆
// reject("失败")
// })
// promise2.then((res)=>{console.log(res)},(err)=>{console.log(err)})  //只会输出成功状态不可逆



// //当promise抛出异常也会走失败状态；
// let promise3 = new Promise((resolve,reject)=>{
// throw new Error("失败")   // 会走失败状态 reject()
// })
// promise3.then((res)=>{},(err)=>{console.log("err",err)})   // 会输出 err   和 失败 ， 异常的时候会走失败






// // promise的核心链式调用

// //  成功没有return值 ,第二次then走成功的值为undefined
// let promise4 = new Promise((resolve,reject)=>{
//   resolve("成功")
// }).then((res)=>{
//   console.log("res1",res)  //  res1 成功
// },(err)=>{
//   console.log('err1',err)
// })

// promise4.then((res)=>{
//   console.log("res2",res) //  res2 undefined
// },(err)=>{
//   console.log('err2',err)
// })

// 成功有返回值，返回的值传递到下次then的成功里
// let promise5 = new Promise((resolve,reject)=>{
//   resolve("成功")
// }).then((res)=>{
//   console.log("res3",res)  //  res3 成功
//   return res
// },(err)=>{
//   console.log('err3',err)
// })

// promise5.then((res)=>{
//   console.log("res4",res) //  res4 成功
// },(err)=>{
//   console.log('err4',err)
// })

// 成功后异常 ,then二次的时候走失败输出异常
// let _promise5 = new Promise((resolve,reject)=>{
//   resolve("成功")
// }).then((res)=>{
//   console.log("_res3",res)  // _res3 成功
//    throw new Error('异常')
// },(err)=>{
//   console.log('_err3',err)
// })

// _promise5.then((res)=>{
//   console.log("_res4",res) 
// },(err)=>{
//   console.log('_err4',err) //_err4 Error: 异常
// })







// 失败没有返回值，第二次then的时候会走成功的值为undefined
// let promise6 = new Promise((resolve,reject)=>{
//   reject("失败")
// }).then((res)=>{
//   console.log("res5",res)  
//   return res
// },(err)=>{
//   console.log('err5',err) // err5 失败
// })

// promise6.then((res)=>{
//   console.log("res6",res) //  res6 undefined
// },(err)=>{
//   console.log('err6',err)
// })

// 失败有返回值：返回会值会传递到下次then的成功中
// let promise7 = new Promise((resolve,reject)=>{
//   reject("失败")
// }).then((res)=>{
//   console.log("res7",res)  
//   return res
// },(err)=>{
//   console.log('err7',err) // err7 失败
//   return err
// })

// promise7.then((res)=>{
//   console.log("res8",res) //  res8 失败
// },(err)=>{
//   console.log('err8',err)
// })


//失败异常  第二次then的时候会走失败输出异常
// let _promise7 = new Promise((resolve,reject)=>{
//   reject("失败")
// }).then((res)=>{
//   console.log("_res7",res)  
//   return res
// },(err)=>{
//   console.log('_err7',err) // _err7 失败
//    throw new Error("异常")
// })

// _promise7.then((res)=>{
//   console.log("_res8",res) 
// },(err)=>{
//   console.log('_err8',err) //_err8 Error: 异常
// })






// 异常
//直接异常没有返回值
// let promise8 = new Promise((resolve,reject)=>{
//   throw new Error("异常")
// }).then((res)=>{
//   console.log("res9",res)  
  
// },(err)=>{
//   console.log('err9',err) //err9 Error: 异常
// })

// promise8.then((res)=>{
//   console.log("res10",res) // res10 undefined
// },(err)=>{
//   console.log('err10',err)
// })


//异常有返回值
// let promise9 = new Promise((resolve,reject)=>{
//   throw new Error("异常")
// }).then((res)=>{
//   console.log("res11",res)  
//   return res
// },(err)=>{
//   console.log('err11',err) //err11 Error: 异常
//   return err
// })

// promise9.then((res)=>{
//   console.log("res12",res) // res12 Error: 异常
// },(err)=>{
//   console.log('err12',err)
// })


// // 成功之后在then掉resolve，
// let promise10 = new Promise((resolve,reject)=>{
//    resolve("成功")
// }).then((res)=>{
//   console.log("res13",res)   //res13 成功
//   resolve("成功")  // 这里没有resolve方法所以异常
// },(err)=>{
//   console.log('err13',err) //err9 Error: 异常
 
// })

// promise10.then((res)=>{
//   console.log("res14",res) 
// },(err)=>{
//   console.log('err14',err)  //err14 ReferenceError: resolve is not defined
// })





// 无论成功还是失败都可以返回结果  ，
//总结 ：
//1.在第一个then中如果异常了在第二个then中走失败，
// 2.在第一个then中无论成功失败return返回不普通值（不是promise）的时候第二个then都会执行成功的 




//链式调用返回promise的情况：
//返回promise并调用成功时 第二次then走成功
// let promise11 = new Promise((resolve,reject)=>{
//    resolve("成功")
// }).then((res)=>{
//   console.log("res15",res)    //res15 成功
//   return new Promise((resolve,reject)=>{
//     resolve(100)
//   })
// },(err)=>{
//   console.log('err15',err) 
 
// })

// promise11.then((res)=>{
//   console.log("res16",res)   // res16 100
// },(err)=>{
//   console.log('err16',err) 
// })


// 返回promise时调用失败，下一then时走失败
// let promise12 = new Promise((resolve,reject)=>{
//   resolve("成功")
// }).then((res)=>{
//  console.log("res17",res)    // res17 成功
//  return new Promise((resolve,reject)=>{
//    reject("失败")
//  })
// },(err)=>{
//  console.log('err17',err) 

// })

// promise12.then((res)=>{
//  console.log("res18",res)  
// },(err)=>{
//  console.log('err18',err)  // err18 失败
// })


// 返回promise时异常，下一then时走失败
// let promise13 = new Promise((resolve,reject)=>{
//     resolve("成功")
//   }).then((res)=>{
//    console.log("res19",res)    // res19 成功
//    return new Promise((resolve,reject)=>{
//      throw new Error("异常")
//    })
//   },(err)=>{
//    console.log('err19',err) 
  
//   })
  
//   promise13.then((res)=>{
//    console.log("res20",res)  
//   },(err)=>{
//    console.log('err20',err)  // err20 Error: 异常
//   })
  



// // 返回promise什么都没执行， 第二次then什么也不会发生因为为pending状态
// let promise14 = new Promise((resolve,reject)=>{
//   resolve("成功")
// }).then((res)=>{
//  console.log("res21",res)     //res21 成功
//  return new Promise((resolve,reject)=>{ })
// },(err)=>{
//  console.log('err21',err) 

// })

// promise14.then((res)=>{
//  console.log("res22",res)  
// },(err)=>{
//  console.log('err22',err)  
// })





  //总结 如果第一次then中返回的时promise成功则第二次then走成功(并把第一次then中promise成功的值传入第二次then成功的函数中)
  // 如果第一次then中返回的时promise失败或者异常则第二次then走失败(并把第一次then中promise失败或者异常的值传入第二次then失败的函数中)
 //  如果第一次then中返回的时promise什么都没做则第二次then的时候什么也不会发生因为为pending状态





 // 如果then中返回的primose与该then的是一个promise就会卡死，返回类型错误（相当于我在等我自己去东西，我怎么能等我自己去买东西那肯定就卡死了）
//  let promise15 = new Promise((res, rej) => {
//    res("成功");
//  })

//  let promise16= promise15.then(
//      (res) => {
//        return promise16;
//      },
//      (err) => {
//        console.log("err", err);
//      }
//    )   
//    promise16.then(
//      (res) => {
//        console.log("res", res);
//      },
//      (err) => {
//        console.log("err类型异常", err); //err类型异常 TypeError: Chaining cycle detected for promise 
//      }
//    );

              



// // then中如果返回的promise是执行成功的但resolve的参数还是一个promise并且返回了成功
//  let promise18 = new Promise((resolve,reject)=>{
//      resolve("ok")
//  }).then((res)=>{
//   return new Promise((resolve,reject)=>{
//     setTimeout(()=>{
//       resolve(new Promise((resolve,reject)=>{
//         setTimeout(()=>{
//           resolve("ooooookk")
//         })
//       }))
//     })
//   })
//  },(err)=>{})

//  promise18.then((res)=>{
//    console.log('res====>>>',res)  //res====>>> ooooookk
//  },(err)=>{
//    console.log('err====>>>',err)
//  })




// // then中如果返回的promise是执行成功的但resolve的参数还是一个promise并且返回了失败的
// let promise19 = new Promise((resolve,reject)=>{
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

// promise19.then((res)=>{
// console.log('res====>>>',res) 
// },(err)=>{
// console.log('err====>>>',err) //err====>>> ooooookk
// })


//then中如果返回的promise是执行成功的但resolve的参数还是一个异常的promise
// let promise20 = new Promise((resolve,reject)=>{
//   resolve("ok")
// }).then((res)=>{
// return new Promise((resolve,reject)=>{
//  setTimeout(()=>{
//    resolve(new Promise((resolve,reject)=>{
//      throw new Error("=====异常=====")
//    }))
//  })
// })
// },(err)=>{})

// promise20.then((res)=>{
// console.log('res====>>>',res) 
// },(err)=>{
// console.log('err====>>>',err)  //err====>>> Error: =====异常=====
// })


// then中如果返回的promise是执行成功的但resolve的参数还是一个promise,promise内部setTimeout中有异常是捕获不到的
// let _promise20 = new Promise((resolve,reject)=>{
//   resolve("ok")
// }).then((res)=>{
// return new Promise((resolve,reject)=>{
//  setTimeout(()=>{
//    resolve(new Promise((resolve,reject)=>{
//      setTimeout(()=>{
//       throw new Error("=====异常=====")  //捕获不到
//
//      })
//    }))
//  })
// })
// },(err)=>{})

// _promise20.then((res)=>{
// console.log('res====>>>',res) 
// },(err)=>{
// console.log('err====>>>',err)  //err====>>> Error: =====异常=====
// })


// //捕获不到异常
// let promise21 = new Promise((res,rej)=>{
//  res("99999999999")
// }).then((res)=>{
//   return new Promise((res,rej)=>{
//     setTimeout(()=>{ 
//       throw new Error("===异常===")  // 这样写是捕获不到异常因为异常在setTimeout里面有没在promise里面
//     },0)
   
//   })
// },(err)=>{
//   console.log("22222222222222",err)
// }).then((res)=>{console.log("11111",res)},(err)=>{console.log("555555",err)})






// promise中then方法的穿透
// let promise22 = new Promise((resolve,reject)=>{ resolve("====成功====")})
// // promise A+ 中规定then的方法可传可不传，不穿的情况下会有then穿透
// promise22.then().then().then((res)=>{console.log(res)})  //====成功====

// //then传参的情况下的有return才能才能在下一个then中收到
// let promise23 = new Promise((resolve,reject)=>{resolve("====成功====")})
// promise23.then((res)=>{return res},(err)=>{return err}).then((res)=>{console.log("-----res---",res)},(err)=>{})   //-----res--- ====成功====






// 在promise异常后者失败的时候链式then时中间的then不传失败执行的函数(第二个参数)，在最后的then中
//传失败的函数时，也会捕获到异常的（成功同理） 例如：
// function error(){
//     return new  Promise((res,rej)=>{
//       throw new Error("dddd")
//     })
// }
//  let err1 = error().then((res)=>{})
//  let err2 = err1.then((res)=>{})
//  let err3 = err2.then((res)=>{},(err)=>{console.log("1234567890",err)})  //1234567890 Error: dddd





// catch的用法：
// function read(flge){
//   return new Promise((res,rej)=>{
//     setTimeout(()=>{
//       if(flge){
//         res("==成功==")
//       }else{
//         rej("==出错了===")
//       }
//     })
//   })
// }

// read(true).then(res=>read(false)).then().catch((err)=>{console.log("======>>>",err)}) //======>>> ==出错了===





// 将node的APIB变为promise的API:
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
//   return function(...arge){
//     return new Promise((resolve,reject)=>{
//         fn(...arge,function(err,data){
//           if(err)reject(err);
//           resolve(data)
//         })
//     })
//   }
//   }
//   let read = promisify(fs.readFile)
  
//   read("./name.txt","utf8").then(res=>read(res,"utf8")).then((res)=>{console.log("res===res",res)}) //res===res 18





 //promise的all方法当多个promise同时执行时就可以使用promise.all([prmise1,promise2,promise3]) 所有的promise都执行成功了在返回返回的值为一个数组存放着所有promise的成功值
 //但如果有一个报错的就返回错误的信息，该信息就是报错的那个信息；
 

// function promisify1(fn){
//   return function(...arge){
//     return new Promise((resolve,reject)=>{
//         fn(...arge,function(err,data){
//           if(err)reject(err);
//           resolve(data)
//         })
//     })
//   }
//   }
//   let read1 = promisify1(fs.readFile)
//   Promise.all([read1("./name.txt","utf8"),read1('./age.txt','utf8')]).then((res)=>{
//     console.log(res)  // 输出：[ './age.txt', '18' ]
//   }) 

//promise的all方法中有 一个promise报错就报错返回
//例如：我把name.txt的文件名改成name4.txt，fs找不到就会抛错
//Promise.all([read1("./name4.txt","utf8"),read1('./age.txt','utf8')]).then((res)=>{}).catch((err)=>{console.log("catch==",err)})  //catch== { [Error: ENOENT....



// 如果promise.all的数组中有普通值就会直接返回

// Promise.all([read1("./name.txt","utf8"),read1('./age.txt','utf8'),1,2,3,]).then(res=>{
//   console.log(res)//[ './age.txt', '18', 1, 2, 3 ]
// })


// Promise.resolve("11").then((res)=>{console.log(res)}) //11

// Promise.reject('失败').then(null,(err)=>{console.log(err)}) // 失败
 



//  finally ,不管是成功或者失败还是异常都会走finally，finally后面也能链式then，danfinally返回的结果不会影响后面的then的结果例如：

// let promise34 = new Promise((resolve,reject)=>{
//   resolve("成功")
// }).then((res)=>{
//   console.log(res)
// }).finally(()=>{
//   console.log("finally1")  //finally1
// })

// let promise35 = new Promise((resolve,reject)=>{
//   reject("失败")
// }).then(null,(err)=>{
//   console.log(err)  //失败
// }).finally(()=>{
//   console.log("finally2")  //finally2
// })

// let promise36 = new Promise((resolce,reject)=>{
//   throw new Error("异常")
// }).then(null,(err)=>{
//   console.log(err)  //Error: 异常
// }).finally(()=>{
//   console.log("finally3")  //finally3
// })


//finally的返回值不会影响后续的结果：例如：
//Promise.resolve("444555").finally(()=>{ return 12}).then((res)=>{ console.log(res)})  //444555


//成功的调用Promise.resolve("7777")后面的finally返回的promise中执行的也是resolve函数是不会不会采用这promise中resolve的值的，也是不会影响后续的逻辑，但是会等 new prmise执行完在往下走，
// Promise.resolve("7777").finally(()=>{ 
//   console.log("finally666s")  //finally666s
//   return new Promise((res,rej)=>{
//     setTimeout(()=>{
//       res("ok") //不会采用ok这个结果
//     }，1000)
//   })
//   }).then((res)=>{ console.log("finally111",res)})  //等一秒后输出： finally111 7777





//失败的调用Promise.reject("7777")后面的finally返回的promise中执行的是resolve但resolve的结果也是不会影响后续的逻辑，但是会等 new prmise执行完在往下走，
// Promise.reject("7777").finally(()=>{ 
//   console.log("finally666s")  //finally666s
//   return new Promise((res,rej)=>{
//     setTimeout(()=>{
//       res("ok")  
//     },2000)
//   })
//   }).then(null,(res)=>{ console.log("finally111",res)})  //等2秒后在输出： finally111 7777



//但是不管是Promise.reject()还是Promise.resolve()
//只要后面链finally中返回的promise里面调用的是reject就会影响
//后续的逻辑,会将失败的值传入后面的then的失败函数中
// Promise.reject("7777").finally(()=>{ 
//   return new Promise((resolve,reject)=>{
//  console.log("finally666s")  //finally666s
//     setTimeout(()=>{
//       reject("不不不ok")  
//     }，1000)
//   })
//   }).then((res)=>{ 
//     console.log("finally111",res)
//   },(err)=>{console.log("err--===",err)})  //等一秒输出： err--=== 不不不ok



//但是不管是Promise.reject()还是Promise.resolve()
//只要后面链finally中返回的promise里面调用的是reject就会影响
//后续的逻辑,会将失败的值传入后面的then的失败函数中
// Promise.resolve("7777").finally(()=>{ 
//   return new Promise((resolve,reject)=>{
 // console.log("finally666s")  //finally666s
//     setTimeout(()=>{
//       reject("不不不ok")  
//     },1000)
//   })
//   }).then((res)=>{ 
//     console.log("finally111",res)
//   },(err)=>{console.log("err--err",err)})  //等一秒输出 err--err 不不不ok




// Promise.race() 用法，一个promise数组，不管返回的是成功还是失败的那个先返回就用那个返回的结果,返回的是一个结果不是数组
let p1 = new Promise((resolve,reject)=>{
  setTimeout(()=>{
    resolve("p1p1p1p1p1")
  },2000)
})
let p2 = new Promise((resolve,reject)=>{
  setTimeout(()=>{
    reject("p2p2p2p2")
  },1000)
})

 Promise.race([p1,p2]).then((res)=>{
   console.log('resresres',res)  
 },(err)=>{console.log("errerrerr",err)}) //errerrerr p2p2p2p2











/* 
Prominse a+规范:
1.promise必须是一个对象或者是一个函数，它必须有一个then方法
2.如果是一个thenable对象也要有then方法
3.value是一个简单的js值，例如undefined 、thenable 、 就是成功态或者失败态出入的参数例如 resolve(444) //444就是value                                                                             
4.如果抛出一个异常了话，就是错误状态
5.如果失败为rejected状态


5.promise 必须有三种状态， pending、fulfilled、rejected
6、当在 pending状态的时候它可以转化为成功或者失败
7、当如果成功了话fulfilled它就不能转化为任何状态
8，当失败了rejected也不能去转化为别饿状态；





*/







/*



* */


