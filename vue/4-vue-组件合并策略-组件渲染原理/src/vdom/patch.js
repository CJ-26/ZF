 // patch将虚拟节点转化成真实节点；
export function patch(oldVnode, vnode) {
  if(!oldVnode){
    return createElm(vnode);
  }
  // 原则上oldVnode为一个老的虚拟节点但第一次也就是初始化的是时候为真实元素也就是挂载的元素，vnode为虚拟节点， //后续dom更新也会走patch方法
  const isRealElement = oldVnode.nodeType; //  判断是否是初次渲染，如有值就是每就不是  //nodeType 属性返回以数字值返回指定节点的节点类型。 如果节点是元素节点，则 nodeType 属性将返回 1。如果节点是属性节点，则 nodeType 属性将返回 2。
  if (isRealElement) {
    //初次渲染
    const oldElm = oldVnode;
    const parent = oldElm.parentNode;
    let el = createElm(vnode); //根据虚拟节点创建真实的节点；
    parent.insertBefore(el, oldElm.nextSibling); //insertBefore() 方法在您指定的已有子节点之前插入新的子节点。  // nede.nextSibling,表示该元素的下一个元素；
    parent.removeChild(oldElm);
    return el;
  } else {
    //不是初次渲染
  }
}

//判断是否为组件
function createComponent(vnode){
 let i = vnode.data;
 if((i=i.hook)&&(i=i.init)){
   /*
    这里的逻辑为声明一个i，将vnode.data赋值给i， 
    if((i=i.hook)&&(i=i.init)) :将i中的i.hook赋值给i，判断i是否存在，存在之后在将i中的init赋值给i判断是否存在；
   */
    i(vnode); // 调用组件的初始化函数；
 }
 if(vnode.componentInstance ){ // 如果虚拟节点上有组件的实例说明当前虚拟节点为组件
  return true;
 }
 return false;
}
function createElm(vnode) {
  //根据虚拟节点创建真实节点；
  let { tag, children, key, data, text, vm } = vnode;
  if (typeof tag === "string") {  
    //tag可能是组件也可能是标签需要判断；
    if(createComponent(vnode)){
       //createComponent(vnode)执行createComponent返回为true则为组件
        // createComponent方法会调用组件的初始化方法发，后续逻辑会在组件的初始化
        // 中进行；
       return  vnode.componentInstance.$el;
    }
    vnode.el = document.createElement(tag);
    updateProperties(vnode); // 更新dom的属性；
    if (children) {
      children.forEach((child) => {
        //如果有children则递归
        vnode.el.appendChild(createElm(child));
      });
    }
  } else {
    vnode.el = document.createTextNode(text);
  }

  return vnode.el;
}

function updateProperties(vnode) {
  let newProps = vnode.data || {}; //获取属性；
  let el = vnode.el; // 获取dom
  for (let key in newProps) {
    if (key === "style") {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName];
      }
    }else if(key === "class"){
        el.className = newProps[key]
    }else {
      el.setAttribute(key, newProps[key]);
    }
  }
}
