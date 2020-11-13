const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;  //有{{}}的正则;


/*
<div id="app" a=1 b=2>
    <span style="color:red">{{name}}<a>hello</a></span>
</div>
将上面的html转成js代码（主要是利用字符串拼接）render函数（render函数执行之后就是虚拟dom）
 render(){
   return _c('div',{id:'app',a:1,b:2},_c('span',{style:{color:'red'}),_v(_s(name)),_c('a',{},_v('holles')))
   //_c()函数解析文本dom节点
   // _s()函数解析{{}}的内容
   //_v()函数解析文本
 }
*/

function genProps(attrs){
  let str = '';
  for(let i=0; i<attrs.length; i++){
    let attr = attrs[i];
    if(attr.name ==='style'){
      let obj = {}
      ;
      attr.value.split(";").forEach(item=> {
         let [key,value] = item.split(':');
         obj[key] = value;

      });
      attr.value= obj;
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
 return `{${str.slice(0,-1)}}`
}
function genChildren(el){
   const children = el.children;   
  if(children){
    return children.map(child=>gen(child)).join(",")
  }
   return false;
}
function gen(node){ //孩子分为文本和标签中区分处理
if(node.type===1){
  return generate(node)
}else{
  //文本逻辑不能有_c处理
  // 有{{}} 普通文本 “你好”     混合文本 aa{{}}bbb{{}}
  let text = node.text;
 if(text){
   if(defaultTagRE.test(text)){ //带{{}}的文本；
  let tokens =[];
  let match;
  let index;
  let lastIndex = defaultTagRE.lastIndex = 0; // 正则的lastIndex 属性用于规定下次匹配的起始位置。注意： 该属性只有设置标志 g 才能使用。上次匹配的结果是由方法 RegExp.exec() 和 RegExp.test() 找到的，它们都以 lastIndex 属性所指的位置作为下次检索的起始点。这样，就可以通过反复调用这两个方法来遍历一个字符串中的所有匹配文本。注意：该属性是可读可写的。只要目标字符串的下一次搜索开始，就可以对它进行设置。当方法 exec() 或 test() 再也找不到可以匹配的文本时，它们会自动把 lastIndex 属性重置为 0。例如：var str="The rain in Spain stays mainly in the plain";    var patt1=/ain/g;     while (patt1.test(str)==true) {document.write(patt1.lastIndex); document.write("<br>");};   输出：8  17  28 43       （这里因为上面有test()所以置零一下）                                                          
  while(match = defaultTagRE.exec(text)){
   index = match.index; //正则第一个匹配上的下标；
     if(index>lastIndex){
       tokens.push(JSON.stringify(text.slice(lastIndex,index)))  //截取第一个普通文本不是{{}}文本，因为第一次lastIndex的值是0，index的值是匹配上的{{}}的索引，例如 文本为aaaa{{name}}bbb{{age}}截取的为aaaa  
     }
     tokens.push(`_s(${match[1].trim()})`)
     lastIndex = index+match[0].length
  }
  if(lastIndex<text.length-1){
    tokens.push(JSON.stringify(text.slice(lastIndex)))
  }
   return`_v(${tokens.join("+")})`
   }else{
     return `_v(${JSON.stringify(text)})`     // 普通文本需要JSON.stringify()加引号，要是不见宅执行with(){}的时候如果普通文本的内容于data中的属性相同则会按解析为属性，解析为属性的值；
   }
 }

}
} 
export function generate(el){
  let children = genChildren(el)
  let code = `_c('${el.tag}',${
    el.attrs.length?genProps(el.attrs):'undefined'
  }${
    children? (','+children):""
  })`
 return code;
}

/*
<div id="app" a=1 b=2>
    <span style="color:red">{{name}}<a>hello</a></span>
</div>
*/    