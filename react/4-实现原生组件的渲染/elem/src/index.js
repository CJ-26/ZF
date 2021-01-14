/*
react17版本开始发布新的 jsx 转换逻辑：
用jsx() 函数替换 React.createElement()
例如：react17之前:
import React from 'react';
import ReactDOM from 'react-dom';
var elem = <h1 title="标题">hello</h1>
ReactDOM.render(elem,document.getElementById("root"))


而在react17及以后可以这样写（不用引入import React from 'react';因为会编译的时候自动引入react/jsx-runtime用jsx() 函数替换了 React.createElement()）：
import ReactDOM from 'react-dom';
var elem = <h1 title="标题">hello</h1>
ReactDOM.render(elem,document.getElementById("root"))

react17的编译过程：
例如：
import ReactDOM from 'react-dom';
var elem = <h1 title="标题">hello</h1>
ReactDOM.render(elem,document.getElementById("root"))
会在编译的时候：自动引入import {jsx as _jsx} from 'react/jsx-runtime'; 
之后执行： _jsx('h1', {title:'标题', children: 'hello' }); 而不是 React.createElement('h1'，{title:'标题'},'hello')

*/



/*
实现元素的渲染的流程：
在编译的时候将react元素传入React.creteElement方法方法中，在浏览器
执行的时候后先执行React.createElement方法将react元素转化为虚拟dom
在将虚拟dom传入React.render方法中在React.render方法中调用createDom方法将虚拟dom传入
进行创建真实的Dom，之后在调用updataProps方法将虚拟dome和真实的dom传入用于更新真实的dome上的属性
之后在调用reconcileChildren方法用于递归挂载儿子
*/

import React from './react';
import ReactDOM from './react-dom';

var elem = <div className="title" style={{color:'red'}}><span>hello</span>world</div>
/*
React.createElement(
  "div",
  {
    className = "title",
    stype:{color:'red'}
  },
  React.createElement(
    "span",
    {},
    'hello'
  ),
  'world'
)
*/
 console.log(elem)
ReactDOM.render(elem,document.getElementById("root"))
if(module.hot){
  module.hot.accept()
}


/*
因为当前react为17版本所以编译规则会是自动因为import {jsx as _jsx} from react/jsx-runtime,用_jsx()替代了React.createrElement()、
如果在react17及之后的版本还想使用React.createElement()需要在执行脚本的时候设置环境变量DISABLE_NEW_JSX_TRANSFORM的值为true
也就是在package.json的script中执行编译脚本的命令(编译就是打包命令)中添加set DISABLE_NEW_JSX_TRANSFORM=true
也就是：
 "scripts": {
    "start": "set DISABLE_NEW_JSX_TRANSFORM=true&&react-scripts start",
    "build": "set DISABLE_NEW_JSX_TRANSFORM=true&&react-scripts build",
  },

  set DISABLE_NEW_JSX_TRANSFORM=true // 表示：禁用
*/

