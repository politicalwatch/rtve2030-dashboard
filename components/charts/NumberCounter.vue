<script setup lang="ts">
interface Props {
  varValue: number;
  maxValue: number;
  formatter?: Function;
}

const props = withDefaults(defineProps<Props>(), {
  formatter: (value: number) => Math.round(value),
});
</script>

<template>
  <div>
    <div>
      <h2 class="chart-titles">
        <slot></slot>
      </h2>
      <div class="number-counter border-l border-r border-black/30 text-right px-1">
        <span class="number-counter__value text-5xl font-bold font-mono">
          {{ formatter(props.varValue) }}
        </span>
      </div>
    </div>
    <div
      name="counter-footer"
      class=" border-l border-r border-black/30 w-full"
    >
      <div
        class="h-1 bg-slate-600 transition-all duration-1000"
        :style="{ width: (varValue / maxValue) * 100 + '%' }"
      ></div>
      <div class="w-full flex justify-between text-2xs px-1">
        <span>0</span>
        
        <span class="border-l block mb-2 border-black/30 font-mono"></span>
        <span>{{ formatter(props.maxValue) }} </span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
