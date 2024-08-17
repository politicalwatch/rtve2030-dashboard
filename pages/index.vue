<template>
  <div>
    Hello
    {{ data }}
  </div>
</template>

<script lang="ts" setup>
const { $api } = useNuxtApp()
const userRepo = dashboardApiRepo($api)
const { data } = await useAsyncData(() => userRepo.getStat(),{
  server:false
})

console.log(data)
</script>

<style>

</style>