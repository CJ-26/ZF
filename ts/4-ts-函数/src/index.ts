//  函数想要表示类型  
// 函数声明的两种方式 一 、function fn(){}函数关键字 二、let fn = function(){} 表达式声明 
// 函数表示类型要考虑 入参和函数的返回值 


// function sum(a,b){ //默然情况下没有传参()会报错，也就声明没有赋值默认为any类型（参数a和b默认为any类型）,但是可以在tsconfig.json文件中将配置项 noImplicitAny的值改为false，就不会报错了 （noImplicitAny表示没有规定类型是不可以默认为any类型，该为false表示可以默认为any类型）
//     return a+b; // 竟可能不要去用any类型
// }




function sum(a:string,b:string):string{  // 小口括号后面的string表示返回值得类型 ，如果返回值不是string一定会报错
  return a+b;
 };
 
 
 function sum1(a:string,b:string){  // 可以不用标注返回值得类型，因为 参数a和参数b都为string类型执行a+b肯定是string类 ts会自动推断出的，但当你返回的不是字符串是不会报错的
     return a+b;
    };
 
 // 那上面的 sum和sum1为函数关键字声明的函数sum和 sum1的类型是不能手动设置的ts会自动推断为function类型
 
 
 // 表达式函数
 let sum2 = function(a:string,b:string):string{    //这里的 表达式函数sume因为是let声明的所以可以设置函数类型 （可设置也可不设置不设置ts会自动推断类型）
 return a+b;
 };
 // 表达式函数设置函数类型：
 let sum3:(a1:string,b2:string)=>string = function(a:string,b:string):string{  // 设置sum3的类型如：sum3:(a:string,b:string)=>string ，表示把一个可以就兼容的函数赋予给sunm3
     return a+b;    // 赋值的时候是给a1和b1赋值的值而不是a和b
     };
 
 // 什么是可以兼容的函数就是 sum3:(a:string,b:string)=>string 设置的类型和function(a:string,b:string):string的类型一样如果不一样会报错
 // let sum4:(a:string,b:string)=>string = function(a:string,b:string):number{ 这个会报错因为不是兼容的函数；  
 //     return a+b;
 //     }
 
 // sum3:(a:string,b:string)=>string 用别名的写法：
 type Sum = (a1:string,b1:string)=>string;
 let sum4:Sum = function(a:string,b:string):string{  
     return a+b;
     };
 
 
 //表达式函数设置函数类型可以这样写:
 let sum45:(a:string,b:string)=>string = function(a,b){  // 后面的函数function(a,b)会根据前面的sum5的类型推断
     return a+b;
     };
 
 // 大多数表达式函数的写法为：
 let sum6 = function(a:string,b:string):string{
     return a+b
 };
 
 // 函数的可选参数 要以？表示 ， 函数的默认值参数要用 = 标识：
 // 可选参数：
 let sum7= function(a:string,b?:string){ //b?:string表示参数可传可不传，如果传了必须是string类型
 
 };
 
 // 默认参数
 let sum8= function(a:string,b:string="123"){ //b:string="123"表示默认参数为123也就是在不传参的时候为123，在传参的时候为该参数的值，但该参数必须为string类型
 
 };
 
 // 剩余参数，函数不知道会有多少个实参
 
 let sum9 = function(...args:number[]){  // 剩余的参数类型为number类
 };
 sum9(1,2,3,4,)
 
 let sum10 = function(...args:(number|string)[]){  // 剩余的参数类型为number类或者string类型
 };
 sum10(1,2,3,"dd",)
 
 // 总结： 表达式声明 是将一个函数赋给了一个变量，既然是变量就能设置其类型，
 
 
 // 函数的重载：
 //例如 我希望，将字符串或者是数字传入函数中并且我传入字符串是返回的一个数组数组的每一项也是字符串而我传入数字的时候也会返回一个数组的数字的每一项为数字
 
 // function toArray(value:string|number):number[]|string[]{} 这样写是不允许的因为增加的范围太大了
 // 函数的重载：
 function toArray(value:number):number[];
 function toArray(value:string):string[];
 function toArray(value:number|string){
     if(typeof value =="string"){
         return value.split('');
     }else{
         return value.toString().split('').map(item=>parseInt(item))
     }
 }
 export { }