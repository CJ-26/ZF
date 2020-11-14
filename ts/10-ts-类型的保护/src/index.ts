//ts的类型保护：
// 类型保护想要具体到某个类型，也就是类型判断：
//ts类型判断常用的关键字：
//  typeof ， instanceof      in  

// typeof的用法
function getVal(val:string|number){
  if(typeof val ==="string"){
     val.charAt  // string的属性
  }else{ 
    val.toFixed   //number的属性
  }
}

// 判断两个类是哪个是哪个；  instanceof的用法（要判断 instanceof 类型 ， 如果要判断的是这个类型的返回true不是返回false）
class Dag{}
class Cat{}
// 修饰类(类被看成构造函数)的类型的写法：例如  clazz是类：clazz:{new ():Dag | Cat}  或者  clazz:new ()=>Dag | Cat 两种都可以；
let getInstance = (clazz:new ()=>Dag | Cat)=>{
   return new clazz
}
let animType = getInstance(Dag)
if( animType instanceof Dag){
   animType
}else{
  animType
}

//in 操作符: (下面的例子是：判断我传的参数中的属性是否包含哪个)
interface Fish{
  swining:string
}
interface Bird{
  fly:string
}
function getTyep(animal:Fish | Bird){
  if('seining' in animal){
    animal
  }else{
    animal
  }
}


// ----------------------------------------------------

// ts特有的判断类型：

//可辨识类型
interface Square {
  kind: "square";  //字面量类型
  size: number;
}
interface Rectangle {
  kind: "rectangle";  // 字面量类型
  width: number;
  height: number;
}
interface Circle {
  kind: "circle";  // 字面量类型
  radius: number;
}
//声明三个接口，每个接口都有kind属性，但有不同的字符串字面量类型， kind属性称做可辨识的特征或标签，其它的属性则特定于各个接口。
function getButton(val:Square| Rectangle | Circle){
  if(val.kind=="square"){
       
  }else if(val.kind == "rectangle"){
    
  }else{

  }
}

// is 语法自定义类型判断
interface Fish1{
 swiming:string
}
interface Bird1{
  fly:string
}
function isFish1(animal:Fish1 | Bird1):animal is Fish1{   // 自定义判断类型 animal is Fish1   判断是不是FIshmae1 ,不要问为什这样写，固定语法哈哈
     return "swiming" in animal    
}
function getType1(animal:Fish1 | Bird1){
  if(isFish1(animal)){
        animal.swiming
  }else{
     animal.fly
  }
}


//null保护： （基本使用 ! 非空断言）
// ts无法检测函数内部函数的类型决绝方案 ：要使用 if()进行判断 
function getName(val?:number | null){  // ? 表示val有值在加类型 防止 调用函数不传值或者传null
     val = val || 0;  // 如果调用函数没有传值后者传的是null，需要非空保护，要不是取不到val上的方法和属性的也就是val.xxx 会报错例如val是number类型，我传空，则val.toFixed 会报错
                    //  非空保护的写法有： 赋默认值val = val || 0;    使用？例如  val？.toFixed (当val有值时在执行tofixed)     非空断言 val!.toFixed   
      function a(){
        //val.toFixed  // 直接写val.toFixed 是会报错因为ts无法检测函数内部函数的类型
         if(val !=null){  //需要判断 因为ts无法检测函数内部函数的类型
          val.toFixed 
         }
      }      
}
getName() 


// 对代码的完整性进行保护， 反推代码never

interface ICircle{
  kind:"circle";
  r:number;
}
interface IRant{
  kind:'rant';
  width:number;
  height:number;
}

interface ISquare{
  kind:"square";
  width:number;
}

const assrt = (obj:never)=>{ throw  new Error("代码不完整")}   // 用于校验程序的完整函数
const getArea = (obj:ICircle | IRant | ISquare)=>{
  switch(obj.kind){
    case 'circle':
      break;
    case 'rant':
      break;
    case 'square':
      break;
   default:
          return assrt(obj)  //这写的作用如果你少些了一个case就会但调用函数的时候出入的参数就是你少些的就会走 default报错
  }
}

const getArea1 = (obj:ICircle | IRant | ISquare)=>{
  switch(obj.kind){
    case 'circle':
      break;
    case 'rant':
      break;
   default:
       //   return assrt(obj)   这里会报错因为你少些了一个case判断 ：case 'square': 代码不完整报错
  }
}


export {}