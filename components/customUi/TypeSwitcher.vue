<template>
  <fieldset class="c-type-switcher" ref="container">
    <div>
      <input
        type="radio"
        id="tve"
        name="tve"
        :value="MediaType.TV"
        v-model="localMediaType"
      />
      <label for="tve">
        <img
          src="/img/tve.svg"
          alt="TVE logo"
          class="transition-all duration-200 h-[18px] mt-0.5 "
      /></label>
    </div>

    <div>
      <input
        type="radio"
        id="rtve"
        name="rtve"
        :value="MediaType.ALL"
        v-model="localMediaType"
      />
      <label for="rtve">RTVE</label>
    </div>

    <div>
      <input
        type="radio"
        id="rne"
        name="rne"
        :value="MediaType.RADIO"
        v-model="localMediaType"
      />
      <label for="rne"
        ><img
          src="/img/rne.svg"
          alt="RNE logo"
          class="transition-all duration-200 h-4 mt-1"
      /></label>
    </div>
  </fieldset>
</template>

<script setup>
import { useElementSize } from "@vueuse/core";
const filters = useFiltersStore();
const localMediaType = ref(MediaType.ALL);

watch(
  () => localMediaType.value,
  (newValue, oldValue) => {
    filters.updateRadioOrTV(newValue);
  }
);
const container = ref(null);
const { width } = useElementSize(container);

const middle = computed(() => `${width.value / 2 - 11}px`);
const end = computed(() => `${width.value - 24}px`);
</script>

<style scoped>
.c-type-switcher {
  position: relative;
  padding: 0;

  height: 24px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 24px;
  transition: all 0.3s;
  border: 2px solid #ccc;
}

@media (min-width: 768px) {
  /* Assuming $md is 768px */
  .c-type-switcher {
    margin: 0 3rem;
  }
}

.c-type-switcher label {
  position: absolute;
  font-size: 1rem;
  font-weight: 500;
  color: #000;
  z-index: 1;
  top: calc(50% - 12px);
}

.c-type-switcher label[for="rtve"] {
  display: none;
}

.c-type-switcher:has(#tve:checked) label[for="rne"] {
  opacity: 0.2;
}

.c-type-switcher:has(#rne:checked) label[for="tve"] {
  opacity: 0.2;
}

.c-type-switcher label[for="tve"] {
  left: calc(-50% + 6px);
}

.c-type-switcher label[for="rne"] {
  right: calc(-50% + 4px);
}

.c-type-switcher input {
  width: 30px;
  height: 30px;
  appearance: none;
}

.c-type-switcher::before {
  position: absolute;
  content: "";
  width: 16px;
  height: 16px;
  top: 2px;
  left: 3px;
  border-radius: 50%;
  background-color: #333;

  transition: all 0.3s;
}

.c-type-switcher:has(#tve:checked)::before {
  transform: translateX(0);
}

.c-type-switcher:has(#rtve:checked) {
  background-color: white;
}

.c-type-switcher:has(#rtve:checked)::before {
  transform: translateX(v-bind(middle));
}

.c-type-switcher:has(#rne:checked)::before {
  transform: translateX(v-bind(end));
}
</style>
