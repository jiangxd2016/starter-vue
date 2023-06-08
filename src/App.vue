<template>
  <main font-sans p="x-4 y-10" text="center gray-700 dark:gray-200">
    <router-view />
    <Footer />
  </main>
</template>
<script setup lang="ts">
import { effect } from 'vue';


const props = withDefaults(defineProps<{aa:any}>(), {
aa:null
})
const obj = reactive({ foo: 1 })
const oth= reactive({bar:2})
    // watchEffect(() => {
    //   console.log(obj.foo)
    // })

// watch(()=>obj.foo ,()=>{
//   console.log(obj.foo);
// },{immediate:true})


effect(()=>{
  console.log("foo",obj.foo);
  console.log("bar",  oth.bar);
})

obj.foo++
obj.foo++
obj.foo++

oth.bar++
</script>
