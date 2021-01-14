/*
import React from 'react';
import ReactDOM from 'react-dom';
let element1 = <h1 id ="title">hello</h1>
ReactDOM.render(element1,document.getElementById("root"));
console.log(element1) 答应输出为一个对象： 
{
$$typeof: Symbol(react.element)  // $$ ：表示为这是一个react元素；
key: null   /
props:{ 
children: "hello" //  表示标签的儿子，当只有一个儿子时children的值就是这个儿子，当有多个儿子是childrem的值就是一个数组                                                              
id: "title"
}
.。。
。。。。。
}



//上面的：let element1 = <h1 id ="title">hello</h1>ReactDOM.render(element1,document.getElementById("root"));这种写法等价于：
let element =React.createElement("h1",{id:'title',},"hello")
ReactDom.render(element,document.getElemetnById("root"))


在通过React.create来创建Dom
编译也就在webpack打包的时候


*/



/*
import React from 'react';
import ReactDom from 'react-dom';
let element1 = <h1 id ="title"><span>111</span>222<span>333</span></h1>
ReactDom.render(elemeent1,document.getElementById('root))
console.log(element1) 输出为：
{
$$typeof: Symbol(react.element)
key: null
props:{
        children: [   // 多个孩子时chiildren的值为数组
                      {
                         $$typeof: Symbol(react.element)
                         key: null
                         props:{
                                 children: "111"
                                 ref: null
                                 type: "span"
                               }
                      },
                     "222",
                     {
                         $$typeof: Symbol(react.element)
                         key: null
                         props:{
                                 children: "333"
                                 ref: null
                                 type: "span"
                               }
                     }
                  ],
                  ref: null,
                 type: "h1"
       }
}




上面的写法：  let element1 = <h1><span>111</span>222<span>333</span></h1> ReactDom.render(elemeent1,document.getElementById('root))等价于：
let elemtent = React.createElement('h1',{id:'title',},<span>111</span>,222,<span>333</span>);React.createElement(element,document.getElementById('root'))
*/


/*
问题:
1。为什么<h1 id ="title">hello</h1>会等价于react.createElement("h1",{id:'title',},"hello")？
因为在react中使用是的jsx语法而jsx语法浏览器是不认识的所以是需要是需要babeljs编译的例如：
我们写的 <h1 id ="title">hello</h1>通过babeljs编译后就是：React.createElement("h1",{id:'title',},"hello")这个样子的

2.React.create()和ReactDone.render()方法的作用是什么？
打包后也就是webpack编译后在浏览执行的时候会执行React.createElement()函数通过React.createElement方法创建js对象也就是React的虚拟dom
之后在执行ReactDone.render()将虚拟dom变成成真实的dom，挂载在指定的html元素上
*/

/*
JSX中的属性，属性名不能使用关键字例如class在
jsx中使用className来代替，jsx中给标签添加style
属性时值为一个对象，
jsx中读取js变量使用{} 包起来

*/

/*
JSX其实也是一个对象，可以在条件语句和循环语句中使用JSX
也可以把JSX复制给变量，还可以作为方法的参数，方法的返回值；
例如：作为方法的返回值：
function greeting(name){
  if(name){
    return <h1>hello,{name}</h1>
  }else{
    return <h1>hello,Strange</h1>
  }
}                                                                     

const element  = greeting('珠峰')
ReactDom.render(element,document.getElementById('root'))


例如在循环语句中使用：
let list = ["张三","李四","王五"]
let element  = list.map((name.index)=>(<li key={index}>{name}</li>))
ReactDom.render(<ul>{element}</ul>,document.getElementById('root'))

*/

/*
React的是如何跟新的？
1。简单粗暴的方式，把老的全部删除，在将的元素全部插入（性能很差，react也不是这么做的）
2.React会把老的虚拟Dom和新的Dom进行比较，这也就是所谓的dom-diff，找到新老之间的差异，然后通过打补丁的方式更新差异


//key的作用：
1，如果没有可以，新老元素会根据下标来比较，不一样的就会删除重新创建在插入，不存在挪动这样性能很差
2，新老元素对比react会对比key的差异来挪动老元素的位置和新元素的位置相同，这样就不能在创建元素，性能更好
3、key的值不要写下标，因为原元素的位置改变下标也改变，key的值也变了，也就是说，写下标和没写key一样，


相同元素相同内容如果没有key，移动其中一个react是不会更新更新，例如下面：
let users = [{id:1,name:'张三'},{id:2,name:'张三'},{id:3,name:'张三'}]
let elment = users.map(user=>(<li key={user.id}>{user.name}</li>))
ReactDom.render(<ul>element</ul>,document.getElementById("root"))

setTimeout(()=>{
let users = [{id:3,name:'张三'},{id:2,name:'张三'},{id:1,name:'张三'}]
let elment = users.map(user=>(<li key={user.id}>{user.name}</li>))
ReactDom.render(<ul>element</ul>,document.getElementById("root"))

},1000)


*/



import React from 'react';
import ReactDOM from 'react-dom';

let element1 = <h1><span>111</span>222<span>333</span></h1>
let element2 = React.createElement("h1",{
  id:'title',
},"hello",<span>111</span>)
console.log(element1)

ReactDOM.render(element2,document.getElementById("root"));


/*


1 什么是JSX
是一种JS和HTML混合的语法,将组件的结构、数据甚至样式都聚合在一起定义组件
ReactDOM.render(
  <h1>Hello</h1>,
  document.getElementById('root')
);


2在react中什么是元素：
JSX其实只是一种语法糖,最终会通过babeljs转译成createElement语法
React元素是构成React应用的最小单位
React元素用来描述你在屏幕上看到的内容
React元素事实上是普通的JS对象,ReactDOM来确保浏览器中的DOM数据和React元素保持一致
例如：
在babel官网中的试一试中左侧勾选react之后输入：
Jsx语法：<h1 className="title" style={{color:'red'}}>hello</h1>
 babel会将Jsx编译为
React.createElement("h1", {
  className: "title",
  style: {
    color: 'red'
  }
}, "hello");
也就说在react中
<h1 className="title" style={{color:'red'}}>hello</h1>这种写法是等价于；
React.createElement("h1", {
  className: "title",
  style: {
    color: 'red'
  }
}, "hello");



3、react中的元素就是react的虚拟Dom，它其实就是一个普通的js对象 ，它描述了界面上你想看到的内容                             
*/


//热更新
if(module.hot){
  module.hot.accept()
}




/*

*/