// ts自动类型推断
//1. 当赋值的时候
//2.函数会默认推断
//3. 函数的返回值推断
//4. 属性推断

//当赋值的时候推断
let str; // 不赋值的时候默认为any类型
let str1 = "www" // str1赋值为字符串类型则ts自动推断为string类型
let age = 12 //age赋值为数字类型则ts自动推断为numder类型


// 函数默认推断:(函数会根据右边的类型推断左边的类型)
// 如果函数没有自动推断的写法：
const sum1:(a:string,b:string)=>string = (a:string,b:string):string=>{
  return a+b
}
//sum1的类型为(a:string,b:string)=>string ；
// 自动推断：
const sum = (a:string,b:string):string=>{ //sum的类型会自动推断类型为(a:string,b:string)=>string 
  return a+b;
}


//函数的返回值的自动推断：
// 如果没有返回值自动推断的写法：:string=>表示函数的返回值为string类型；
const sum2 = (a:string,b:string):string=>{ //sum的类型会自动推断类型为(a:string,b:string)=>string 
  return a+b;
}
// 函数返回值自动推断：
const sum3 = (a:string,b:string)=>{  //这里没有写返回值的类型，但ts会自动推断为string
  return a+b
}

const sum4  = (a:string,b:string)=>{  // 没有写返回值的类型ts会自动推断为Object
  return {name:"zf",age:12}
}



// 属性推断：
// 不推导属性的情况下：
let _school:{name:string,age:number} = {
  name:"zf",
  age:12
}
//自动推断
let school = {  // ts自动给对象的属性推导类型
  name:"zf",
  age:11
}
let {name,age:age1} = school   //{name,age:age1} = school 中的age1为给age起别名因为age在上面已经用过(js也支持)
  console.log(name,age1) // age1是age的别名，

// 去接口中属性对应的类型用  接口名['属性']， 不能用 接口名.属性
interface ISchool{
  name:string,
  age:number,
  address:{
    n:number
  }
}
type n = ISchool["name"]  //去接口中name对应的类型， n为string类型
type n1 = ISchool["address"]["n"]  //去接口中address中n对应的类型， n为number类型


// 类型的反推，回去某个值的类型（关键字 typeof）
let obj = {
 name:"小明",
 age:12
}
type Myobj = typeof obj  // Myobj的类型为 {name: string;age: number;}


export{}