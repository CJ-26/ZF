// ts中的兼容性 ， 一个类型能否被赋予另一个类型

import { type } from "os"

// 1、基本类型的兼容性
let str!:string
let templ!:string  | number
//str = templ  // 报错  ： templ的类型为string或者为number,而str的类型只能是string，将templ赋给str但是如果templ是number类型哪不就报错了吗，（ts是为安全考虑）
 templ = str   // （ts安全性考虑）





 
 interface Mynum{  
   toString():string
 }

 let str1:Mynum = "ssss"  // 由于字符传上包含toString方法所以可以把字符串赋给 Mynum类型

 let str2!:Mynum
//let str3:string = str2 //报错，因为 str2只有一个toSting属性，而str3为string类型，不只toString这一个属性，不符合要求报错




// 接口类型的兼容性
interface Animal{
  name:string;
  age:number
}
interface Person{
  name:string,
  age:number,
  adress:string
}
let animal!:Animal
let persom!:Person

//persom = animal  // 报错 因为person接口必须要有adress
animal = persom   //正常，animal需要的persom中都有



//函数 ，函数的兼容性（需要考虑函数的参数和返回值）

// 函数的兼容性，参数的要求，赋值的函数的参数要小于等于被赋值的函数
let sum1  = (a:string,b:string)=>{}
let sum2 = (a:string)=>{}
//sum2 = sum1  //报错 因为sum1有两个参数 sum2只有一个参，ts安全性考虑 sum2对应的函数规定只有一个参数，我给了一个两个参数的函数,我已经规定了你还给我两个肯定不行呀
sum1 = sum2   //正常，因为sum1可传两个参数，我赋给了一个参数的函数，就相当于哪个第二参数我没有用到，所以是可以的，就类似于数组的forEach方法可以少传和不传参数但不能，多传；


//实现forEach
type ForEachFn<T> = (item:T,index:number,arr:T[])=>void
function forEach<T>(arr:T[],cb:ForEachFn<T>){
     for(let i:number = 0;i<arr.length;i++){
        cb(arr[i],i,arr)
     }
}
forEach(["d",2,3,4,5],function(item,index){  //这里少参数也可以，但不能多参
  console.log(item)
})


// 函数的返回值
type sum3 = ()=>string | number
type sum4 = ()=>string;

let fn:sum3 = ()=>{
  return 12
}

let fn1:sum4 = ()=>{  
  return "xxx"
} 
//fn1 = fn //报错，因为 fn1的返回类型只能是string，fn的返回值可能是number，所以类型不同不行
fn = fn1  // 正常 因为fn类型函数可以返回string或者number类型，fn1的函数类型是只能返回string，fn1是符合fn类型的所以正常；


// 函数的返回值为对象：
type sum5 =()=>{name:string,age:number}
type sum6 = ()=>{name:string}
let fn2:sum5 = ()=>{return {name:"小红",age:12}}
let fn3:sum6 =  ()=>{return {name:"小明"}}
//fn2 = fn3 // 报错  因为fn2的类型函数返回值为：{name:"小红",age:12}} 而  fn3函数的类型返回值为{name:"小明"}，所以将fn3赋给fn2报错少了一个类型报错
fn3 = fn2   //正常因为因为 fn3函数的类型返回值为{name:"小明"}而  fn2的类型函数返回值为：{name:"小红",age:12}} ，fn2包含fn3.所以将fn2赋给fn3是可以的





// 协变（函数的返回值，可以协变也就是可以传递儿子）     与           逆变 （函数的参数可以逆变传递父级）
class Parent{
  address:string = "回龙观"
}
class Child extends Parent {
  money:number = 100
}

class Grandson extends Child{
  name:string = "Tom"
}

type MyFn = (person:Child)=>Child;
 function getFn(cb:MyFn){  };
 getFn((person:Child)=>new Child) // 正常的传递
 //逆变 （函数的参数可以逆变传递父级）
 getFn((person:Parent)=>new Child)   //正常根据类型为 getFn((person:Child)=>new Child) 逆变后：  getFn((person:Parent)=>new Child) 
 //  getFn((person:Grandson)=>new Child)  报错   //因为参数的类型为:type MyFn = (person:Child)=>Child;也就是Child， Child是继承Parent的，所以只能处理Child和Parent类型，，Grandson是处理不了的


// 函数的返回值协变 ：
getFn((person:Child)=>new Grandson)   // 返回值协变，Grandson是包含Child的所以可以返回的
//getFn((person:Child)=>new Parent)  // 报错 Parent是不包含Child的所以返回时报错的

// 函数的参数在非严格模式下，是双向协变
//传父
getFn((person:Parent)=>new Child)
//传子
//getFn((person:Grandson)=> new Child)  //这么使用必须是在函数的非严格模式下，在tsconfig.json 将配置"strictFunctionTypes"的注释打开值修改为false                                                                                                         



  //  参数逆变的栗子
function _getFn(cb:(person:string | number)=>number){
}
_getFn((person:string|number|boolean)=>12)  // 也就是说_getFn函数调用的参数可以这样传：_getFn((true)=>12) _getFn(("2")=>12) _getFn((1)=>12) , 因为 cb:(person:string | number) cb的参数类型为string | number而string | number |  boolean 包含string | number为父级                                                                                  

//总结函数可以在传参数的时候可以传父类型，return时可以return子类型




// 类的兼容性
class Person1{
  name:string = "zf"
}
class Person2{
  name:string = "zf"
}
let p1!:Person1
let p2!:Person2
p1=p2
p2 = p1   // 类中只有属性且两个类的属性相同，则两个类作为类型使用的时候修饰的变量可以相互赋值

// 如果存在私有 private或者 protected 则两个类则两个类作为类型使用的时候修饰的变量永远不可以相互赋值
class Person3{
  private name:string = "zf"
}
class Person4{
  name:string = "zf"
}
let p3!:Person3
let p4!:Person4
  // p3=p4  报错  存在 private
  // p4 = p3   报错 存在 private


 
 
  // 类在类型使用的时候，一个类中属性多的 另一个类的属性少,但属性多的包含属性少的所有属性 ，则多属性的可以赋给少属性的反之不行
  class Person5{
    name:string = "zf"
  }
  class Person6{
    name:string = "zf"
    age:number = 12
  }
  let p5!:Person5
  let p6!:Person6
    //p6 = p5  报错 ： 
    p5 = p6
  





// 枚举类型永远不兼容

enum E1{

}

enum E2{

}

let e1!:E1
let e2!:E2
// e1=e2   报错枚举类型永远不兼容
// e2=e1  报错枚举类型永远不兼容


//泛型 根据最终的结果来是否确定兼容不兼容
interface A<T>{
 [key:number]:T
}
interface B<T>{
  [key:number]: T
}
type A1 = A<string>
type B1 = B<number>
let a1!:A1
let b1!:B1
// a1 = b1
// b1 = a1 // 报错 //类型不同


// 如果两个接口为空可以兼容
interface A2<T>{

}
interface B2<T>{
  
}
type A3 = A2<string>
type B3 = B2<number>
let a3!:A3
let b3!:B3
a3 = b3
b3 = a3  // 因为不管泛型传的值时什么但接口为空，没有使用这传进来的类型所以兼容


// 接口的内相同泛型传的类型也相同可以兼容
interface A4<T>{
  [key:number]:T
 }
 interface B4<T>{
   [key:number]: T
 }
 type A5 = A4<string>
 type B5 = B4<string>
 let a4!:A5
 let b4!:B5
 a4 = b4
 b4 = a4  // 口的内相同泛型传的类型也相同可以兼容










// 赋类型总结：
/*
1、基本类型，可以小范围的赋给多范围的
2、接口类型 可以范围大的赋给范围小的
3、函数的兼容性：可把参数少的函数赋给参数多的函数
4、函数的返回值， 遵循 1、2、3条 看返回的是什么类型，基本类型就1，接口类型就是 2 、 函数类型就是： 3，（传父反子）
5、类大的兼容，以范围大的赋给范围小的
6、枚举永远不兼容
7、泛型的兼容看最终的结果兼不兼容

*/