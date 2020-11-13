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