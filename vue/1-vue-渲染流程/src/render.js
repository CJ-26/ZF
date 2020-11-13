import { createElement, createTextVnode } from "./vdom/index.js"
export function renderMixin(Vue){
  Vue.prototype._c= function(...args){ //创建元素型虚拟节点
    return createElement(this,...args)
  }
  Vue.prototype._v= function(text){ //创建文本型虚拟节点
     return createTextVnode(this,text)
  }
  Vue.prototype._s= function(val){ //解析{{}}表达式，传化为字符串
    return val==null?"":(typeof val =="object")?JSON.stringify(val):val
  }
  Vue.prototype._render = function(){  //调用render的自定义方法，生成虚拟节点
     const vm = this;
     let render = vm.$options.render;  //获取编译后render方法；
     let vnode =  render.call(vm);  //执行render函数生成虚拟节点用vnode接收；
    return vnode;
  }
}