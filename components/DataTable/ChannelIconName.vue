<template>
  <div class="flex gap-1">
    <img :src="`/img/channels/${canal}.png`" :alt="'channel-icon' + canal" class="h-6 w-auto"/>
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
