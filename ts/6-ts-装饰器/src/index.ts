// 装饰器现在前端已经用的比较少了，可能后期会有变化
//所谓的装饰器就是扩展方法和属性
// 装饰器其实即使将一个函数当作参数传入另一个函数，咱另一个函数中给传入的函数增加功能之后在返回出去
//为了好看出了装饰器语法  @ 装饰器只能装饰类  装饰不了函数，因为函数会变量提升
// 在ts中使用装饰器的在tsconfig.json文件中将配置项experimentalDecorators:tru的注释去掉


function aa(target:Function){
  console.log("aa") //后打印
}

function modifier(target:Function){
  console.log("mod") //先打印
  target.prototype.say = function(){
    console.log("say")
  }
}
@aa      //  多个装饰器可以装饰一个类 ，执行顺序 ，有下到上，也就是 先将Person传入modifier中执行 完modifier在将Person传入aa中
@modifier
class Person{
  say!:Function  // 需告诉类添加了say方法
}
let person = new Person()
person.say()  //在ts中装饰器增加完方法器去调用是会报错的，你要告诉这个类有这个方法例如这个要类中添加say!:Function就可以了 





//除了给类怎加装饰器也可以给类中的属性增加装饰器：

function toUppcaseCase(target:any,key:string){   //参数一为类的原型，参数二为要装饰的属性；
    let value = target[key];  
  Object.defineProperty(target,key,{
       get(){
          return value.toUpperCase()
       },
       set(newValue){
         console.log(111111)
         value=newValue;
       }
     })

}

function double(target:any,key:string){   //target只的是类本身因为修改的是静态方法，key为要修饰的的属性
  let value = target[key]
  Object.defineProperty(target,key,{
    get(){
      return value*2
    },
    set(newVal){
      value = newVal
    }
  })
}
class Person1{
  @toUppcaseCase  //给属性添加构造器
  name:string = "zf"
  @double  
  static age:number = 10;
}
 let person1 = new Person1()
 console.log(person1.name) //  ZF 
 console.log(Person1.age)  //20






 //修饰类中方法的装饰器；

function attribute(target:any,key:string,descriptor:PropertyDescriptor){
 /*
 参数一为实例的原型 
 参数二为属性，这里是修饰方法的，方法名字的在对象中不就是属性吗，只是值为函数而已
 参数三是规定好的类型就是PropertyDescriptor,是用来描述属性的值为：{writable enumerable configurable value} 
 */
descriptor.enumerable = true //表示这个属性不能被枚举


}


class Person2{
  @attribute
  getNmae(){

  }
}
 let person2 = new Person2()
 




// 类中方法的参数装饰器：
function parmas(target:any,key:string,index:number){
   /*
    参数一为：类的原型
    参数二为：属性，也就是要修饰参数所在函数，的函数名字
    参数三，为要装饰的参数的下标，参数的下标在零开始
   */
}
class Person3{
   //描述参数
  getNmae(@parmas name:string){

  }
}
 let person3 = new Person3()
 








export {}


/*

如果一个描述符同时拥有 value 或 writable 和 get 或 set 键，则会产生一个异常。


Object.defineProperty(obj,key,{
  value:12,  //属性的值
  writable:true, // 可写的（该属性值可改变的）
  configurable:true //当且仅当该属性的 configurable 键值为 true 时，该属性的描述符才能够被改变()，同时该属性也能从对应的对象上被删除。
  enumerable:true //可枚举的
})
configurable:
如果属性已经存在，Object.defineProperty()将尝试根据描述符中的值以及对象当前的配置来修改这个属性。如果旧描述符将其configurable 属性设置为false，则该属性被认为是“不可配置的”，并且没有属性可以被改变（除了单向改变 writable 为 false）。当属性不可配置时，不能在数据和访问器属性类型之间切换。
当试图改变不可配置属性（除了value和writable 属性之外）的值时会抛出TypeError，除非当前值和新值相同。




Object.defineProperty(obj,key,{
  let value = obj[key]
 get(){
    return value
 }
 set(newVal){
  value = newVal
 }
})






var o = {};

 o.a = 1;
 等同于：
Object.defineProperty(o, "a", {
  value: 1,
  writable: true,
  configurable: true,
  enumerable: true
});


 另一方面，
Object.defineProperty(o, "a", { value : 1 });
 等同于：
Object.defineProperty(o, "a", {
  value: 1,
  writable: false,
  configurable: false,
  enumerable: false
})

*/