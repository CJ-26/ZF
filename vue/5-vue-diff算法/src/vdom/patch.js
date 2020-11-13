import { isSameVnode } from "./index.js";

 // patch将虚拟节点转化成真实节点；
export function patch(oldVnode, vnode) {
  if(!oldVnode){ //如果oldVnode不存在为组件；
    return createElm(vnode);
  }
  // 原则上oldVnode为一个老的虚拟节点但第一次也就是初始化的是时候为真实元素也就是挂载的元素，vnode为虚拟节点， //后续dom更新也会走patch方法
  const isRealElement = oldVnode.nodeType; //  判断是否是初次渲染，如有值就是每就不是  //nodeType 属性返回以数字值返回指定节点的节点类型。 如果节点是元素节点，则 nodeType 属性将返回 1。如果节点是属性节点，则 nodeType 属性将返回 2。
  if (isRealElement) {
    //初次渲染  ，oldVnode为一个真实dom；
    const oldElm = oldVnode;
    const parent = oldElm.parentNode;
    let el = createElm(vnode); //根据虚拟节点创建真实的节点；
    parent.insertBefore(el, oldElm.nextSibling); //insertBefore() 方法在您指定的已有子节点之前插入新的子节点。  // nede.nextSibling,表示该元素的下一个元素；
    parent.removeChild(oldElm);
    return el;
  } else {
  
    //不是初次渲染，diff算法:两个虚拟节点的比对(oldVnode和node都是虚拟节点)
    if(oldVnode.tag !== vnode.tag){
        //如何两个虚拟dom节点的标签不一致，那就直接替换掉就结束（这个if逻辑只能算是优化策略不时diff算法） 
        //在将虚拟节点传化为真实节点时，会将创建的真实节点挂载在虚拟节点的el属性上；
        // oldVnode.el拿到老的真实dom节点， oldVnode.el.parentNode到老的真实dom节点的父节点，createElm(vnode)将新的虚拟dom转化为真实的dom节点
        //  oldVnode.el.parentNode.replaceChile(createElm(vnode),ldVnode.el)新节点替换掉老节点；
       return oldVnode.el.parentNode.replaceChild(createElm(vnode),oldVnode.el);
    }
   
   if(!oldVnode.tag){ // 如果老的为文本节点：(文本节点的虚拟dom的结构为:{tag:undefined,text:"xx"})
     if(oldVnode.text !== vnode.text){
      // 俩个文本节点不相同的情况下：
      //将老的文本替换成新的文本:(这个if逻辑只能算是优化策略不时diff算法)
      return oldVnode.el.textContent = vnode.text; 
     }
   }

   //元素相同
   let el = vnode.el =  oldVnode.el  // 考虑元素相同复用老节点的元素，将老节点的元素赋给新节点；（虚拟节点的el属性用来存放正式的dom）
   updateProperties(vnode,oldVnode.data) // 老节点的元素赋给新节点之后考虑属性不同更新节点的属性函数(updateProperties()) 参数一为新节点参数二为老节点的属性
    /*
    上面标签相同，属性更新完后要比较儿子；
   比价儿子的三种情况：
   1、老的有儿子新的也有儿子（diff算法）
   2、 老的有儿子新的没有儿子 将老的儿子删掉；
   3、 新的有儿子老的没有儿子 需要在老节点上增加新节点的儿子
   
   */

 
  let oldChildren = oldVnode.children || {};
  let newChildren =  vnode.children || {};
   if(oldChildren.length>0&&newChildren.length>0){
      // 第一种情况： 老的有儿子新的也有儿子（diff算法）(这里老节点的标签已经赋给了新虚拟节点也就是是新节点的el属性，操作虚拟dom的el属性就是操作老节点的元素):
      /*
      核心diff函数updateChildren用于更新儿子方法 三个参数，一、真实的老节点标签（也就是变量el或者vnode.el, 因为元素相同复用老的标签，上面逻辑let el = vnode.el =  oldVnode.el 将老节点标签已经赋给新虚拟节点的el属性和变量el了）
      参数二老的孩子
      参数三 新的孩子；
      */
      updateChildren(el,oldChildren,newChildren) 
    }else if(oldChildren.length>0){
    // 老的有儿子新的没有儿子； 删掉老的儿子 (这里老节点的标签已经赋给了新虚拟节点也就是是新节点的el属性，操作虚拟dom的el属性就是操作老节点的元素)；
        el.innerHTML = ''  // 删除所有老的所有节点（因为 上面逻辑let el = vnode.el =  oldVnode.el 将老节点标签已经赋给新虚拟节点的el属性和变量el了所以el和vnode.el就是老节点 ）
   }else if(newChildren.length>0){
    // 新的有儿子老的没有；将新的节点的儿子添加到老的节点里面里面里(这里老节点的标签已经赋给了新虚拟节点也就是是新节点的el属性，操作虚拟dom的el属性就是操作老节点的元素)；
    //循环新节虚拟点的儿子，将儿子添加到老节点(这里的老节点为老的标签就是已经赋给新虚拟节点的el属性了上面有 这样的代码 let el = vnode.el =  oldVnode.el 现在的老节点就是vnode.el或者是el变量，是真实的元素)中
    // el为真实的元素添加进来的孩子也是真实的dom，将虚拟节点转化为真实的dom需调用createEL函数；
    newChildren.forEach((child)=>{el.appendChild(createElm(child))}) 
    
    }
  }
}


/*核心diff逻辑函数 更新节点的孩子；
 参数一要更新的节点（ 参数一和参数二对比更新出新的孩子添加在参数一里，所以参数一为parent）
参数二 ：老节点的孩子
参数三：新节点的孩子
diff算法采用双指针策略：
新的虚拟dom和就的虚拟dom的头部和尾部个一指针，简单讲就是移动指针当头部指针和尾部指针重合比对完毕，进行插入 删除  替换等操作

考虑的情况有一下几种：
1、向后插入元素
2、向前插入元素；
*/ 
  function updateChildren(parent, oldChildren, newChildren) {
    let oldStartIndex = 0; //老虚拟节点儿子的索引（老节点的头部指针的位置，该变量在对比过程中会递增移动，也就是移动指针）
    let oldEndIndex = oldChildren.length - 1; //老虚拟节点节点最后一个儿子的引索（老节点的尾部指针的位置，该变量在对比过程中会递减移动，也就是移动指针）
    let oldStartVnode = oldChildren[0]; //老节虚拟点的第一个儿子的虚拟节点
    let oldEndVnode = oldChildren[oldEndIndex]; //老节虚拟点的最后个儿子虚拟节点

    let newStartIndex = 0; //新虚拟节点儿子的索引 （新节点的头部指针的位置，该变量在对比过程中会递增移动，也就是移动指针）
    let newEndIndex = newChildren.length - 1; //新虚拟节点节点最后一个儿子的引索 （新节点的头部指针的位置，该变量在对比过程中会递增移动，也就是移动指针）
    let newStartVnode = newChildren[0]; //新节虚拟点的第一个儿子的虚拟节点
    let newEndVnode = newChildren[newEndIndex]; //新节虚拟点的最后个儿子虚拟节点


   function  makeIndexByKey(oldChildren) {
         let map = {};
         oldChildren.forEach((item,index)=>{
           map[item.key] = index;
         })
         return map;
   }   

   //  虚拟节点中的孩子为一个数组集合， 通过出老节点中的孩子的下标联合孩子的key
   //映射出一个属性为孩子的key对应的值该属性的值为这个还是的索引（也就是下标）
   //diff算法乱序使用；
    let map = makeIndexByKey(oldChildren);


    // oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex,判断指针是否有重合的如果重合比对循环停止；
    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
     
      if(!oldStartVnode){ //diff算法dome乱序的时候，如果老的中有与新的相同的需要移动老的，原有的位置赋值为undefined所以要判断一下如果是undefined，老的头指针要向后移动一位；
         oldStartVnode = oldChildren[++oldStartIndex]
      }else if(!oldEndVnode){ //与上面判断if(!oldStartVnode)同理；
        oldEndVnode = oldChildren[--oldEndIndex];
      
        // isSameVnode(oldStartVnode, newStartVnode）判断老节点和新节点的第一个儿子的标签名和key是否相同
      // 如果相同则进入if
      }else if (isSameVnode(oldStartVnode, newStartVnode)) { //头与头相等
        patch(oldStartVnode, newStartVnode); // 递归对比节点
        oldStartVnode = oldChildren[++oldStartIndex]; // 老节点的头指针向后移动
        newStartVnode = newChildren[++newStartIndex]; // 新节点的头 指针向后移动；
      }else if(isSameVnode(oldEndVnode,newEndVnode)){ //  判断老节点和新节点的最后个儿子的标签名和key是否相同相同进入条件；
        patch(oldEndVnode, newEndVnode); // 递归对比节点
        oldEndVnode = oldChildren[--oldEndIndex]; // 老节点的尾指针向前移动
        newEndVnode = newChildren[--newEndIndex]; // 新节点的尾指针向前移动；
      }else if(isSameVnode(oldStartVnode,newEndVnode)){ //头与尾相等，将头移到尾的后面
        // 老的头和新的头不相同但和新的尾相同的情况
        patch(oldStartVnode, newEndVnode); // 递归对比节点
        parent.insertBefore(oldStartVnode.el,oldEndVnode.el.nextSibling); // 将老的头差到老的尾的下一个节点的前面（也就是将老的头放到老的尾的后面紧挨着尾）
        oldStartVnode = oldChildren[++oldStartIndex];
        newEndVnode = newChildren[--newEndIndex];
      }else if(isSameVnode(oldEndVnode,newStartVnode)){ //老的尾与新的头相同对比，将老的尾移动到老的头前面；
        patch(oldEndVnode,newStartVnode); // 递归对比节点
        parent.insertBefore(oldEndVnode.el,oldStartVnode.el)
        oldEndVnode = oldChildren[--oldEndIndex];
        newStartVnode = newChildren[++newStartIndex];
      }else{
         //  上面的逻辑是先老的头和新的头相等，之后在老的尾和新的尾相同 ， 之后在 老的头和新的尾相等，老的尾和新的头相等都已经有了
         /*  diff算法乱序， 的思想 ：例如两组dom 老的为为  A B C D F 新的为 N A C B E
               第一步、老的头指针在A上尾指针在F上 ，新的头指针在N上尾指针在E上
              用新的头指针对应的也就N 去和老的头指针对应的也就是A、对不不同则 在和老的尾指针也就是F对比，也不同
              在去查找老的中是否有与之相同的 没有在，在老的头指针对应的元素也就是A前面创建添加新的头指针对应的元素也就是N
              老的变为 N A B C D F  新的还是 N A C B E 但新头指针移动到A上了，老的头指针不变；
             第二步、  新的头指针对应的元素 A ,去和老的头指针对应的也就是A对比相同，跳过，移动老的头指针到B上
             移动新的头指针到C身上
             老的变为 N A B C D F  新的还是 N A C B E
            第三步、新的头部对应的指针也就是C。去与 老的头指针对应的也就是 B对比不同，在和老的尾指针上的元素也就是F对比不同
            再去查看老的上面有与新的头指针对应的元素也就是c相同的吗，查看到有，将老的该元素也就是C移动到，老的头指针对应的元素也就是B的前面，
            将原来老的C的位置用null占位（因为是数组移动走了并没有占位的会发生塌陷）
             之后新的头指针向后移动也就是指向B老的不动，
            结果： 老的变为 N A C B null D F  新的还是 N A C B E
           第四步、 用新的头指针对应的元素也就是B与老的头对应的指针也就是B对对比相同， 移动老的头指针发现移动到了null上为空跳过在移动到D上， 同时移动
           新的头指针到E上 此时新的头指针已经和新的尾指针重合了完成第五步的对比逻辑就停止了，
           第五步、 用新的头指针对应的也就E 去和老的头指针对应的也就是D、对不不同则 在和老的尾指针也就是F对比，也不同
             在去查找老的中是否有与之相同的 没有在， 在老的头指针对应的元素也就是D的前面创建添加新的头指针对应的元素也就是E，
             此时都对比完了将从老的头部指针对应的元素开始知道最后都删掉，老的就完全更新完了，之后添加到对应的父元素里面就完成了
             如何去实行如下：
             */
            /*
             1\ 需要映射一个对象为map，里面为 老节点的key的值为属性 该属性的值为老节点的下标（这了不管是老节点还是新节点都是孩子节点，虚拟dom中的孩子存放在数组中所以有下标的；）
              2、新节点与老节点对比后移动老节点的时候就可以通过新节点的key去找老节点的索引(怎么通过key来找老节点的引索，需要用映射的map对象了)，在通过索引找到老节点
             */
            let moveIndex = map[newStartIndex.key]  // 判断老节点中的key是否有与新节点相同的；
            if(moveIndex == undefined){ //有相同的
             parent.insertBefore(createElm(newStartVnode),oldStartVnode.el)
            }else{
              let moveVnode = oldChildren[moveIndex]  // 获取相同的老节点；
              oldChildren[moveIndex]=undefined;
              patch(moveVnode,newStartVnode) ; //比对两虚拟节点，类如更新属性等。。
              parent.insertBefore(moveVnode.el,oldStartVnode.el);
            }
            newStartVnode = newChildren[++newStartIndex]
      }
    }
    // 根据跳出while循环后指针的位置来判断如何去合并新老节点的孩子
       //  如果新节点的头部指针的位置小于尾部指针的位置，为向后插入了元素或者向前插入元素，将元素插入parent中的前面或者后面；
    if (newStartIndex <= newEndIndex) {  
        // 根据尾指真的位置来判断是向前插入还是向后插入
        // 当向后插入的时候移动的是头指针尾指针的hi不动的也就是说尾指针后面是没有元素的
        // 当向前插入移动的是尾指针（尾指针是递减移动的），因为尾指针是往前移所以尾指针后面是一定会有元素的
        //  向前插入：newChildren[newEndIndex+1].el  其实求的就老节点第一个孩子的dom；
        let nextEle =  newChildren[newEndIndex+1] == null ? null : newChildren[newEndIndex+1].el 
        for (let i = newStartIndex; i <= newEndIndex; i++) {
          parent.insertBefore(createElm(newChildren[i]),nextEle)  // parent.insertBefore()方法参数一为要插入的节点，参数二为要插在谁前面的节点，但第二个参数为null的时候则要插入的节点会插在父元素的最后面；
      }
    }
    if(oldStartIndex<=oldEndIndex){
       for(let i =oldStartIndex;i<=oldEndIndex;i++){
         let child = oldChildren[i]
         if(child !=undefined){
           parent.removeChild(child.el);
         }
       }
    }
  }

//判断是否为组件
function createComponent(vnode){
 let i = vnode.data;
 if((i=i.hook)&&(i=i.init)){
   /*
    这里的逻辑为声明一个i，将vnode.data赋值给i， 
    if((i=i.hook)&&(i=i.init)) :将i中的i.hook赋值给i，判断i是否存在，存在之后在将i中的init赋值给i判断是否存在；
   */
    i(vnode); // 调用组件的初始化函数；
 }
 if(vnode.componentInstance ){ // 如果虚拟节点上有组件的实例说明当前虚拟节点为组件
  return true;
 }
 return false;
}
export function createElm(vnode) {
  //根据虚拟节点创建真实节点；
  let { tag, children, key, data, text, vm } = vnode;
  if (typeof tag === "string") {  
    //tag可能是组件也可能是标签需要判断；
    if(createComponent(vnode)){
       //createComponent(vnode)执行createComponent返回为true则为组件
        // createComponent方法会调用组件的初始化方法发，后续逻辑会在组件的初始化
        // 中进行；
       return  vnode.componentInstance.$el;
    }
    vnode.el = document.createElement(tag);
    updateProperties(vnode); // 更新dom的属性；
    if (children) {
      children.forEach((child) => {
        //如果有children则递归
        vnode.el.appendChild(createElm(child));
      });
    }
  } else {
    vnode.el = document.createTextNode(text);
  }

  return vnode.el;
}

function updateProperties(vnode,oldProps={}) { 
  //第二个参数的作用为当有标签更新时更新diff算法和优化策略中，要传入老的虚拟dom的属性oldProps为老的
  let newProps = vnode.data || {}; //获取属性；
  let el = vnode.el; // 获取dom
  // 老的虚拟dom上的属性新虚拟dom上的没有，要删除老的属性
  for(let key in oldProps){
    if(!newProps[key]){
      el.removeAttribute(key)
    }
  }
  
  //新老样式需要对比处理；
  let  newStyle  = newProps.style || {}
  let  oldStyle = oldProps.style || {}
  // 老的有样式，新的没有，需要将新的样式的属性值清空(如果不清空覆盖掉还会显示老的样式的)
  for(let key in oldStyle){
    if(!newStyle[key]){
      el.style[key] = '';
    }
  }

  //新虚拟dom上属性老的虚拟dom上没有但老虚拟dom上的属性新的有，直接用新的覆盖老的;
  for (let key in newProps) {
    if (key === "style") {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName];
      }
    }else if(key === "class"){
        el.className = newProps[key]
    }else {
      el.setAttribute(key, newProps[key]);
    }
  }
}


/* 留一问题，tag不相同 key相同和tag相同key不同怎么对比na*/