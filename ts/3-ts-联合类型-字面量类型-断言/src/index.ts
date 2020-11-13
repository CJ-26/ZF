

// 联合类型 
//默认可以认为是并集
let str:string | number;  // 在没有初始化的时候，只能调用两种类型中的公共方法:
//  str.toString()
//  str.valueOf()
//  str.toLocaleString()
// 上面的三个方法在字符串和数字类型中都会有 所以可以调用  但如果调用str.toFixed()是会报错的因为只有数字类型有toFixed()方法. 这也就是：在没有初始化的时候，只能调用两种类型中的公共方法

// 但是赋值之后就会根据类型去推导可以调用什么方法了例如：
str = "abc";
str.toLowerCase();
str = 123;
str.toFixed();




// 获取一个元素  （内置类型 :HTMLElement ）
//let ele:HTMLELenent = document.getElementById("app")  //这样写会报错因为ts比较多疑万一这个元素没有怎么办那？所以要下面这种写法

let ele:HTMLElement|null = document.getElementById("app");
ele!.style.color = "red";  // !非空断言 表示一定有值     ！只能在ts中用 
//ES11中有一种写法 例如 ele?.style.color  表示 ele&&ele.style&&ele?.style.color  (表示：当ele存在取ele.style，ele.style存在在取style.color)

//断言：as
// 遇到这种情况 ：let ele:HTMLELenent = document.getElementById("app")报错，除了let ele:HTMLElement|null = document.getElementById("app")这种写法还可以使用断言

let ele1:HTMLElement|null= document.getElementById("box");
(ele1 as HTMLElement).style.color = "red";     // as断言，表示 ele1一定存在
//也可以这样写 ：
(<HTMLElement>ele1).style.color = "pink"; //表示告诉ele1为HTMLElement类型，但 这种写法不采用，因为会与jsx语法有冲突
// 不能断言成不在声明中不存在的类型， 例如：let ele1:HTMLElement|null= document.getElementById("box"); 只能断言成 HTMLElement和null类型断言成别的类型会报错
//例如：ele1 as boolean 会报错，但如果非要断言成声明中不存在的类可以用双重断言例如：
(ele1 as any) as boolean ; // 双重断言， 不建议双重断言，因为这样会破坏原有的类型 



// 字面量类型 （type起别名的关键字） 例如：

//let direction:'up'| 'down' | 'left' | 'right';
 //direction = 'up';  //也就是directiom赋值的时候只能是 up down left rigth 不能是别的
 // let direction:'up'| 'down' | 'left' | 'right'; 这种写法很长可以利用用type起个别名来使用
 type  Direction = 'up'| 'down' | 'left' | 'right';  // Direction别名  好处可以复用
 let  direction:Direction;  
 direction = "up"; //direction只能是 up down left rigth 不能是别的
 let direction1:Direction;
 direction1 = "left";
export{}