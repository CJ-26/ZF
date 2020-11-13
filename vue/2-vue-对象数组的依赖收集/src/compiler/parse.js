const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; //匹配标签名字
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // 带命名空间的标签
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配开始标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配结束标签名
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; //匹配属性
const startTagClose = /^\s*(\/?)>/;  //判断</

/*
 <div id= "app">
  <div sty;e="color:red;">
    <span>{{name}}</span>
  </div>
</div>

将上面的html如何转成js
第一步: 构建出AST语法树;
例如: {
  tag:"div",
  type:1,
  attrs:[
    {
      style:"color:red"
    }
  ],
 children:[
   {
     type:"span",
     type:1,
     attrs:[],
     children:[]
   }
 ],
 parent:null
}
用于描述dom结构的树

*/

/*
上面的正则就是解析HTML标签的(!唉 特现在看不懂呀)
解析标签的逻辑为没解析一块就删掉一块,直到删没,就解析完了
*/


//解析标签的函数:
export function parseHTML(html) {
  let root = null; // 表示根元素（AST树，树必须的有树根  所以的有树根） 最后生成 AST树
  let currentParent; //当前的爸爸是谁；(也就是当前元素的爸爸是currentPARENT)
  let stack = []; // 栈型结构管理标签；
/*什么叫 栈型结构管理：
 栈是限定仅在表尾进行插入或者删除操作的线性表
 其中表尾具有特殊的意义，称为栈顶，表头则称为栈底
 将插入元素的操作称为入栈删除元素的操作称为出栈
 由于限定插入或删除操作仅在栈顶进行，因此元素的出
 栈顺序与入栈顺序相反最先入栈的元素最后出栈。因此
 又称为后进先出的线性表
*/


  // 生成AST语法树：
  function createASTElement(tag, attrs) {
    //vue3中；里面支持多个根元素（原理外层加了一个空元素）vue2中只有一个根节点
    return {
      tag,
      type: 1,
      children: [],
      attrs,
      parent: null,
    };
  }

  function start(tagName, attrs) {
    //开始标签的处理函数
    let element = createASTElement(tagName, attrs);
    if (!root) {
      //判断树根是否存在如果树根存在需要创建
      root = element;
    }
    currentParent = element;
    stack.push(element);
  }
  function end(tagName) {
    //结束标签的函数
    let element = stack.pop(); // 例如parseHTML的参数html参数中的第一个标签是div第二个标签是spen， stack数组开始第一个push标签[div]，push之后由于代码逻辑参数html中的第一个标签；就会被删掉第二标签就成第一个了，在向stack中push 标签span，之后如过遇到</span>,我就删除stack中的最后一个元素，也就是span了，删除之后stack中的最后一项就为span的父元素也就是div了
    currentParent = stack[stack.length - 1];
    if (currentParent) {
      element.parent = currentParent;
      currentParent.children.push(element);
    }
  }
  function chars(text) {
    // 文本的处理函数；
    text = text.replace(/\s/g, ""); // 去除文本中的空格
    if (text) {
      currentParent.children.push({
        type: 3,
        text,
      });
    }
  }
  function advance(n) {
    //每匹配一段就删除一段函数
    html = html.substring(n);
  }
  function parseStarTag() {
    const start = html.match(startTagOpen); //匹配<div
    if (start) {
      let match = {
        tagName: start[1],
        attrs: [],
      };
      advance(start[0].length);
      let end, attr;
      //不是开头标签结尾一直解析
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        //查找属性；
        advance(attr[0].length);
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]  || true,
        });
      }
      if (end) {   // >
        advance(end[0].length);
        return match;
      }
    }
  }
  while (html) {
    let textEnd = html.indexOf("<"); // 返回html标签字符串的第一次出现的的<的下标, 因为带<号的标签有可能是开始标签也有可能是结束标签都需要去验证
    if (textEnd == 0) {
      let startTagMatch = parseStarTag();
      if (startTagMatch) {
        //开始标签 <
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue;
      }
      let endTgMatch = html.match(endTag);//结束标签 </
      if (endTgMatch) {
        end(endTgMatch[1]);
        advance(endTgMatch[0].length);
        continue;
      }
      /*  
       console.log(html)   =><div style="color:red">
          <span>{{name}}</span>
        </div>
      </div>*/
    }
    let text;
    if (textEnd > 0) {
      //开始解析文本(例如空格，当删除第一个标签的前半部分后第一个标签和第二个标签之间有空格，或者文字时，需要解析文本)
      text = html.substring(0, textEnd);
    }
    if (text) {
      //如果有文本把文本删掉；
      advance(text.length);
      chars(text);
    }
  }
  return root
}


