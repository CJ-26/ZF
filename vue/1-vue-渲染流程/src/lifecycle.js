import  Watcher  from "./observer/watcher";
import {patch} from "./vdom/patch.js"
export function lifecycleMixin(Vue){
  Vue.prototype._update = function(vnode){ // 渲染成真实的dom的, (将虚拟节点转化为真实的dom                                  )
   const vm = this;
   vm.$el = patch(vm.$options.el,vnode)   
  }
}


export function mountComponent(vm,el){
  // vue的渲染机制
  //  vue默认是通过watcher来进行渲染 叫做渲染watcher（每个组件都有一个渲染watcher）
  let updateComponent = () =>{
   
       vm._update(vm._render()) //生成真实的节点（ vm_render()生成虚拟节点之后再通过vm_update()生成真实的节点） 
  }
  new Watcher(vm,updateComponent,()=>{},true)  // 只是让updateComponent函数执行
}