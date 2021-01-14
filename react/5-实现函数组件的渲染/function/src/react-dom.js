/*
render方法里面的逻辑：
1、将vdom（虚拟dam）变成真实的Dom；
2、把vdom(虚拟dom)上的属性同步到真实的Dom上
3、把vdom（虚拟dom）上的儿子们也变成真实的dom，并添加到自己的真实的dom上，通过    appenChild()   方法添加
4，最后把真实的dom挂载在容器内                                                                         
*/

/**
 * 
 * @param {*} vdom 虚拟dom也就是React.createElement()返回的
 * @param {*} container // html页面的容器
 */
function render(vdom, container) {
  const dom = createDom(vdom);
  container.appendChild(dom);
}

/**
 * 
 * @param {*} vdom 为虚拟dom
 */
function createDom(vdom) {
  if (typeof vdom === "string" || typeof vdom === "number") {  //判断虚拟Dom是是不一个普通元素例如这样的代码：var elment = "你好吗"; ReactDom.render(element,document.getElementById('root'))
    return document.createTextNode(vdom); 
  }
  let { type, props } = vdom;
  let dom;
  if(typeof type ==="function"){
   //函数组件；
   return mountFunctionComponent(vdom);
  }else{
    // 原生组件
    dom = document.createElement(type); // 将虚拟Dom创建为真实的Dom；
  }
  updataProps(dom,props)  // 更新真实Dom的属性；

  //如果只有一个儿子并且这个儿子是文本直接直接添加
  if(typeof props.children === "string" || typeof props.children === "number"){
    dom.textContent = props.children;
  }else if(typeof props.children === "object" && props.children.type){
    // 只有一个儿子并且这个儿子是一个虚拟Dom元素，则props.chuildren的类型就是是一个对象
    //因为当为元素的时候编译后会将该元素传入ReactDome.createElement()中在浏览器执行时会调用React.createElement方法返回一个对象(这个对象也就是虚拟dom）所以当儿子而虚拟dome的时候 类型为对象                                                                                   
     render(props.children,dom)  //递归render方法
  }else if(Array.isArray(props.children)){
     reconcileChildren(props.children,dom)
  }else{
    document.textContent = props.children?props.children.toString():""
  }

  //vdom.dom = dom; //在虚拟Dom上添加dom属性值为真实的Dom，用于以后的更新； 
  return dom;
}

/**
 * 
 * @param {*} dom  真实的Dom
 * @param {*} newPorps  // 虚拟Dom的属性
 */
function updataProps(dom,newPorps){
  for(let key in newPorps){
    if(key === "children") continue;
    if(key === "style"){
       let styleObj = newPorps.style;
       for(let attr in styleObj){
         dom.style[attr] = styleObj[attr]
       }
    }else{
      dom[key] = newPorps[key]
    }
  }
}

/**
 * 
 * @param {*} childrenVdm  儿子的虚拟Dom对象
 * @param {*} parentDom  父亲的真实dom
 */
function reconcileChildren(childrenVdm,parentDom){
   for(var i=0;i<childrenVdm.length;i++){
     var childVdm = childrenVdm[i]
     render(childVdm,parentDom)
   }
}

/**
 * 把一个类型为自定义的函数组件的虚拟dom转化为真实的Dom并返回；
 * @param {*} vdom  虚拟dom
 */
function mountFunctionComponent(vdom){
  let {type:FunctionComponent,props} = vdom;
  let renderVdom = FunctionComponent(props);
  return createDom(renderVdom);
};
/*
函数组件的执行过程：
例如代码如下：
import React from 'react';
import ReactDOM from 'react-dom';
function FunctionCompenent(props){
  return <div className="title" style={{background:'green',color:'red'}}>hello</div>
}
ReactDOM.render(<FunctionCompenent name = "zhufeng"></FunctionCompenent>,document.getElementById("root"))
编译过程：
会将<FunctionCompenemt name = "zhufeng"></FunctionCompenemt>传入React.createElement方法中也就是
React.createElement(FunctionComponent,{name:"zhufeng",style:{background:'green',color:'red'}},"hello")
也就是：ReactDOM.render(React.createElement(FunctionComponent,{name:"zhufeng",style:{background:'green',color:'red'}},"hello"),document.getElementById("root"))

在浏览器执行时：
会先执行：React.createElement方法返回虚拟dom如下：
{
  type:"FunctionComponent",
  props:{
    name:"zhufeng",
    style:{background:'green',color:'red'},
    children:"hello"
  }
}
再将返回的虚拟Dom对象传入ReactDom.render方法中在该方法中会去判断虚拟dom中的属性type值的类型是否为一个函数
如果是一个函数，将该虚拟dom传入mountFunctionComponent方法中
mountFunctionComponent方法会取出虚拟dom对象中的type和props属性的值
因为type属性的值对应的就是函数执行这个函数并将props传入这个函数中有因为该函数执行后会返回只有一个根节点的React元素，又因为函数中是React
元素所以在编译的过程中又会将React元素传入到React.createElement方法中转化为虚拟dom在返回所以执行函数组件的函数后最
终返回的是虚拟dom，再将返回的dom传入createDom方法中来创建真实的dome等一系列的操作
*/
 
const ReactDOM = { render };
export default ReactDOM;
