import { initGlobalAPI } from "./global-api/index";
import { initMixin } from "./init"
import { lifecycleMixin }  from "./lifecycle"
import { renderMixin } from "./render";
//vue在2.0中就是一个构造函数
function Vue(options){
this._init(options) //当用户new的时候就调用_init方法进行vue的/初始化方法
}


//可以拆分不同的文件中，更利于代码的维护 这就是 模块化的概念
initMixin(Vue);  // 扩展初始化方法
lifecycleMixin(Vue);  // 扩展_update方法（更新逻辑用）
renderMixin(Vue);  // 扩展 _render方法（调用render）
//  vm.$options属性可以获取用户配置的所有选项例如 data methods computed  watch 等
initGlobalAPI(Vue); // 初始化全局API(混合全局的aip)


export default Vue


/*
//diff算法的理解 (打开外层注释可以运行代码)  
//因为在html文件中不方便演示vm1是老的vue2是新的,对比替换，所以在这里测试diff算法；

// 下面时没有使用diff算法的流程，例如 vm1是老的vue2是新的vue，现在页面上会出现两个zf，我要保留新的
//去删除老的，并且新的和老的都会走以变渲染流程 ： 创建虚拟dom转化为真实的dom在添加在页面上，
//这样很耗费性能，所以diff算法就是解决耗费性能的对比哪里不同区替换哪里而不是重新走一遍渲染流程；
// 这个例子只有内容不同只要更新内容就可以了
import { compileToFunction } from "./compiler/index.js";
import { createElm, patch } from "./vdom/patch";
let vm1 = new Vue({
  data(){
    return {
      name: "zf"
    }
  }
})
let render1 = compileToFunction(`<div >
<li key = "A" style='background:red'>A</li>
<li key = "B" style='background:yellow'>B</li>
<li key = "C" style='background:blue'>C</li>
<li key = "D" style='background:green'>D</li>
<li key = "F" style='background:pink'>F</li>
</div>`)
let oldVnode = render1.call(vm1)
let el =createElm(oldVnode);
document.body.appendChild(el);



let vm2 = new Vue({
  data(){
    return {
      name: "jw"
    }
  }
})
let render2 = compileToFunction(`<div >
<li key = "N" style='background:green'>N</li>
<li key = "A" style='background:red'>A</li>
<li key = "C" style='background:blue'>C</li>
<li key = "B" style='background:yellow'>B</li>
<li key = "E" style='background:purple'>E</li>
</div>`)
let newVnode = render2.call(vm2)

setTimeout(()=>{
  patch(oldVnode,newVnode)
},2000)
//  想要值去更新不同的地方，所需的逻辑在 patch（oldVnode,newVnode）方法中；
*/