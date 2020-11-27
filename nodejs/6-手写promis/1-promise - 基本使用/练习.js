


//Promise.resolve(1).then(res=>2).catch(err=>3).then(res=>console.log(res))


let p1 = Promise.resolve(1)
let p2=p1.then((x)=>x+1)
let p3=p2.then((x)=>{throw new Error("My Error")}).catch((x)=>{return 1})
let p6=p3.then((x)=>x+1).then((x)=>console.log(x)).catch((err)=>{console.log('err===',err)})               //2                         