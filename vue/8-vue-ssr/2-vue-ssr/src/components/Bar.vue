<template>
  <div>
    bar
    <button @click="show">显示提示框</button>
  </div>
</template>
<script>
export default {
  
methods:{
  show(){
    alert("holle")
  }
}
}
</script>
<style  scope>
div{
  width: 100%;
  background: pink;
}
  
</style>