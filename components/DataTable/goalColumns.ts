import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import MiniBarSdg from "./MiniBarSdg.vue";
import { Icon } from "#components";
export const goalColumns: ColumnDef<TableGoals>[] = [
  {
    accessorKey: "goal",
    header: ({ column }) => {
      return "";
    },
    size: 40,

    cell: ({ row, getValue }) => {
      const style = STYLES.topics[row.original.parentSdg];
      const code = getValue().split(" ")[0];
      return h(
        "div",
        {
          class: "flex gap-2 justify-end items-center text-xs",
        },
        [
          h("span", {}, code),
          h("span", {
            class: "w-2 h-2",
            style: "background-color: " + style?.color,
          }),
        ]
      );
    },
  },
  {
    accessorKey: "query_duration",
    size: MAX_WIDTH_SDG_BAR,
    header: ({ column }) => {
      return h(
        "button",
        {
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        ["\u2001 \u2001 \u2001", h(Icon, { name: "lucide:arrow-up-down" })]
      );
    },
    cell: ({ row }) => {
      return h(MiniBarSdg, {
        base_duration: row.original.base_duration,
        query_duration: row.original.query_duration,
        maxTotalDuration: row.original.maxGoalDuration,
        name: row.original.goal,
        showQueryDuration: row.original.hasActiveFilters,
      });
    },
  },
  {
    accessorKey: "goal",
    id: "mainSorting",
    header: ({ column }) => {
      return h(
        "button",
        {
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        ["\u2001 \u2001 \u2001", h(Icon, { name: "lucide:arrow-up-down" })]
      );
    },
    cell: ({ row, getValue }) => {
      const onlyName = getValue().split(" ").slice(1).join(" ");
      return h(
        "div",
        {
          class: "flex gap-4 justify-end ",
        },
        [h("span", { class: "text-xs" }, onlyName)]
      );
    },
  },
];
