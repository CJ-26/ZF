import  Watcher  from "./observer/watcher";
import {patch} from "./vdom/patch.js"
export function lifecycleMixin(Vue){
  Vue.prototype._update = function(vnode){ // 渲染成真实的dom的, (将虚拟节点转化为真实的dom                                  )
   const vm = this;
     
   const prevVnode = vm._vnode; //取上一次的虚拟 dom看看看是否存在不存在则为初始渲染，存在则要将老的和新的虚拟dom传入partch中，去执行diff算法更新  
   vm._vnode = vnode;  //保存上一次的虚拟dom也就是老的虚拟dom
    //patch执行完后组件会产生$el属性
   if(!prevVnode){ //初始化
    vm.$el = patch(vm.$el,vnode)
   }else{ // 修该跟新虚拟dom
    vm.$el = patch(prevVnode,vnode)
   }
    
  }
}

export function callHook(vm,hook){ //调用钩子函数
const handlers = vm.$options[hook];
if(handlers){
  handlers.forEach(handler=>handler.call(vm));
}
}
export function mountComponent(vm){
  // vue的渲染机制
  //  vue默认是通过watcher来进行渲染 叫做渲染watcher（每个组件都有一个渲染watcher）
  let updateComponent = () =>{
       vm._update(vm._render()) //生成真实的节点（ vm_render()生成虚拟节点之后再通过vm_update()生成真实的节点） 
  }
  new Watcher(vm,updateComponent,()=>{},true)  // 只是让updateComponent函数执行
}