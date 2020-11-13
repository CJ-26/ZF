export function patch(oldVnode, vnode) {
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

function createElm(vnode) {
  //根据虚拟节点创建真实节点；
  let { tag, children, key, data, text, vm } = vnode;
  if (typeof tag === "string") {
    //tag可能是组件也可能是标签；
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
