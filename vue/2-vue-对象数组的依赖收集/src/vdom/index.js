export function createElement(vm,tag,data={},...childen){
 return vnode(vm,tag,data,data.key,childen,undefined)
}

export  function createTextVnode(vm,text){
 return vnode(vm,undefined,undefined,undefined,undefined,text)
}

function vnode(vm,tag, data, key,children,text){
  return {
    vm,
    tag,
    data,
    key,
    children,
    text
  }
}

/*
虚拟节点可以随意添加属性，但AST不能，因为AST是根据dom结构解析出来的
*/