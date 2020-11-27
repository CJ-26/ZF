/* 接口是用来描述对象的形状的,(也就是描述对象属性类型的)，
可以根据接口提供一些新的类型（例如ts内置的HTMLElement类型）为别人使用


接口可以描述 ：属性 方法   类


声明接口用： interface

interface与type的区别：
接口interface可以实现被继承 type不能
type可以写联合类型interface不能



一般能用接口就用接口，不能用在使用type
比较短的用type，复杂的用interface
*/


// 描述对象接口
interface IFullName{
  firstName:string,
  lastName:string,
}


const fullName = (obj:IFullName):IFullName=>{
       return obj
}

fullName({firstName:"z",lastName:"f"})






//描述函数本身：
//使用type:type FullName = (firtName:string,lastName:string)=>string
//接口的描述函数
interface IFullName1{
  (firtName:string,lastName:string):string //括号里面为参数类型，括号外为返回值类型
}
const fullName1:IFullName1 = (firtName:string,lastName:string):string=>{
    return  firtName+lastName
}
fullName1("z","f")


// 既有有函数，该函数上还有属性  叫混合类型
//混合类型一般用于一个函数返回一个这个函数的属性像下面的计数器：
interface ICount{
  ():number;
   count:number;
}
const fn:ICount=()=>{
  return ++fn.count
}
fn.count = 0;
console.log(fn())


//接口的特性
interface IVegetables{
  taste:string;
  color:string
}
// 如果我定义的值比接口中的值多可以采用类型断言，直接断言成对应的接口
const tomate:IVegetables = {  // 将接口IVegetables标识给tomate会报错解决方案可以用断言
  size:10,
  taste:"sour",
  color:"red"
} as IVegetables   // 使用断言 接口IVegetables里标识的属性和对应的类型在对象tomate中必须存在，如果IVegetables里面有，tomateli没有报错，tomate里面有的属性在IVegetables里面没有不报错，断言就是为了解决tomate中有的属性IVegetables里面没有直接用IVegetables描述tomate会报错的问题

// 如果不使用断言： 同名的接口会进行合并
interface IVegetables1{
  taste:string;
  color:string
}
interface IVegetables1{
  size:number;
}
// 因为接口的名字相同都是IVegetables1所以两个接口会进行合并
const tomate1:IVegetables1= { 
  size:10,
  taste:"sour",
  color:"red"
} 








//接口的继承：（继承的关键字extends用法 ：接口1 extends 接口2 表示接口1继承接口2，接口的多继承：接口1 extends 接口2,接口3,接口4 表示接口一继承接口2  接口3 接口4 ）
interface IVegetables2{
  taste:string;
  color:string
}
//接口的继承 ITomate继承了IVegetables2 (也就说明的接口是可以扩展的)
interface ITomate extends IVegetables2{
  size:number;
}
const tomate2:ITomate= { 
  size:10,
  taste:"sour",
  color:"red"
} 


// 接口可以多继承，(多继承时如果后面的接口属性与前面的相同但类型不同是不会被覆盖的会报错)
interface _IVegetables2{
  taste:string;
  
}
interface _IVegetables2_1{
  color:string
}
// 接口的多继承
interface _ITomate extends _IVegetables2,_IVegetables2_1{
  size:number;
}
const _tomate2:_ITomate= { 
  size:10,
  taste:"sour",
  color:"red"
} 













// 如果对象的属性可有可没有的情况:(接口的可选属性)
interface ITomate3{
  readonly size:number, // 加了readonly表示这个属性为仅读属性不能修改
  taste:string,
  color?:string,  // ?表示可选
  type?:string
}
const tomate3:ITomate3= {  // 没有type属性因为接口中type属性是被标有问好的表示可选
   size:10,
  taste:"sour",
  color:"red"
} 
const _tomate3:ITomate3= {   // 没有color属性因为接口中属性color是被标有问好的表示可选
  size:10,
  taste:"sour",
   type:"vegetables"
} 




// 接口的任意属性的写法：

interface ITomate4{
  size:number, 
  taste:string,
  [key:string]:any  // 任意类型。在对象中可以随便变添加属性,[key]这里的key是随便起的名字
}
const tomate4:ITomate4= { 
  size:10,
  taste:"sour",
  color:"red",      // 因为ITomate接口中有任意类型[key:string]:any,所以修饰的对象可以任意加属性
  type:"vegetables",
  1:1,
} 
// 注意 接口ITomate4虽然有任意类型但接口里面也有必填的属性 size:number,taste:string, 修饰的对象里面必须要有 size:number,taste:string，这两个属性，其余的就随便了


//可索引的接口：
interface IArr{
  [index:number]:any  // index为下标，下标为number类型值为any 所以数组为任意数组
}
let arr:IArr = ["1",1,{},false]


//-----------------------------------------------------------------------------------



//  接口可以被类来实现,类也可以实现多个接口  ：  implements 类实现接口连接的关键字（类实现一个接口的用法：类 implements 接口。  类实现多个接口的用法：类 implements 接口1,接口2,接口3）
interface Speakable{
  name:string,
  speak():void  // 表示类中有方法speak返回值为void空类型(void描述类的方法返回值时表示不关心返回值的类型也就是返回什么类型都行)                                                                                                                                                                                                                                    
}               // void仅限于在类中标识类的方法的返回值的时候，表示不关心返回值的类型
                // 如果类中的方法返回值标识了除void类型以外的类型，那就必须是这个类型
class Speak  implements Speakable{
  name!:string;
  speak():string{  // 接口中描述的speak的返回值为void空类型这里标注的为string类型为和不报错，因为接口标注类的方法返回值为void类型表示不关心返回值的类型。所以不会报错
    throw new Error("报错")
  }
} 

// 类不但可以实现一个接口也可以实现多个接口， //多个接口中如果接口和接口中出现同名不同类型的不会后面覆盖前面会报错；
interface Speakable1{
  name:string,
  speak():number 
}
interface ChineseSpeakable{
  speakChnese():void
}
class Speak1  implements Speakable1,ChineseSpeakable{
  speakChnese(): void {
    throw new Error("Method not implemented.")
  }
  name!:string;
  speak():number{  
     return 10
  }
} 


// 类的接口与接口也能继承

interface Speakable2{
  name:string,
  speak():number 
}
interface ChineseSpeakable2{
  speakChnese():void
}
// 接口继承
interface FinalSpeak extends Speakable2,ChineseSpeakable2{
  begin():void
}
class Speak2  implements FinalSpeak {
  speakChnese(): void {
    throw new Error("Method not implemented.")
  }
  name!:string;
  speak():number{  
     return 10
  }
  begin():string{
    return "吃"
  }
} 



// 接口描述实例：
class Animal1 {
  constructor(public name:string){  //这种写法constructor(public name:string){}表示 声明了一个name属性,这种写法和 class App{public name:string; constructor(name:string){this.name=name}} 样的；
    this.name= name
  }
}
// 函数createClass1创建一个类
// 描述类的第一写法：clazz:new(name:string)=>any  因为能new所以clazz为一个构造函数类型，参数为name字符串类型，会返回一个any类型的
function createClass1(clazz:new(name:string)=>any,name:string){  
  return new clazz(name)
 }
 let r1 = createClass1(Animal1,"Tom")




//描述类的第二写法：clazz:{new(name:string):any} 因为能new所以clazz为一个构造函数类型，参数为name字符串类型，会返回一个any类型的

class Animal2 {
  constructor(public name:string){  //这种写法constructor(public name:string){}表示 声明了一个name属性,这种写法和 class App{public name:string; constructor(name:string){this.name=name}} 样的；
    this.name= name
  }
}
function createClass2(clazz:{new(name:string):any},name:string){  
  return new clazz(name)
 }
  let r2 = createClass2(Animal2,"Tom")




//第三种写法利用接口：
class Animal3 {
  constructor(public name:string){  //这种写法constructor(public name:string){}表示 声明了一个name属性,这种写法和 class App{public name:string; constructor(name:string){this.name=name}} 样的；
    this.name= name
  }
}
interface IClass1{  //这里能new表示为一个构造函数类型
  new(name:string):Animal3  //可以把类当作为一个类型
}
  
function createClass3(clazz:IClass1,name:string){
 return new clazz(name)
}
  let r3 = createClass3(Animal3,"Tom")


  //上面的接口 interface IClass{ new(name:string):Animal} 直接将构造函数的返回值定成了Animal，这就定死了，创建别的类就不能调用了
  // 这就需要泛型了哈哈。。
  //泛型：就是当调用时传入具体的类型，先用一个标识符占位
  interface IClass2<T>{  //<T>:表示声明一个T变量
    new(name:string):T //这个T是声明的(<T>)T传入的
  }
  class Anima4 {
    constructor(public name:string){  //这种写法constructor(public name:string){}表示 声明了一个name属性,这种写法和 class App{public name:string; constructor(name:string){this.name=name}} 样的；
      this.name= name
    }
  }
  function createInstance4<T>(clazz:IClass2<T>,name:string){
    return new clazz(name)
   }
  let r4 = createInstance4<Animal1>(Anima4,"Tom")
 // 变量怎么接受到值的： 由 ：let r4 = createInstance4<Animal4>(Anima4,"Tom") 中的<Animal4>将Animal4传给： function createInstance4<T>(clazz:IClass2<T>,name:string){return new clazz(name)}的第一个<T> 在由这个<T>传入第二个<T>（也就createInstance4函数(clazz:IClass2<T>,name:string)这里的T），这有这个T传入到 interface IClass2<T>{new(name:string):T }中的第一个T再有这个T传入new(name:string):T中的T，



// 因为声明  一个类时，除了创建这个类，同时也创建了一个该类的类型，也就是这个类的实例的类型。（注意创建了一个实例的类型）
//所以这个类也可以当作一个接口来使用例如：
class Person {  // 创建了一个实例的类型
  name: string
  age: number
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
  run(): void { }
}
const foo: Person = { //将这个实例的类型当作接口来使用
  name:'foo',
  age:18,
  run(){}
}

// 但是实例的类型是不包括构造函数constructor、静态属性或静态方法,因为生成的实例也不包含这些 例如：
class Person1 {
  name: string
  constructor(name: string) {
    this.name = name
  }
  run(): void { }
  static age: number
  static jump(): void { }
}
const foo1: Person1 = {
  name: 'foo',
 // age: 18, // 报错因为  “age”不在类型“Person”中
  run() { },
 // jump(): void { } //报错 因为 jump”不在类型“Person”中
}




//总结  可以描述对象 函数 类  类的实例



// 接口中的写法可用逗号分割也可以用分号分割例如：
// interface yy{
//   name:string;
//   age:number;
// }
// interface yy{
//   name:string,
//   age:number
// }

export {}






/*
 简书ts的接口：
 地址：https://www.jianshu.com/p/099c5683ffb5
一、什么是接口

常用于对对象的形状（Shape）进行描述。
可用于对类的一部分行为进行抽象
为类型命名和为你的代码或第三方代码定义契约。
二、对象与接口
2.1 对象接口简例
接口一般首字母大写。tslint建议加上I前缀, 否则会发出警告,可在tslint中关闭它,在rules添加规则 ["interface-name":[true,"nerver-prefix"]

interface Person {
  name: string,
  age: number
}
const why: Person = {
  name: 'why',
  age: 18
}
首先我们定义了一个接口Person,接口约束了shape必须要有name,age两个属性,并且有对应的数据类型,然后我们创建了 why对象面向Person

定义的变量比接口少一些属性是不被允许的：
IDE 添加了tslint插件会发出警告,编译和浏览器控制台会报错

interface Person {
  name: string,
  age: number
}
const why: Person = {
  name: 'why',
}
// Property 'age' is missing in type '{ name: string; }' but required in type 'Person'.
属性溢出也是不允许的：

interface Person {
  name: string,
  age: number
}
const why: Person = {
  name: 'why',
  age: 18,
  gender: 'female'
}
需要注意接口不能转换为 JavaScript。 它只是 TypeScript 的一部分。
可在TypeScript学习乐园实时转换TypeScript

2.2 可选属性与只读属性
如果希望不要完全匹配形状，那么可以用可选属性：?
如果希望对象中的一些字段只读，那么可以用 readonly 定义

interface Person {
  name?: string,
  readonly age: number,
  run?(): void,
}
const why: Person = {
  // name 键值对缺失不会报错
  age: 18
}
why.run&&why.run() //判断函数执行
why.age++  //修改age报错 Cannot assign to 'age' because it is a read-only property.
2.3 任意属性
如果希望一个接口有任意的属性，可以使用如下方式
(1) 可索引类型

interface Person {
  name: string,
  age?: number,
  [attr: string]: any
}
const why: Person = {
  name: 'why',
  age: 18,
  gender:'female'
}
需要注意，定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集,否则会出现unexpected error.

interface Person {
  name: string,
  age?: number,
  [attr: string]: string // error
}
const why: Person = {
  name: 'why',
  age: 18,
  gender:'female'

  //  Type '{ name: string; age: number; gender: string; }' is not assignable to type 'Person'.
  //  Property 'age' is incompatible with index signature.
  //  Type 'number' is not assignable to type 'string'. 
}

(2) 类型断言

有两种方法

interface Person {
  name: string,
  age?: number,
}
const why: Person = <Person>{
  name: 'why',
  age: 18,
  gender:'female'
} 
当然要配置 tslint "no-angle-bracket-type-assertion":false否则tslint会报错,因为它推荐你使用第二种方式

interface Person {
  name: string,
  age?: number,
}
const why: Person = {
  name: 'why',
  age: 18,
  gender:'female'
} as Person
(3) 类型兼容性

interface IUser {
  name: string,
  age: number,
}
type IUserFunc = (user: IUser) => string

const foo: IUserFunc = (user: IUser) => {
  return user.name
}

foo({ name: 'clc', age: 18, gender: 'male' }) //error
// TS2345: Argument of type '{ name: string; age: number; gender: string; }' is not assignable to parameter of type 'IUser'.
//Object literal may only specify known properties, and 'gender' does not exist in type 'IUser'.

const bar = { name: 'clc', age: 18, gender: 'male' }
foo(bar)
// 用变量bar 接收参数再传入正常编译
直接传参报错,但用变量bar接收再传入正常编译

2.4 联合类型
interface UnionType {
  bar: any[] | (() => void) | object
}
const foo:UnionType = {
  bar:['w','h','y']
// bar 是一个any类型的数组
}
const foo:UnionType = {
  bar() {}
// bar 是一个返回值为void的函数
}
const foo:UnionType = {
  bar: {}
// bar 是一个对象
}
2.5 可索引类型
可索引类型内有一个索引签名,它表示了索引的类型,还有索引值对应的值的类型

2.5.1 数字索引签名
index 作为签名占位,可为任意字符.

interface NumMap {
  [index: number]: string
}
const obj: NumMap = {
  0: 'foo',
  1: 'bar',
  '2': 'why',
  'c': 'clc' //errorType  is not assignable to type 'NumMap'.Object literal may only specify known properties, and ''c'' does not exist in type 'NumMap'.
}
obj[0] // foo
obj[2] // why
数字作为对象的键是转换为字符形式的,key为数字字符串正常编译,若为非数字字符串,报错.

数组本身索引签名即为number 类型

interface NumMap {
  [index: number]: string
}
let arr: NumMap
arr = ['foo', 'bar']
2.5.2 字符索引签名
interface StrMap {
  [str: string]: string
}
let obj: StrMap = {
  foo: 'foo',
  bar: 'bar',
  1: 'why'  // 正常编译
}
const arr: StrMap = ['foo','bar'] // error 缺少字符索引签名
字符索引签名类型包含一部分数字索引签名类型

可同时使用两种索引类型,但是数字索引的返回值必须是字符索引返回值的子类型

interface StrNumMap {
  [str: string]: any,  // any
  [index:number]: string
}
let obj: StrNumMap = {
  foo: 'foo',
  bar: 'bar',
  1: 'why'
}
const arr: StrNumMap = ['foo','bar'] // 正常编译
2.6 可同时面向多个接口

三、函数与接口
3.1 TypeScript函数存在的问题
为了防止错误调用,给函数的参数和返回值定义了类型限制,但代码长不方便阅读

const foo = (name: string, age: number): string => {
  return `name : ${name}, age: ${age}`
}
3.1.1 使用接口重构一
interface IUser {
  name: string,
  age: number,
}

const foo = ({name,age}:IUser): string => {
  return `name : ${name}, age: ${age}`
}
还可以把参数对象替换成一个变量user

interface IUser {
  name: string,
  age: number,
}

const foo = (user:IUser): string => {
  return `name : ${user.name}, age: ${user.age}`
}
3.1.2 使用接口重构二
定义函数还可以写成如下形式

const foo: (name: string, age: number) => string = (name, age) => {
  return `name : ${name}, age: ${age}`
}
接着定义两个接口

interface IUser {
  name: string,
  age: number,
}
interface IUserFunc {
  (user:IUser):string
}
// warn Interface has only a call signature — use `type IUserFunc = // (user:IUser) =>string` instead.
第二个接口会报警告,tslint建议您如果一个函数接口只有一个方法,建议使用类型别名,type语句, 可配置["callable-types":false] 关掉它,或者听它的吧

type IUserFunc = (user: IUser) => string
接下来按步重构函数

interface IUser {
  name: string,
  age: number,
}
type IUserFunc = (user: IUser) => string

const foo: (name: string, age: number) => string = (name, age) => {
  return `name : ${name}, age: ${age}`
}
面向第一个接口

const foo: (user:IUser) => string = (user) => {
  return `name : ${user.name}, age: ${user.age}`
}
next

const foo: IUserFunc = user => {
  return `name : ${user.name}, age: ${user.age}`
}
函数简短了许多,并且看接口就可以知道函数参数,返回值的类型限制

3.2 混合类型
interface Counter {
  count: number,
  ():void
}
function getFunc(): Counter {
  function fn(){
    fn.count++
  }
  fn.count = 0
  return fn
}
函数getFunc返回类型为混合类型,即做为函数和对象使用，并带有额外的属性。

四、类与接口
接口对类的一部分行为进行抽象。

4.1 类实现接口
实现（implements）是面向对象中的一个重要概念。一个类只能继承自另一个类，不同类之间可以有一些共有的特性，就可以把特性提取成接口（interfaces），用 implements 关键字来实现。

(1)TypeScript中定义一个基本的类

class Person {
  name: string
  run:Function
  constructor(name: string) {
    this.name = name
    this.run=()=>{}
  }
}
class Rapper extends Person {
  age: number
  constructor(name: string, age: number) {
    super(name)
    this.age = age
  }
  rap(){
    console.log('I can sing and dance tap');
  }
}
(2) implements 关键字实现接口

interface Skr {
  name: string,
  age: number,
  rap():void
}
class Person {
  name: string
  constructor(name: string) {
    this.name = name
  }
}
class Rapper extends Person implements Skr{
  age: number
  constructor(name: string, age: number) {
    super(name)
    this.age = age
  }
  rap(){
    console.log('I can sing and dance tap');
  }
}
虽然定义了一个接口,但是在接口类中的属性和方法还是要写类型限制.感觉代码反而应为接口冗余了.
但类的接口是一种规范,因为接口分离了规范和实现,可通过接口轻易解读类必须提供的属性和方法,增强了可拓展性和可维护性.

(3) 一个类可实现多个接口

interface Skr {
  name: string,
  age: number,
  rap():void
}
interface SkrSkr{
  sing():void
}
class Person {
  name: string
  constructor(name: string) {
    this.name = name
  }
}
class Rapper extends Person implements Skr,SkrSkr{
  age: number
  constructor(name: string, age: number) {
    super(name)
    this.age = age
  }
  rap(){
    console.log('I can sing and dance tap');
  }
  sing(){
    console.log('I can sing and dance tap');
  }
}
五、接口继承
接口可以通过其他接口来扩展自己。
Typescript 允许接口继承多个接口。
继承使用关键字 extends。
5.1 单接口继承
extends 关键字后加继承的接口

interface Person {
  name: string,
  age: number
}
interface Students extends Person {
  gender: string
}
const foo: Students = {
  name: 'why',
  age: 18,
  gender: 'female'
}
5.2 多接口继承
多接口之间逗号分隔

interface Sing {
  sing(): void
}
interface Jump {
  jump(): void
}
interface Rap extends Sing, Jump {
  rap(): void
}
const foo: Rap = {
  sing(){},
  jump(){},
  rap(){}
}
5.3 接口继承类
常见的面向对象语言中，接口是不能继承类的，但是在 TypeScript 中却是可行的
用extends关键字继承类

class Person {
  name: string
  age: number
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
  run(): void { }
}
interface User extends Person {
  gender: string
}
const foo: User = {
  name: 'foo',
  age: 18,
  gender: 'male',
  run():void { }
}
本质上就是接口继承接口

interface Person {
  name: string,
  age: number,
  run(): void
}
interface User extends Person {
  gender: string
}
const foo: User = {
  name: 'foo',
  age: 18,
  gender: 'male',
  run(): void { }
}
因为声明 class Person时，除了创建一个名为 Person的类，同时也创建了一个名为 Person的类型（实例的类型）。
所以 Person既可以 当做一个类来用,也可以把它实例的类型当成接口使用

class Person {
  name: string
  age: number
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
  run(): void { }
}
const foo: Person = {
  name:'foo',
  age:18,
  run(){}
}
实例的类型是不包括构造函数constructor、静态属性或静态方法,因为生成的实例也不包含这些


class Person {
  name: string
  constructor(name: string) {
    this.name = name
  }
  run(): void { }
  static age: number
  static jump(): void { }
}
const foo: Person = {
  name: 'foo',
  age: 18, //  “age”不在类型“Person”中
  run() { },
  jump(): void { } // jump”不在类型“Person”中
}

*/