const fs = require("fs").promises
async function read(filePath) {
    let name = await fs.readFile(filePath, "utf8"); 
    let age = await fs.readFile(name, "utf8");
    return age;
}
//async执行完之后返回一个Promise；
read("./name.txt").then((res)=>{
  console.log(res)   //read
 })


 //async.await原理：  待续








 