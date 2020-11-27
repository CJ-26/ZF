// Promis 最重要的核心就是解决了 1. 异步并发问题 2.回调地狱问题

//例如： 同时读取两个文件，fs为异步会并发
const fs = require('fs')
// fs,readFile参数一为读取文件的路径（这里默认找根路径下的文件时vscode插件code runner 的bug，以后尽量使用node的paht模块获取路径），参数二为编码的形式，参数三为回调函数，回调函数的第一个参数为err，第二个参数为读取的内容
fs.readFile('./age.txt','utf-8',(err,data)=>{
  fn('age',data)
})
fs.readFile('./name.txt','utf-8',(err,data)=>{
  fn('name',data)
})

// console.log(obj) //因为fs为异步模块所以这样打印obj里面时空的，这就要使用回调了
interface IPerson{
  age:number;
  name:string;
}
function after(num,callback){
  let obj = {} as IPerson
  return (key,val)=>{
      obj[key] = val
    --num ==0 && callback(obj)
  }
}
let fn = after(2,(obj)=>{
  console.log(obj)
})