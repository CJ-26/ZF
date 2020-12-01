const fs = require("fs").promises;
// function* read(filePath) {
//   let name = yield fs.readFile(filePath, "utf8");
//   let age = yield fs.readFile(name, "utf8");
//   return age;
// }
// let it = read("./name.txt");
// let  {value,done} = it.next()    // it.next() 返回为： { value: Promise { <pending> }, done: false } value为一个Promise
// //为何呀加Promise.resolve如果value返回的不是一个promise，就利用Promise.resolve变成一个Promise
// Promise.resolve(value).then((res)=>{
//   let{value,done} = it.next(res) 
//   Promise.resolve(value).then((res)=>{
//     let {value,done} = it.next(res) 
//     console.log(value,done)  //18 true
//   })
// })


// co配和Genertor的使用,(co库是tj写的，解决像上面read读文件多层嵌套问题)
// co的用法 安装 cnpm i co -S
// const Co = require("co");
// function* read1(filePath) {
 
//     let name = yield fs.readFile(filePath, "utf8");
//     let age = yield fs.readFile(name, "utf8");
//     return age;
// }
// Co(read1("./name.txt")).then((data)=>{
//   console.log(data)  //18
// }).catch((res)=>{
//   console.log("res===res",res)
// })


// Generator是支持try..catch的
// const Co = require("co");
// function* _read1(filePath) {
//   try {
//     let name = yield fs.readFile(filePath + 1, "utf8");  //filePath + 1会一次常 try..catch会捕获到
//     let age = yield fs.readFile(name, "utf8");
//     return age;
//   } catch (e) {
//     console.log("eeeee",e)   //eeeee [Error: ENOENT: ........
//   }
// }
// Co(_read1("./name.txt")).then((data)=>{
//   console.log(data)  //18
// })






// 手写co：
// function* read2(filePath) {
//   let name = yield fs.readFile(filePath, "utf8");
//   let age = yield fs.readFile(name, "utf8");
//   return age;
// }
// function _co(it){
//   return new Promise((resolve,reject)=>{
//     // 递归 异步迭代，(异步迭代使用函数递归来迭代,递归做完一件事再去做另一件事，异步串行)，  同步迭代也就是异步并行利用循环(例如promise.all的实现)
//     function next(val){
//       let {value,done} = it.next(val)
//       if(done){
//         resolve(value)
//       }else{
//         Promise.resolve(value).then((res)=>{
//               next(res)
//         },reject)  // 链式一个Promisne失败了就失败，所以这里加一个reject
//       }
//     }
//     next()
//   })
// }
// _co(read2('./name.txt')).then((res)=>{
//   console.log(res) //18
// })





function* read2(filePath) {
  let name = yield 1;
  let age = yield 2;
  return age;
}
let it = read2("./name.txt")
console.log(it.next())
console.log(it.next(1))
console.log(it.next(2))
console.log(it.next())

console.log(it.next())




