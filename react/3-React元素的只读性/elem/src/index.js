import React from 'react';
import ReactDOM from 'react-dom';


/*
1、React 元素是不可变对象。一旦被创建，你就无法更改它的子元素或者属性。一个元素就像电影的单帧：它代表了某个特定时刻的 UI。
更新 UI 唯一的方式是创建一个全新的元素，并将其传入ReactDOM.render()。
例如： 
const element = <div> {new Date().toLocaleTimeString()}</div>  //虽然不同时刻的new Date().toLocaleTimeString()是不一样的但是只调用了一次ReactDom.render(),所以信使是一直不变的
ReactDOM.render(element,document.getElementById('root'))     

// 如果想要视图更新唯一的方式是创建一个全新的元素，并将其传入ReactDOM.render()。例如下面的
例子：在 setInterval() 回调函数，每秒都重新创建一个全新的元素并调用 ReactDOM.render()转成真实的dom重新渲染，
function tick(){
  const element = (
    <div>
      {new Date().toLocaleTimeString()}
    </div>
  )
  ReactDOM.render(element,document.getElementById('root'))

}
setInterval(tick,1000)  



如何理解react元素是不可变变的那？
console.log(<h1>hello</h1>)会输出一个对象：
{
$$typeof: Symbol(react.element) //表示这个一个react元素
key: null
props: {children: "hello"} 
ref: null
type: "h1"   //元素类型
_owner: null
_store: {validated: false}
}

也就是说react元素最中会转化为一个js对象(也就是虚拟dom)，而react元素是不可变的，就是该对象是只读不可写的，不能添加新属性也不能修改原属性的值（在react的17版以前是可以添加新的属性不能修改原属性的值，
react的17版本及以后的是不能添加新属性也不能修改原来属性的值否则会报错的）
例如：
var ele = <h1>hello</h1>
ele.type="div"//会报错
ReactDom.render(ele,document.getElementById('root'))


对象的冻结只读不能修改（不能添加新属性也不能修改原属性的值）：
var obj = {name:"小明"}
Object.freeze(obj)
obj.name = "小红"
obj.age = 12
console.log(obj) //{name:"小明"}


对象的密封可以修改原来的属性值，但不能添加新的属性：
var obj = {name:"小明"}
Object.seal(obj)
obj.name = "小红"
obj.age = 12
console.log(obj) //{name:"小红"}
*/








/*
2、上面说到React元素是不可变的，如果想要更新页面显示的重新创建新的React元素，之后将其传入到ReactDom.render()中，那react是如何更新页面的显示的那？
例如：
function tick(){
  const element = (
    <div>
      <p>当前时间:</p>
     <span> {new Date().toLocaleTimeString()} </span>
     <p>此时间为北京时间</p>
    </div>
  )
  ReactDOM.render(element,document.getElementById('root'))

}
setInterval(tick,1000)

当定时器每秒执行一次，创建新的React元素，并将这个React元素传入ReactDom.render()中，这个更新过程，react会新老元素进行对比
只会更新不同的地方，例如上面的例子只会更新span中的时间其余的都不会更新；
*/







function tick(){
  const element = (
    <div>
      <p>当前时间:</p>
     <span> {new Date().toLocaleTimeString()} </span>
     <p>此时间为北京时间</p>
    </div>
  )
  ReactDOM.render(element,document.getElementById('root'))

}

setInterval(tick,1000)


if(module.hot){
  module.hot.accept()
}



/*

1、
var d=new Date();
var n=d.toLocaleTimeString();
下午3:11:53



toLocaleTimeString() 方法可根据本地时间把 Date 对象的时间部分转换为字符串，并返回结果。


2、toLocaleDateString()方法的真正含义为「根据本地时间把Date对象的日期部分转换为字符串」，这意味着：在不同的浏览器或者服务器中，我们可能得到不同的字符串。

例如，将 Chrome 浏览器的版本从57升级为58再升级为69，通过toLocaleDateString()方法获取的时间字符串格式分别为：

复制代码
#Chrome = 57
> new Date().toLocaleDateString()
> output: "2018/9/28"

#Chrome = 58
> new Date().toLocaleDateString()
> output: "2018-9-28"

#Chrome = 69
> new Date().toLocaleDateString()
> output: "9/28/2018"




3、 Object.freeze()冻结对象的属性冻结后不能添加及修改对象的属性
4、 Object.seal()密封对象，密封后的对象可以改变原属性的值，但是不能添加新的属性
*/
