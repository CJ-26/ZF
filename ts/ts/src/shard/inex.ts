export const isObject = (val:unknown):val is Object => typeof val == "object" && val!==null

const hasOwnProperty  = Object.prototype.hasOwnProperty
export const hasOwn = (target,key)=>{ return hasOwnProperty.call(target,key)}  //判断对象中是否有某个属性
export const isArray = (target)=>Array.isArray(target)
export const hasChange = (oldVal,newVal)=>oldVal!=newVal   // 判断两个值是否相同不同返回true