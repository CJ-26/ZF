import { isObject, isReservedTag } from "../util"

export function createElement(vm,tag,data={},...childen){
  /*
  需要对标签做过滤，知道哪些是组件标签例如<my-button></my-button>
  */
 if(isReservedTag(tag)){ //isReservedTag(tag)返回true为原始标签返回false为组件
   //是原始标签的逻辑
  return vnode(vm,tag,data,data.key,childen,undefined)
 }else{
  // 组件的逻辑；
   // 去vue实例的的属性$options上去找components对象给定传入的属性返回对应的值，用这个值去把组件标签转成原始标签；
    const Ctor = vm.$options.components[tag];
    // Ctro返回的值会有两种可能对象或者是函数，当Vue.component("my-buttom",{template:`<button>按钮</button>`})为函数，当let vm = new Vue({ el:"#app",components:{ "my-buttons":{template:`<button>内部按钮</button>`}}})这种情况为对象；
    //在createComponent方法中要判断Ctor是函数还是对象
    return createComponent(vm,tag,data,data.key,childen,Ctor)
 }

}

function createComponent(vm,tag,data,key,childen,Ctor){
  //判断Ctor是函数还是对象 
  if(isObject(Ctor)){
   // 是对象，转成函数：
   Ctor = vm.$options._base.extend(Ctor)  //vm.$options为Vue也即使vue的构造函数；extend方法传入一个对象产生一个构造函数；
  }
  // 给子组件增加生命周期；
  // 组件的虚拟节点上都有hook属性和componentOptions，componentOptions为一个对象里面存放着组件的构造函数；
  data.hook = {
    init(vnode){ 
    // vnode上有属性componentOptions，componentOptions中还有属性Ctor，为该组件的构造函数；
    // new  vnode.componentOptions.Ctor({})件该组件实例化
    let childen =  vnode.componentInstance =  new  vnode.componentOptions.Ctor({})
        childen.$mount();
   } 
  }
 return vnode(vm,`vue-component-${Ctor.cid}${tag}`,data, key,undefined,undefined,{Ctor}) // 创建虚拟节点，参数以为vue的实例，参数二为拼接的组件名子,Ctor.cid为通过vm.$options._base.extend(Ctor)创建的构造函数的id
}


export  function createTextVnode(vm,text){
 return vnode(vm,undefined,undefined,undefined,undefined,text)
}

function vnode(vm,tag, data, key,children,text,componentOptions){  // 创建虚拟节点函数；
  return {
    vm,
    tag,
    data,
    key,
    children,
    text,
    componentOptions, //只有组件有这个属性，存放着组件的构造函数；
  }
}

/*
虚拟节点可以随意添加属性，但AST不能，因为AST是根据dom结构解析出来的
*/