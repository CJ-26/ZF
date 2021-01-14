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
  let dom = document.createElement(type); // 将虚拟Dom创建为真实的Dom；
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

  vdom.dom = dom; //在虚拟Dom上添加dom属性值为真实的Dom，用于以后的更新； 
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
const ReactDOM = { render };
export default ReactDOM;
