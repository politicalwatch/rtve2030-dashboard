// https://www.shadcn-vue.com/docs/components/data-table.html#sorting

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Updater } from "@tanstack/vue-table";
import type { Ref } from "vue";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function valueUpdater<T extends Updater<any>>(
  updaterOrValue: T,
  ref: Ref
) {
  ref.value =
    typeof updaterOrValue === "function"
      ? updaterOrValue(ref.value)
      : updaterOrValue;
}

export function getSdgNumberFromName(name: string) {
  return name.split(" ")[1];
}