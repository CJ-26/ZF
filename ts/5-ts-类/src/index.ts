/*
as ! ? 的用法：
as表示断言成 xxxxx
! 表示 非空断言
? 表示链判断运算符，有值取值，没值返回undefined


*/


/*
类 es6类  中有静态属性，实例属性(私有的) ， 原型属性（共享的）

    class App {
      constructor() {
        this.livingType = "实例属性"
      }
      _livingType = "_实例属性"
      get prototypeType() {
        return "原型属性"
      }
      handlerPrototype() {
        return "原型方法"
      }
      static staticType = "静态属性"
      static handlerStatic() {
        return "静态方法"
      }
    }
    App.prototype.tt = "tt" // 添加原型属性
    let app = new App()
    let _app = new App()
    
     实例属性(私有的) ：私有的是指：每new一个实例都是不同的实例，实例自生上的属性当然是私有的了
    
    原型属性（共享的） ：共享的是值原型上的，：每new一个实例虽然实例不同，但是把同一个的方法添加了在原型上所以是共享的
 

*/


class Poiter{
  //x:number  // x:number这样声明会报错，因为在严格模式下声明没有赋值会报错，解决方法一将tsconfig.js里面的strict的值设置为false退出严格模式，但是不推荐，那就可以使用非空断言 x!:number就可以了
  public x!:number; //表示实例上的属性
         y!:number;  //也可以省略掉public
  constructor(x:number,y:number){
    this.x = x// 这里直接写x属性回报错没有声明，要在constructor上面声明
   this.y = y
  }
}
let poiter = new Poiter(1,2);



//类中的方法和函数中的使用方式相同
class Poiter1{
  x!:number;  //表示
  y!:number;
  constructor(x:number,y?:number,s:number=1,...agrs:number[]){  //y?:number这个参数可有可无但?表示可以时undefined在下面的this.y = y会报错，可以利用断言 this.y = y as number
    this.x = x
    this.y = y as number
  }
}
let poiter1 = new Poiter1(1,2,3,4,5,6,7);






/* 类的修饰符 ：
public protected , private ,  readonly
*/

//public 类的公开属性表示在类的内部还是在类的外部都能访问的到，在继承后的子类也时不管在内部还是在外部都能访问的到
class Animal{
  public name!:string;
  public age!:number;
  constructor(name:string,age:number){
     this.name = name;
     this.age = age;
  }
};

class Cat extends Animal{
  address = "";
  constructor(name:string,age:number,address:string){
     super(name,age)
     this.address = address;
  }
};
let animal = new Animal("狗子",12);
console.log(animal.age) // 12 ,public声明的属性外部访问
let cat = new Cat("Tom",10,"美国")
console.log(cat.age)  // 10  public声明的属性子类的外部访问







// protected: 受保护的， （父类和子类的内部可以访问，外部不可以访问）
class Animal1{
  public name!:string;
  protected age!:number;
  constructor(name:string,age:number){
     this.name = name;
     this.age = age;
  }
  setAge(val?:string){
    console.log(this.age)
  }
};

class Cat1 extends Animal1{
  address = "";
  constructor(name:string,age:number,address:string){
     super(name,age)
     this.address = address;
  }
  getAge(val?:string){
    console.log(this.age)  
  }
};

let animal1 = new Animal1("狗子",12)
 //console.log(animal1.age) //报错   protected修饰的属性只能在类的内部访问，
animal1.setAge()  //可以访问的到，protected修饰的属性只能在类的内部访问

let cat1 = new Cat1("小猫",99,"北京")
//console.log(cat1.age) /  //报错   protected修饰的属性只能在类的内部访问，
 cat1.getAge()  //可以访问的到，protected修饰的属性只能在类的内部访问







// private 私有的 只有自己能内部能访问的到。
 class Animal2{
  public name!:string;
  private age!:number;
  constructor(name:string,age:number){
     this.name = name;
     this.age = age;
  }
  setAge(val?:string){
    console.log(this.age)
  }
};

class Cat2 extends Animal2{
  address = "";
  constructor(name:string,age:number,address:string){
     super(name,age)
     this.address = address;
  }
  getAge(val?:string){
   // console.log(this.age)  //报错  子类内部访问不到父类 private修饰的属性
  }
};

let animal2 = new Animal2("狗子",12)
//console.log(animal2.age) //报错  类的外部访问不到 类里用 private修饰的属性
animal2.setAge() // 只有类的内部能访问的到类里用 private修饰的属性；
let cat2 = new Cat2("小猫",99,"北京")
//console.log(cat2.age) //  报错  子类是不能访问父类的private修饰的属性；
// cat2.getAge()  //  报错  子类是不能访问父类的private修饰的属性；



/*
constrouctor被修饰过后类的情况
 如果constructor被标识成了 private 或者 protected则此类不能被new，被标识的private不能被子类继承
*/


//constructor被标识成了 protected 不能new 但子类不受影响
class Animal3{
  protected constructor(name:string,age:number){
 
  }
 
};

class Cat3 extends Animal3{
  constructor(name:string,age:number,address:string){
     super(name,age)
  }
};

 //let animal3 = new Animal3("小猫",12)  //报错 constructor被标识成了 protected不能new
 let cat3 = new Cat3("小猫",12, "北京")  // 子类不影响





 //constructor被标识成了 private 不能new 也不能被继承继承
class Animal4{
 private constructor(name:string,age:number){
  }
};
// let animal4 = new Animal4("狗子",13) // 不能被new


// class Cat4 extends Animal4{  //报错 constructor被标识成了 private 不能被继承
//   constructor(name:string,age:number,address:string){
//        super(name,age);
//   }
// };





//readonly :表示在constructor里面初始之后就不能修改了，只能读取

class Animal5{
  private name!:string
  public readonly age!:number
   constructor(name:string,age:number){
      this.name = name;
      this.age = age;
  }
  setAge(){
   // this.age = 13  //被标识readonly的属性在constructor里面初始之后就不能修改了，只能读取
  }
}





// static修饰的静态属性或者静态方法，静态属性和静态方法方法是通过类来调用的（静态属性和静态方法是可以继承的）
class Animal6{
   constructor(name:string,age:number){
 
  }
  static type:string='动物' // 静态属性
  static  getName(){  // 静态方法

  }
};

class Cat6 extends Animal6{
  constructor(name:string,age:number,address:string){
     super(name,age)
  }
};

Animal6.type
Animal6.getName()
Cat6.type
Cat6.getName()   //静态属性静态方法 类调用可继承


//super表示超类也就是父类

class Animal7{
  constructor(name:string,age:number){

 }
 say(){  // 类上的原型方法
   return"say" 
 }
 static type:string='动物' // 静态属性
 static  getName(){  // 静态方法
     return "动物"
 }
};

class Cat7 extends Animal7{
 constructor(name:string,age:number,address:string){
    super(name,age)
 }

 say(){ //重写父类的原型方法
  console.log(super.say()) //输出 say   // super.say()为调用父类的原型上的方法say ，super为 父类的原型
 return"cat say"
}

 static getName(){   // 父类里也有getName静态方法，这里又写了一遍叫重写父类的方法
   console.log(super.getName()) //出为 动物 ，super表示父类
   return "猫"  //因为父类return的为字符串类型，子类重写的方法也要return字符串（返回值的兼容性性）
 }
};

console.log(Cat7.getName())  // 输出为 猫，

let cat7 = new Cat7('猫',12,'北京')
console.log(cat7.say())


// 利用属性选择器在类的外部去访问修改 protected受保护的属性和private 私有的属性

class Cat8 {
  constructor(name:string,age:number){
    
  }
 private _eat:string = "HOlle"
 get eat(){
   return this._eat
 }
  set eat(newVal){
     this._eat=newVal
  }
 };
 
 let cat8 = new Cat8("tom",12)
   console.log(cat8.eat) //HOlle
   cat8.eat="Hi"
   console.log(cat8.eat) // Hi




   // 抽象类用 abstract（抽象类不能被实例化） 
   abstract class Animal8{  // 抽象类中可以包含抽象方法和抽象属性；也可以包含实现属性和实现实现方法，但在继承时抽象的方法和抽象的属性必须被实现
    public age:number = 10;  //实现属性
    running():string{  // 属性方法
     return "跑起来"
    }
    abstract name:string; //抽象属性
    abstract eat():any  //抽象方法
   
   }

   class Tome extends Animal8{
     name="tom";  // 实现父类的抽象属性     //父类的抽象属性必须在子类中实现否则报错
     eat(){ // 实现父类的抽象方法   //父类的抽象方法必须在子类中实现否则报错
       return "吃鱼"
     }
   }

   //let animal8 = new Animal8()  报错  因为抽象类不能被实例化




















   


// //    ts中类抽象类、多态：
// //  抽象类: abstract 修饰， 里面可以没有抽象方法。但有抽象方法(abstract method)的类必须声明为抽象类(abstract class)
// //  多态:父类定义一个方法不去实现，让继承它的子类去实现  每一个子类有不同的表现
// //  注意：使用多态基础是类的继承或者接口实现。

// // 03_abstract_class.ts

// //   03_abstract_class.ts
// //  ts中类抽象类、多态
// //  抽象类: abstract 修饰， 里面可以没有抽象方法。但有抽象方法(abstract method)的类必须声明为抽象类(abstract class)
// //  多态:父类定义一个方法不去实现，让继承它的子类去实现  每一个子类有不同的表现
// //  注意：使用多态基础是类的继承或者接口实现
 
 

// // Animal 是一个抽象类，里面含有一个eat()抽象方法
 
// abstract class Animal{
//     public name:string;
//     constructor(name:string){
//         this.name=name;
//     }
 
//     //抽象方法 ，不包含具体实现，要求子类中必须实现此方法
//     abstract eat():any;
 
//     //非抽象方法，无需要求子类实现、重写
//     run(){
//         console.log('非抽象方法，不要子类实现、重写');
//     }
// }
 
// class  Dog extends Animal{
//     //子类中必须实现父类抽象方法，否则ts编译报错
//     eat(){
//        return this.name+"吃肉";
//     }
// }
 
// class Cat extends Animal{
 
//     //子类中必须实现父类抽象方法，否则ts编译报错
//     eat(){
//         return this.name+"吃鱼";
//     }
// }
 
// var dog =new Dog("tom");
// var cat=new Cat("kitty");
// console.log(dog.eat());
// console.log(cat.eat());
 
// //多态 ，一种事物的不同表现形态。如下面的代码中 先声明变量f是Animal类型，具体是Dog还是Cat，在new 对象时才知道
// //如果是Dog，则f.eat()调用的是Dog类中的eat方法；如果是Cat，则f.eat()调用的是Cat类中的eat方法，这就是多态！！！
// var f:Animal;//声明变量为Animal类型
// //f=new Dog("sunny");
// f=new Cat("sunny");
// console.log(f.eat());
// 编译后的03_abstract_class.js 


// // 03_abstract_class.ts
// // ts中类抽象类、多态
// // 抽象类: abstract 修饰， 里面可以没有抽象方法。但有抽象方法(abstract method)的类必须声明为抽象类(abstract class)
// // 多态:父类定义一个方法不去实现，让继承它的子类去实现  每一个子类有不同的表现
// // 注意：使用多态基础是类的继承或者接口实现

// var __extends = (this && this.__extends) || (function () {
//     var extendStatics = Object.setPrototypeOf ||
//         ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
//         function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
//     return function (d, b) {
//         extendStatics(d, b);
//         function __() { this.constructor = d; }
//         d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
//     };
// })();

// //Animal 是一个抽象类，里面含有一个eat()抽象方法

// var Animal = /** @class */ (function () {
//     function Animal(name) {
//         this.name = name;
//     }
//     //非抽象方法，无需要求子类实现、重写
//     Animal.prototype.run = function () {
//         console.log('非抽象方法，不要子类实现、重写');
//     };
//     return Animal;
// }());
// var Dog = /** @class */ (function (_super) {
//     __extends(Dog, _super);
//     function Dog() {
//         return _super !== null && _super.apply(this, arguments) || this;
//     }
//     //子类中必须实现父类抽象方法，否则ts编译报错
//     Dog.prototype.eat = function () {
//         return this.name + "吃肉";
//     };
//     return Dog;
// }(Animal));
// var Cat = /** @class */ (function (_super) {
//     __extends(Cat, _super);
//     function Cat() {
//         return _super !== null && _super.apply(this, arguments) || this;
//     }
//     //子类中必须实现父类抽象方法，否则ts编译报错
//     Cat.prototype.eat = function () {
//         return this.name + "吃鱼";
//     };
//     return Cat;
// }(Animal));
// var dog = new Dog("tom");
// var cat = new Cat("kitty");
// console.log(dog.eat());
// console.log(cat.eat());
// //多态 ，一种事物的不同表现形态。如下面的代码中 先声明变量f是Animal类型，具体是Dog还是Cat，在new 对象时才知道
// //如果是Dog，则f.eat()调用的是Dog类中的eat方法；如果是Cat，则f.eat()调用的是Cat类中的eat方法，这就是多态！！！
// var f; //声明变量为Animal类型
// //f=new Dog("sunny");
// f = new Cat("sunny");
// console.log(f.eat());
// 





