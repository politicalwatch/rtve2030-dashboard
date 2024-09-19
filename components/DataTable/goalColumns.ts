import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import MiniBarSdg from "./MiniBarSdg.vue";
import sdgSquares from "./sdgSquares.vue";
import ChannelIconName from "./ChannelIconName.vue";
import { Icon } from "#components";
export const goalColumns: ColumnDef<TableGoals>[] = [
  {
    accessorKey: "goal",
    header: ({ column }) => {
      return "";
    },
    size:40,
    
    cell: ({ row, getValue }) => {
      const style = STYLES.topics[row.original.parentSdg];
      const code = getValue().split(" ")[0]
      return h(
        "div",
        {
          class: "flex gap-2 justify-end items-center text-xs",
        },
        [h("span", {}, code), h("span", {
          class: 'w-2 h-2',
          style: 'background-color: ' + style?.color,
        }, )]
      );
    },
  },
  {
    accessorKey: "duration",
    size:240,
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
        base_duration: row.original.duration,
        query_duration: 0,
        maxTotalDuration: row.original.maxParentSdgDuration,
        name: row.original.goal,
      });
    },
  },
  {
    accessorKey: "goal",
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
        [h("span", {class: 'text-xs'}, onlyName)]
      );
    },
  },
];
