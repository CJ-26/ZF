// ts中的并集
let y:string | number; //y可以是string类型也可以是number类型，y就是string类型和number类型的合集

//----------------------------------------------------




// 交叉类型 （取交集）
// ts中的交叉类型例如: 
// 又三群人 一群是比较高的人 、 一群是比较帅的人，  一群是又帅又高的人，那么又帅又高的人就是一群是比较高的人 和一群是比较帅的人，的交集

interface Person1{
  handsome:string;
}
interface Person2{
  heigh:string;
}

//交集的修饰符： & 
// Person就是Person1和Person2的交集
type Person3 = Person1 & Person2
// Person3内部的样子：
// interface Person3{   
//   heigh:string;
//   handsome:string;
// }
let person:Person3 ={
  heigh:"高",
   handsome:"帅"
} 



interface Person4{
  name:string,

}

interface Person5{
  name:number;
}
//Person4和Person5都有name的是一个string一个是number，所以没有交集，没有交集就是never类型
//Person6为never类型
type Person6 = Person4&Person5

function fn():never{
  throw new Error("")
}
let person6:Person6 = {
    name:fn()   // 给属性赋值并且这个值的类型为never，（如果想个一个属性赋值为never类型，记住never是类型，只能赋给值的类型是never的）
}

///-------------
// 这个写法是错误的
function mixins(obj1:object,obj2:object):object{ 
   return {...obj1,...obj2}
}
let r = mixins({a:1},{b:2}) // (obj1:object,obj2:object):object这种标注类型在取函数的返回值的属性的时候是取不到的因为ts不知道你object类型的返回值都有什么属性

//正确的写法：
function mixins1<T extends object,K extends object>(obj1:T,obj2:K):T&K{   //<T extends object,K extends object>(都继承object也就防止所传的参数不是object)
  return {...obj1,...obj2}
}

let r1 = mixins1({a:1},{b:2})
export{}