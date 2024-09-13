<template>
  <div class="flex gap-2">
    <img :src="`/img/channels/${canal}.png`" :alt="'channel-icon' + canal" class="w-8 h-auto"/>
    <span v-if="showName"> {{ canal }}</span>
  </div>
</template>

<script  lang="ts" setup>
import type { Channels } from '../../types/apiTypes';
interface Props {
  canal: Channels;
  showName?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  showName: true,
});

</script>

<style scoped></style>
