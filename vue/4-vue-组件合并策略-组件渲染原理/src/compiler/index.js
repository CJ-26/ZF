import { parseHTML } from "./parse";
import {generate} from "./generatef"
export function compileToFunction(template) {
  let ast = parseHTML(template); //解析标签函数
  let code = generate(ast);
 let render = `with(this){return ${code}}`; // with(Object){console.log(key)// value}
 let fn = new Function(render)  //new Function() 可以将字符串转换成函数
 return fn
}


/*
with语法的用法

let obj = {
  a:1,
  b:2,
}
with(obj){
  a=3;
  b=6;
}
console.log(obj)  // {a:3,b:6}



function fn(){
  with(this){
    console.log(name) //小明
  }
}
fn.call({name:"小明"})


*/