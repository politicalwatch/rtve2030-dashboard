<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-vue-next";

const props = withDefaults(
  defineProps<{
    size?: number;
    class?: HTMLAttributes["class"];
  }>(),
  {
    size: 24,
  }
);
</script>

<template>
  <LoaderCircle :size="props.size" :class="cn('animate-spin', props.class)" />
</template>
