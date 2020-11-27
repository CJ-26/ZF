//泛型：就是当调用时传入具体的类型，先用一个标识符占位

import { time } from "console";

// 泛型的特性 ：就是为了在声明时不能确定类型，只有在使用的时候，才能决定类型

// 不能确定类型的时后去使用泛型 ，
//泛型的使用： 函数(参数，和返回值不能确定类型)、   类型别名 ，类 等

//在函数中使用泛型：
// 传入长度生成数组
function createArray<T>(times:number,val:T){ //createArray<T>中的<T>表示声明个变量T(<T>类似函数的形参可以接受值), (times:number,val:T)这里的T表示将T表示的类型标记val 
  let result = [];                           // 这里没标注返回值的类型但ts会去推断
  for(let i = 0 ; i<times;i++){
    result.push(val)
  }
  return result 
}
let r = createArray<string>(3,"ABC")   //<string>（调用函数时的<string>相当于函数的实参将string传入函数体上的<T>里面）将string类型传入createArray<T>中的这个<T>中
//泛型中不传参ts也会自动推导类型：
function createArray1<T>(times:number,val:T){
  let result = [];
  for(let i = 0 ; i<times;i++){
    result.push(val)
  }
  return result
}
let r1 = createArray1(3,"ABC") //这里没有传<string>，但ts会自行推断T为string类型



// 泛型的参数可以多个
// 例如函数中传入一个元组的类型为 [string,number] 函数返回的为传入的元组的倒序[number,string]
function swap<A,B>(tuple:[A,B]):[B,A]{
     return [tuple[1],tuple[0]];
}
swap<number,number>([1,3])  //这里没有给泛型传参swap<number,number>([1,3])，是因为ts会去推断





// 函数表达式方式声明的函数中使用泛型：
//第一种在函数本身上写泛型
// 正常函数
const swap1 =function <A,B>(tuple:[A,B]):[B,A]{
  return [tuple[1],tuple[0]];
}
swap1([1,"2"]) // 传的参数为元组
//箭头函数
const _swap1=<A,B>(tuple:[A,B]):[B,A]=>{
    return [tuple[1],tuple[0]]
}
_swap1([1,5])  // 传的参数为元组


//第二种利用接口的写法：
//接口的第一种：
interface MySwap{
     <A,B>(tuple:[A,B]):[B,A]  //   <A,B>(tuple:[A,B]):[B,A]表示调用函数的时候在传泛型的参数
}
const swap2:MySwap=(tuple)=>{
    return [tuple[1],tuple[0]]
}
 swap2([1,5])  // 传的参数为元组

 //接口的第二种：
interface MySwap1<A,B>{  //参数放到接口上，表示在使用接口的时候就的传参
  (tuple:[A,B]):[B,A]  
}
const swap3:MySwap1<number,number>=(tuple)=>{  //因为参数在接口上二不是在接口内部修饰的函数上所以 使用这个接口时就要传参const swap3:MySwap1<number,number>=(tuple)=>{}
 return [tuple[1],tuple[0]]
}
console.log(swap3([1,5]))  // 传的参数为元组


// 在接口上写泛型变量的(<A,B>)例子1：
interface MySwap2<A,B>{ 
  [key:number]:A | B 
}
const swap4=<A,B>(tuple:MySwap2<A,B>):MySwap2<A,B>=>{  
 return [tuple[1],tuple[0]]
}
let r2 = swap3([1,5])  // 传的参数为元组






// 在接口上写泛型变量的(<A,B>)例子2：(这个会有一点绕一定要理解才可以)
interface MySwap3<A,B>{ 
  [key:number]:B  // 修饰类型只赋了一个B类型 
}
const swap5=<A,B>(tuple:MySwap3<A,B>):MySwap3<A,B>=>{  
 return [tuple[1],tuple[0]]
}
let r3= swap5([1,2,])   //  将鼠标放到r3上回提示 let r3: MySwap3<unknown, number> 接口的A为unknown,为何A为unknown看下面的解释：
/*
解释： 调用函数swap5的时候是没有给泛型传类型的，传类型的写法为let r3= swap5<number,number>([1,2,])
没有传类型ts回自动推导的，
看函数体中的swap5=<A,B>因为没有传类型所以A和B现在都是unknown，         

在看函数的参数里：(tuple:MySwap3<A,B>) ：第一次调用接口将 将两个 nuknown传入 MySwap3<A,B>{[key:number]:B}中，接口的内容为：[key:number]:B 表示这个数组无所谓有多少项但每一项的类型必须为B类型 ，但是因为A,B都没传类型，到这里ts开始推断B的类型，
因为A没有使用不去推断,根据执行函数传的参数推断为B表示number类型，

:MySwap3<A,B>=> ：这为第二次调用为函数的返回值，同样也是将swap5=<A,B>中的A,B传入，因为函数调用的时候没有赋值所以传入的A,B还是unknown，两个unkonwn传入接口中，一看只有B在使用，推断B为number类型，A没有使用也就
没有推断了，那就还是unkonwn。
所以将鼠标放到r3上回提示 let r3: MySwap3<unknown, number> 接口的A为unknown,B为number

其实这里的A 完全可以不要：（直接推断B就可以了）
interface MySwap3<B>{ 
  [key:number]:B  
}
const swap5=<B>(tuple:MySwap3<B>):MySwap3<B>=>{  
 return [tuple[1],tuple[0]]
}
let r3= swap5([1,2,])


如果传参的情况下那传的什么类型就是什么类型了，
interface MySwap3<A,B>{ 
  [key:number]:A|B
}
const swap5=<B>(tuple:MySwap3<B>):MySwap3<B>=>{  
 return [tuple[1],tuple[0]]
}
let r3= swap5<A:number,B:string>([1,"2",]) /

*/

//求和函数，我希望这这函数是用来求和的：中使用泛型  （泛型变量可以继承类型 用法：<T extends string> 继承了string类型）
//使用了泛型变量T但只使用了一个变量参数有两个就要保证两个参数的类型是一致的
//但返回值也用T标注，直接标注会报错：运算符“+”不能应用于类型“T”和“T”，因为你不确定返回的类型是否为T类型例如如果传入的类型为两个null,那T的类型就是null，但是null+null是等于0的，return个零，T是null类型，用T去修饰0，肯定不对呀；
//如果想用T标注返回值就要使用，类型约束:让T先去继承 number类型，这时虽然T有了number类型但是，ts推断返回值的时候，它还是确定T+T就就是T类型所以给返回值断言成T类型
const sum =<T extends number>(a:T,b:T):T=>{
  return (a+b) as T
}
sum(1,2)

//我希望函数传入的参数是有length属性的（泛型约束）


// 泛型的写法：
function getType<T extends {length:number}>(val:T){ // <T extends {length:number}> 表示T去继承{length:number}，也就是继承后T上有length属性
  val.length
}
getType([1,2,3,4])
//别名的写法：
type WithLen = {length:number}
function getType1<T extends WithLen>(val:T){
  val.length
}
getType1("222")

// 普通的写法
function getType2(val:{length:number}){  //   (val:{length:number}):表示传入的参数必须有length属性；
  val.length
}
let r4 = getType2("111111")



//默认泛型， 不传递直接为默认类型（类似函数的默认参数）
interface Dstr<T = string>{   //<T = string>表示T的默认类型为string
     name:T
}
type Dstr1=Dstr  //没有传参所以Dstr中的T为默认类型string
type Dstr2 = Dstr<number>  //传参数为number所以Dstr中的T就不是默认类型string而是传递的number类型
let obj:Dstr1 = {name:"str"}  // name规定为string类型
let obj1 = {name:12}



// 约束属性：
// getVal函数规定有两个参数，参数一为一个对象，参数二为参数一中的属性。但如果我在参数二中传了一个参数但是参数一中没有的属性要报错；
// <T extends Object,K extends keyof T> ,表示T 继承 Object类型，K 继承 T中的所有属性（keyof关键字表示取对象取中所有的key）
const getVal = <T extends Object,K extends keyof T>(obj:T,val:K)=>{

}

getVal({a:1,b:2},'b')  
//getVal({a:1,b:2},"c")  //报错因为{a:1,b:2}没有 c属性


// keyof的使用（取对象中所有的属性）
type t1 = keyof any // string | number | symbol (any类型中有string | number | symbol，这些属性)
type t2= keyof string   // 取string 中的属性 例如有： "toString" | "charAt" | "match" | "replace" | "search" | "slice" | "split" | "substring" | "toLowerCase" 等凡是字符串的属性都会有





// 类中使用泛型：
class MyArray<T>{
 public arr:T[] = []
 add(v:T){
   this.arr.push(v)
  }
  getMaxNum():T{
    let arr:T[] = this.arr;
     let max:T = arr[0];
     let current:T 
     for(let i=0;i<arr.length;i++){
        current = arr[i];
         current>max?max=current:void 0
     } 
     return max
  }
}
let arr = new MyArray<number>()
arr.add(1)
arr.add(2)
arr.getMaxNum()
/*
类MyArray的泛型传参的过程
let arr = new MyArray<number>()中的<number>传入class MyArray<T>中的T，这时T就是number类型了在类里就可以使用T去
修饰number类型的了

*/