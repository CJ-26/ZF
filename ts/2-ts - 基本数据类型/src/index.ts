//ts中拥有的类型：
/*
1.基本数据类型：
数字 字符串 布尔 
类型的标明 ：后面的都是类型  =后面的都是值例如：
let str:string = "123" //:后面为 string类型， =后面的为值"123"
*/


// 数字类型
let num:number = 10;
//字符串类型
let str:string = "zf";
//布尔类型
let bool:boolean = true;


//元组 ： 表示长度和内容个数，内容存放类型 都限制好了
let tuple:[string,number,boolean] = ["小明",10,false];
/* let tuple:[string,number,boolean] = ["小明",10,false]; 为元组 ,第一项必须是字符串，第二项必须是数字，第第三项必须是boolean类型，不能多也不能少，
*/

//但是元组可以添加内容，不能使用下标添加只能用方法例如 push,注意添加的内容必须是声明过的类型中的， tuple没有声明对象所以不能添加对象
tuple.push("小红")



//数组  ：存放一类类型的集合
let arr1:number[] = [1,2,3,5]  //只能方数字的数组
let arr2:string[] = ["小明","小红"]  // 只能放字符类型的数组

//那如果数组中有字符串也有数字类型，就需要用联合类型
//联合类型可以看作并集，既能使用数组又能使用字符串
let arr3:(number|string)[]=[1,2,3,4,"小明"]

// 多类型也可以使用泛型
let arr4:Array<number | string> = [1,2,3,4,"小明"]

// 什么都能放可以用 any
let arr5:any = [1,"小明",{age:12}]

 console.log(arr5[1])
//枚举类型 ：enum
/*
enum USER_ROLE{
   USER,
   ADMIN,
   MANAGER
} 翻译成js为：

 var USER_ROL={};
USER_ROLE[USER_ROLE["USER"] = 0] = "USER";
USER_ROLE[USER_ROLE["ADMIN"] = 1] = "ADMIN";
USER_ROLE[USER_ROLE["MANAGER"] = 2] = "MANAGER";
  这么写的意思是例如：USER_ROLE[USER_ROLE["USER"] = 0] = "USER" 给SER_ROLE添加属性0 值为"USER"，在USER_ROLE添加USER值为0
  也就是 console.log(USER_ROLE.[0]) // USER  console.log(USER_ROLE.USER) // 0

  枚举可以根据数字推断
*/
enum USER_ROLE{
   USER, 
   ADMIN,
   MANAGER
}
//默认可以正向取值，也可以反举
//正向取值：
console.log(USER_ROLE.USER) // 0
//反举
console.log(USER_ROLE[0]) // USER

//枚举类型 默认小标从零开始 也就是：
console.log(USER_ROLE.USER)  //0
console.log(USER_ROLE.ADMIN) //1
console.log(USER_ROLE.MANAGER) //2



// 异构枚举，可以在枚举类型中方不同的类型值；  
enum USER_ROLE1{
  USER="a",  //这样赋值之后默认下标为a，因为给的是a,不是数字它就不认识了，就没办法推断下一个的下标了，下一个也的赋值，如果下一个赋值为数字1那他就会认识继续推断下下一个个的小标为2了，能推断了后面的就不用在赋值了
  ADMIN=133,
  MANAGER
}

console.log(USER_ROLE1['USER'])  // a  但不能反举了console.log(USER_ROLE1["a"]) 报错‘


// 常量枚举： const enum  
// 常量枚举只是提供一个类型
const enum USER_ROLE2{
  USER,
  ADMIN
}
console.log(USER_ROLE2.USER)   // 0   生成js代码：console.log(0 /* USER */);  只提供了USER表示0这种类型；也就是说常量枚举只生成了 一个值，


// 枚举生成对象而常量枚举只生成一个值




//any类型 : 不进行类型检测的类型， 相当于没有写类型（就是什么类型都行）
let arr6:any=["zf",1,{age:3}]  //数组里什么类型都可以，
let t:any ="444"  //值什么类型也可以
// 尽量不要用any类型；


//null 和 undefined 为任何类型的子集也就是可以把unll 和 undefined 赋给任何类型，
//但是ts默认为严格模式，在严格模式模式下会进行非空检测也就是说 let str:string = null  会报错因为有严格模式检测
// 在严格模式下null只能赋给null，undefined只能赋给undefined. let nu:null = null; let un:undefined = undefined
//不能将null赋给undefined也不能经undefined赋给unll
// 如在tsconfig.json配置文件中将"strict": true,配置项改为strict:false,就可以就null和undefined赋给任意类型了 
// 非严格模式下null也可以给undefined，undefined也可以赋给null；

// 非严格模式下
// let str2:string = null
// let ster3:null = undefined
// let num1:number = null


// void 空类型； 只能接受null和undefined (一般用在函数默认的返回值，函数默认(没有return)的返回值就是undefined，用于标识函数的默认返回值)
let v:void = undefined;
function fn():void{

} // 不写return或者return undefined 正常， 返回其它类型报错；
//let v:void = null  在严格模式下会报错，非严格模式下正常， 严格模式下因为函数的默认返回值为undefined，不是nul 它认为是null为不合理的就报错了



// never类型 表示：永远不 ，是任何类型的字类型，可以把never赋予给任何类型；
// 永远达不到的就可以赋给never了
//永远达不到的有三种：一：报错， 二：死循环  三：类型判断时会出现never


// 报错的情况下：
function Mynever():never{
 throw new Error("出错了")
}

// let n = Mynever() //这样写也对，因为ts会自动推断类型，这里的let n = Mynever() 就没有写成let n:rever = Mynever()也没有报错就是因为ts的自动推断类型；
// let n_:never = Mynever()   

//never死循环 
function whileTrue():never{
    while(true){

    }
}

function byType(val:string|number){
  if(typeof val === "number"){
    val
  }else if(typeof val === "string"){
      val
  }else{
    val // 这里的val就是never类型
  }
}


// Symbol 类型 表示独一无二；
let s1:symbol = Symbol("123")
let s2 = Symbol("123")  // 不加:symbol ts会自行推导
console.log(s1==s2) // false
let obj = {
  s1:"12",
  s2:"34"
}
console.log(obj.s1) // 12


 
// BigInt 类型   表示大整型
// Number.MAX_SAFE_INTEGER表示最大精度；
let num1 = Number.MAX_SAFE_INTEGER+1  
let num2 = Number.MAX_SAFE_INTEGER+2
console.log(num1==num2)  // 输出为true，一个是加一，一个是加2为何还会是true那，因为Number.MAX_SAFE_INTEGER表示最大精度超出就计算不了
//如果想比较：
let num3:bigint = BigInt(Number.MAX_SAFE_INTEGER)+BigInt(1)    // BingInt只能和BigInt进行计算
let num4 = BigInt(Number.MAX_SAFE_INTEGER)+BigInt(2)  //不加:bigint ts会自行推导
console.log(num3==num4)  // false



// 对象类型 也就是非原始数据类型； object
const create = (obj:object)=>{
   
}
// create(1) 不可以传
// create(null)不可以传
// create(undefined)不可以传
//create("d") 不可以传
create([])  //可传
create({})   //可传
create(function(){}) // 可传


export{}  // 表示：防止模块间的干扰，比如两个模块有相同的变量会报错，加上 export{}这个文件自成一个模块不会影响别的模块；

// 类型总结： 字符串  数字 布尔 元组 数组  枚举 any  null nudefined never  Symbol BigInt


/*
什么时候标识类型什么时候不用标识类型（ts有自带类型推导功能）
let name; 当没有赋值的时候默认为any类型  //默认在初始时会类型推导；

let name1 = "小明" //这时的类型默认推导为string类型；
name1 = 11 这里会报错， 在赋值的时候如果不赋string类型就会报错；




numder 和 Numder的区别：
13..toString() // 13上本身是没有 toString()方法的，但是js回通过装包的形式给它 也就是13..toString()等于Numder(13).toString

let num:number = 12; //可以
let num1:Number = 13;  // 可以
let num3:number = Number(14); // 可以
let num4:Number = new Number(15) // 可以  // 类也时
let num5:number = new Number(16) // 不可以


js中：
Number(11).toString()
"11"
var num = 111;
num.toString()
"111"
111.toString() // 会报错 原因：JavaScript的解释器把数字后的"."偷走了（作为前面数字的小数点）
可以这样写： 111..toString()或者 (111).toString()  或者：111.0.toString() 

*/


//总结：类型的使用是首字母大写还是小写例如（number和Number等）
// 在标识类型时使用基本类型(例如number)
let num_ :number
num=12;
//在标识实例类型的时候用首字母大写的（例如Number） 
let num__:Number = new Number(15) 