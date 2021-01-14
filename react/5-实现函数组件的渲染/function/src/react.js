/**
 * 
 * @param {*} type  //元素的名称
 * @param {*} config  //元素的属性
 * @param {*} children //元素的内容
 */
function createElement(type,config,children){
 let props = {...config};
 if(arguments.length>3){
   children = Array.prototype.slice.call(arguments,2); // 表示把伪数组变为数组之后从该数组的下标为2的开始截取截到数组的最后；
 }
 props.children = children;
 return {
   type,
   props
 }
}
const React = {createElement}
export default React;