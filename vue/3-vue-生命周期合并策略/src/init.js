import { compileToFunction } from "./compiler/index.js";
import { callHook, mountComponent } from "./lifecycle.js";
import {initState} from "./state"
import { mergeOptions, nextTick } from "./util.js";
export function initMixin(Vue){
  Vue.prototype._init = function(options){ // options为用户传入的对象
    const vm = this;
   // vm.$options = options //实例上有个属性$options表示的是用户传入的所有的属性（由于要添加钩子函数等所以获取用户传进来的对象就不能这样写了）
    vm.$options = mergeOptions(vm.constructor.options,options)  //  mergeOptions合并策略，vm.constructor当前实例的父类（这里只的就是Vue，但不同情况下指向不同在组件中用的时候也会指向组件也就是Vue的儿子），options为用户传入的
    callHook(vm,"befoerCreate")  //
    initState(vm); //初始化状态（观测data中的数据）
    callHook(vm,"created")
    if(vm.$options.el){  // 如果vm.$options.el则数据可以挂载页面上
        vm.$mount(vm.$options.el);
    }
  }
  Vue.prototype.$nextTick = nextTick;
  Vue.prototype.$mount = function(el){
    el = document.querySelector(el);
    const vm = this;
    const options = vm.$options;
     vm.$el = el;
    //首先判断vm.$options中是否有render,如果有则直接使用;
    //没有render 看vm.$options中有没有template属性如果有则直接使用,
  // 如果没有template 就找那个外部模板,就是body里面的

  if(!options.render){
      let template = options.template
      if(!template && el ){
         template = el.outerHTML  // el.outerHTML表示获取当前el表示的dom及该dom中的所有dom
      } // outerHTML属性不兼容,可以这样 let template = document,createElement("div").appendChild(el).innerHtML  
      
      const render =  compileToFunction(template)// 编译方法将拿到的模板传进去,将模板编译成一个函数也就是render函数;
        options.render = render;
     } 
    mountComponent(vm,el)//组件挂载函数将vue实例挂载在el上
  }
}

