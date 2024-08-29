<template>
    <div v-if="fullscreen" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
        <div class="lds-dual-ring"></div>
    </div>
    <div v-else class="flex items-center justify-center">
        <div class="lds-dual-ring"></div>
    </div>
</template>

<script>
export default {
    props: {
        fullscreen: {
            type: Boolean,
            default: true
        }
    }
}
</script>

<style scoped>
.lds-dual-ring {
  display: inline-block;
  width: 80px;
  height: 80px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #800;
  border-color: #800 transparent #800 transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>