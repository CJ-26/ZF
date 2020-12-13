const vm = require("vm")
global.e = 6
vm.runInThisContext("console.log(e)")