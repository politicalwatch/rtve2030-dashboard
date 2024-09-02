<template>
  <div class="flex gap-2">
    <img :src="`/img/channels/${canal}.png`" :alt="'channel-icon' + canal" class="w-8"/>
    <span> {{ canal }}</span>
  </div>
</template>

<script  lang="ts" setup>
import type { Channels } from '../../types/apiTypes';
interface Props {
  canal: Channels;
}
const props = withDefaults(defineProps<Props>(), {});

</script>

<style scoped></style>
