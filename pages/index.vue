<template>
  <div class="container">
    Hello
    {{ data }}
  </div>
</template>

<script lang="ts" setup>
const { $api } = useNuxtApp();
// const { data } = await useAsyncData(() => userRepo.getStats(), {
//   server: false,
// });
const data = ref<Stat[] | null>(null);

onMounted(async () => {
  const userRepo = dashboardApiRepo($api);
  console.log($api)
  data.value = await  userRepo.getStats()
  console.log(data.value)
})
</script>

<style></style>
