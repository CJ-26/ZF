import { mergeOptions } from "../util";
export function initGlobalAPI(Vue) {
  Vue.options = {}; //Vue.options为静态属性，用于存储全局的配置例如钩子函数、fliter directive component
  Vue.mixin = function (mixin) {  // 这里的this是Vue构造函数，而不是new Vue（）的实例；
    this.options = mergeOptions(this.options,mixin) //mergeOptions用于混合Vue.mixin({})和new Vu({})中的配置（是混合而不是覆盖）；（将mixin合并到this。options中，也就是说this.options为父亲，mixin为儿子）
     console.log(this.options)
    return this; //为了方便链式调用，所以return this；
  };
}
