/*
1、什么叫做组件？
可以将UI切分成一些独立的，可复用的部件这样你你就只需要专注于构建每个独立的部件
组件类似于javascript函数，它可以接受任意的入参（即props），并返回用于描述页面展示内容的React元素

定义组件的两种方式函数组件和类组件
*/


import React from './react';
import ReactDOM from './react-dom';

//函数组件
function  FunctionCompenent(props){
  return(
    <div className="title" style={{background:'green',color:'red'}}>
      <span>{props.name}</span>
       {props.children}
      </div>
  )
}
ReactDOM.render(<FunctionCompenent name = "zhufeng"><span>world</span></FunctionCompenent>,document.getElementById("root"))                                               
if(module.hot){
  module.hot.accept()
}

/*
React元素不禁可以是DOM标签，还可以是用户自定义的组件（如函数组件和类组件）
1、自定义组件的名称必须是首字母大写的，因为原生组件是小写开头（原生组件就是DOM标签定义的）
2、组件必须在使用前先定义
3、组件需要返回并且只能返回一个根元素；
*/