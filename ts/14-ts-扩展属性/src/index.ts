//扩展属性
// 因为在文件的最后加上 export{} 就表示该文件内变量接口属性指属于这个文件之中
//因为接口名字相同会合并，但如果该文件中有export{}，就没有办法和全局的合并
//如果想合并必须要在 declare global{} 中声明接口
declare global{
   interface Window{
     AAA:string
   }
   interface String{
     duble():string  // 扩展字符串本身和自己相加方法
   }
}

String.prototype.duble=function(){
  return this as string+this   //因为这里的this为String两类是不能相加的所以要断言成string，将一个断言为string就可以另一个会隐式转化                                                                             
}

let str = "xxx"
console.log(str.duble())  //出输出为xxxxxx

 





export{}