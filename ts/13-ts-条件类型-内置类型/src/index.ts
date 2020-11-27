//条件类型 。就是js中的三元表达式
// ts中中有好多内置类型例如HTMLElement....等等                                                                                                                                                                                               



// 泛型约束：
//下面的例子：给泛型传入 Bird返回 Sky类型，传入其余的返回Swiming类型
interface Bird{
  name1:string
}
interface Sky{
  sky:string
}

interface Fish{
  name2:string
}
interface Swiming{
  swim:string
}

// 判断一个泛型的变量是否为那种类型（写法：变量 extends 类型 ）
type MyType<T> = T extends Bird?Sky:Swiming //   T extends Bird?Sky:Swiming 表示T是否为Bird如果是就返回Sky不是就返回Swiming

type x= MyType<Bird> //传入 Bird返回Sky类型；所以x为Sky类型

type animal = {
  name:string
}
type y = MyType<animal>  // 除传入Bird之外都会返回Swiming类型，所以y为Swiming类型


// 利用兼容性的传入：

interface Bird1{
  name1:string
}
interface Sky1{
  sky:string;
}
interface Fish1{
  name2:string
}
interface Swiming1{
  swim:string
}

type _x<T> = T extends Bird1 ? Sky1 : Swiming1
type animal1= {
  name1:string,
  a:string,
  b:string
}
type _y =_x<animal1> // 返回 Sky1 类型因为animal1兼容Bird1




//条件分发：（只有联合类型会进行分发操作）
interface Bird2{
  name1:string
}
interface Sky2{
  sky:string;
}
interface Fish2{
  name2:string
}
interface Swiming2{
  swim:string
}

type _x1<T> = T extends Bird2 ? Sky2 : Swiming2
type _y1 =_x1<Bird|Fish2> // _y1的类型为 Sky|Swiming ，因为条件分发：当传入联合类型是，T extends Bird2会根据联合类型一个一个的去判断，类似循环 


// 交叉类型不会进行分发操作：
interface Bird3{
  name1:string;
}
interface Sky3{
  sky:string
}
interface Fish3{
  name2:string;
}
interface Swiming{
  swim:string
}
type _x2<T> = T extends Bird3?Sky3:Swiming
type _y2 = _x2<Bird3&Fish3>  //_y2的类型为Bird因为 Bird3&Fish3的类型为{ name1:string;name2:string;} 会兼容 Brid3所以_y2的类型为Brid3，（注意交叉类型不会分发，只有联合类型才会条件分发）、



// 交叉类型复习：
interface Person1{
  handsom:string;
}
interface Person2{
 heigh:string;
}
 type Person3 =Person1&Person2;
 let p1!:Person1 
 let p2!:Person2 
 let p3!:Person3 
 p1 = p3
 p2 = p3




// ts的内置类型：
//Exclude(排除某个类型)（用法：Exclude<string|number|boolean,boolean> //从string和number和boolean中排除掉boolean类型）
type MyExcude = Exclude<string|number|boolean,boolean> //（从string和number和boolean中排除掉boolean类型）
//Exclude排除类型的实现

type _Exclude<T,U> =T extends U?never:T   //在类型中返回never就是没有类型什么都没返回
type _MyExclude = _Exclude<string|number|boolean,boolean>


//Extract 抽离类型（用法：Extract<string|number|boolean,string> 抽离出string类型，也就是当前的类型为string类型）
type MyExtract = Extract<string|number|boolean,string>  //抽离类型这里抽离的为string，所以 MyExtract的类型为抽离出来的string类型
// Extract 抽离类型的实现：
type _Extract<T,U> = T extends U?T:never  //或者type _Extract<T,U> = T extends U?U:never
type _MyExtract = _Extract<string|number|boolean,boolean> 




// 非null或者undefinde检测：NonNullable:排除空类型：（用法：NonNullable<string|number|boolean|null>会排除空类型null也就是说当前类型为身体string|number|boolean类型）
type MyNonNullable = NonNullable<string|number|boolean|null>  //MyNonNullable的类型为string|number|boolean排除了null空类型
//实现NoNullable:
type _NonNullable<T> = T extends null | undefined ?never:T

type _MyNoNullable = _NonNullable<string|number|boolean|null>



//类型推导：infer （infer为推断类型，使用方法;infer T  表示推断T的类型）

// 在不执行函数的情况下查看函数返回值的类型：使用 ReturnType 
// ReturnType的使用：用来不执行函数取函数的返回值; ReturnType<函数的类型>记住<>里面是函数的类型不是函数
function getUser(){
  return {name:"zf",age:11}
}
type MyReturnType = ReturnType<typeof getUser>  // MyReturnType的类型就是函数getUser函数的返回值的类型，<typeof getUser>是取函数getUser的类型，ReturbType的使用：ReturnType<函数的类型>
// ReturnType的实现：
type _ReturnType<T extends (...args:any[])=>any> =  T extends (...args:any[])=>infer R ?R:never;
// <T extends (...args:any[])=>any>约束泛型T必须传递一个函数，，，   T extends (...args:any[])=>infer R ?R:never; :如果T是函数则返回R(R为自定义的随便是什么都行，用来接收函数的返回值，infer为关键字用来推断类型，也就infer推断出的类赋给R)

// 推导函数的参数: (获取函数的参数可以用Parameters用法Parameters<函数的类型>)
function getUser1(a:string,b:number){
  return {name:"小明",age:13}
}
 type MyParamsType = Parameters<typeof getUser1> //MyParamsType的类型为MyParamsType，使用Parameters可以推导函数的参数的类型
 //实现Parameters
type _Parameters<T extends (...args:any[])=>any> = T extends (...args:infer R) =>any?R:never
type MyParamsType1 = _Parameters<typeof getUser1>  // 推导getUser的参数的类型为MyParamsType1




//推断构造函数的参数 ：使用的关键字为:ConstructorParameters用法ConstructorParameters<typeof 类名>

class Animal{
  constructor(name:string,age:number){

  }
}

type MyConstructor = ConstructorParameters<typeof Animal> //MyConstructor的类型为[name: string, age: number]也就是构造函数的参数类型

// 实现ConstructorParameters:
type _ConstructorParameters<T extends new(...args:any[])=>any> = T extends new(...age:infer U)=>any?U:never;
type _MyConstructor = _ConstructorParameters<typeof Animal> // _MyConstructor的类型为[name: string, age: number]也就是Animal构造函数的参数


// 推断构造函数的返回值：InstanceType (InstanceType为推断构造函数的返回值的关键字，用法InstanceType<tyepof 类名>)

class Animal1{
  constructor(name:string,age:number){

  }
}
type MyInstance = InstanceType<typeof Animal1> //MyInstance的类型为MyInstance
// 实现InstanceType：
type _InstanceType<T extends new(...args:any[])=>any> = T extends  new(...args:any[])=>infer R ? R : never
type _MyInstance = _InstanceType<typeof Animal1> //_MyInstance的类型为Animal1






//--------------------------------------------------------
//内置类型（转化类型）


//将接口内规定的属性变为可选类型关键字为：Partial (用法 type 别名 = Partial<要转化成可选类型的接口>)                                                                                                                                                                                                                                
interface Person{
  name:string;
  age:number;
  address:string;
  company:any
}
 type MyPerson = Partial<Person>
 /*
 MyPerson的类型变为：
 {
    name?: string | undefined;
    age?: number | undefined;
    address?: string | undefined;
    company?: any;
} 
可选类型；
 */
let myperson:MyPerson = {
  name:"小明",
  //a:12  //报错   //MyPerson中的类型可有可无，但是MyPerson里面没有是不能添加的
}  

// 实现Partial：
type _Partial<T> = {[K in keyof T]?:T[K]} // {[K in keyof T]?:T[K]}注释：[K in keyof T]循环出所有T中的属性，T[K]：在T中取出K表示的属性对应的类型，{[K in keyof T]?:T[K]}就是循环取出T所有的属性，一次给K并把T中对应K的类型赋给，当前的K(K也就是T中的属性)，并且将K 都见可选属性的标识？ ,{[K in keyof T]?:T[K]}因为外部还有{}所以把每个循环出来的 属性并且加了？的放到{}里面                                                                                
interface Person1{
  name:string;
  age:number;
  address:string;
  company:any
}
 type MyPerson1 = _Partial<Person1>
let myperson1:MyPerson1 = {
  name:"小明",
  
}






//要求接口内层套接口，内层接口也可选

interface Company{
  name:string,
  age:number;
  address:string,
}

interface Person2{
  name:string,
  age:number,
  company:Company
}
type Deepartial<T> = {[K in keyof T]?:T[K] extends object ? Deepartial<T[K]>:T[K]}
/*
 {[K in keyof T]?:T[K] extends object ? Deepartial<T[K]>:T[K]}
 [K in keyof T]?:T[K]   解释:将接口中属性设置成可选类型；
T[K] extends object ? Deepartial<T[K]>:T[K]} 解释：判断T[K]是否为一个object如果是将该对象传入接口Deepartial<T[K]>继续递归调用接口不是就返回

*/
let  obj:Deepartial<Person2>={
     company:{

     } //可以为空因为上面设置了可选类型
}

// 有可选属性变为必填属性（-?表示必须填的属性）
interface Company1{
  name?:string,
  age?:number;
  address?:string,
}
type MyCompany1<T> = {[K in keyof T]-?:T[K]}  //
type _MyCompany1 = MyCompany1<Company1>
let MyCompany1:_MyCompany1 = {
  name:"小明",
  age:12,
  address:"北京"
}


//变成禁读属性；(readonly仅读属性)
interface Person4{
name?:string;
age:number;
}
type Required1<T> = {[K in keyof T]-?:T[K]}
type Readonly1<T> = {readonly [K in keyof T]:T[K]} 
type MyPerson2 = Readonly<Person4>  // MyPerson为仅读




// 在一个接口中将某些属性挑出来 关键字：Pick （用法： Pick<接口，要挑出的属性>）
interface Person5{
  name:string;
  age:number;
  sxe:string
  }

  type PickPerson = Pick<Person5,"name"|"age">  //PickPerson的类型为   { name: string; age: number;}

// 实现 Pick 
type _Pick<T,K extends keyof T> ={[P in K]:T[P]}
type __Pick = _Pick<Person5,'name'>


//Record 记录类型  （用法：Record<key的类型，value的类型>）
 let obj1:Record<string,any> = {
   name:"小明",
   age:12
 } 

 let obj2:Record<string,string>={
   name:"小明",
   //age:12 //报错 因为Record<string,string>第一个string表示对象的key的类型， 第二个string表示对象的value类型

 }

 let arr:Record<number,number> = [1,2,3,4]

 //实现Record
 type _Record<T extends keyof any,K> = { [P in T]: K; }
