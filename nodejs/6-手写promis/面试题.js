// Promise.resolve().then(() => {
//     console.log("then1");
//     Promise.resolve().then(() => {
//         console.log("then1-1");
//        return Promise.resolve(3);
//     }).then((res) => {
//         console.log(res,"then1-2");
//     });
// })
// .then(() => {
//     console.log("then2");
// })
// .then(() => {
//     console.log("then3");
// })
// .then(() => {
//     console.log("then4");
// })
// .then(() => {
//     console.log("then5");
// })
/*
then1
then1-1
then2
then3
then4
3 then1-2
then5

*/






// const promise = new Promise((resolve, reject) => {
//   console.log(1);
//   setTimeout(() => { 
//     console.log("timerStart");
//     resolve("success");
//     console.log("timerEnd");
//   }, 0);
//   console.log(2);
// });
// promise.then((res) => {
//   console.log(res);
// });
// console.log(4);    // 1  2  4  timerStart  timerEnd  success
 


//使用Promise实现红绿灯交替重复亮

//红灯3秒亮一次，黄灯2秒亮一次，绿灯1秒亮一次；如何让三个灯不断交替重复亮灯？

function red() {
    console.log('red');
}
function green() {
    console.log('green');
}
function yellow() {
    console.log('yellow');
}


function light(timer,cb){
 return new Promise((resolve,reject)=>{
  setTimeout(()=>{
    cb()
    console.log(1)
    resolve()
  },timer)
})
}
 function step (){
   Promise.resolve().then(()=>{
    console.log(2)
    return light(3000,red)
   }).then(()=>{
    console.log(3)
   return light(2000,yellow)
   }).then(()=>{
    console.log(4)
   return light(1000,green)
   }).then(()=>{
    console.log(5)
    return step()
   })
 }
 step ()
//  2
//  red
//  1
//  3
//  yellow
//  1
//  4
//  green
//  1
//  5
//  2
//  red
//  1
//  3
//  yellow
//  1
//  4
//  green
//  1
//  5
//  2
 /*
 为什么要加return 因为 事件环执行机制 主栈同步=》清空微观任务=》执行宏观队列中的第一个宏任务中的同步=》清空微观任务=》执行下一个宏观任务=》。。。

 当掉用 step ()执行主栈同步没有=》清空微观任务也就是then但是这个then返回了一个Promise有promise内部实现原理可以如果返回promos会执行返回的promise的then方法并且递归
 在判断是否返回的还是一个promise如果是在执行当前的promise的then方法直到递归到返回的为一个普通值为止将者普通传给下一次then，也就是第一个then返回的promise的then没有执行完后面的then是不会执行的
 
 如果没有return promise 那就返回普通值，因为递归会死循环执行递归函数，虽然调用了light方法但是该方法的new Promise立即执行的是setTimeout，
 是宏观任务当以死循环微观任务的时候宏观任务是永远执行不到的，因为要先清空微观任务但微观任务又死循环了
 */





// const light = function (timer, cb) {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       cb()
//       resolve()
//     }, timer)
//   })
// }
// const step = function () {
//   Promise.resolve().then(() => {
//     return light(3000, red)
//   }).then(() => {
//     return light(2000, green)
//   }).then(() => {
//     return light(1000, yellow)
//   }).then(() => {
//     return step()
//   })
// }
 
// step();
 