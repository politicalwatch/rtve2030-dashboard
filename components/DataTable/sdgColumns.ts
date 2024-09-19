import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import MiniBarSdg from "./MiniBarSdg.vue";
import sdgSquares from "./sdgSquares.vue";
import ChannelIconName from "./ChannelIconName.vue";
import { Icon } from "#components";
export const columns: ColumnDef<TableSdg>[] = [
  {
    id: "toggle",
    size:20,
    enableResizing:false,
    cell: ({ row }) => {
      return h(
        "button",
        {
          onClick: () => row.toggleExpanded(),
        },
        [
          h(Icon, {
            name: row.getIsExpanded()
              ? "lucide:chevron-down"
              : "lucide:chevron-right",
          }),
        ]
      );
      return;
    },
  },
  {
    accessorKey: "sdg",
    header: ({ column }) => {
      return "";
    },
    size:40,
    
    cell: ({ row, getValue }) => {
      const style = STYLES.topics[getValue()];
      return h("img", {
        class: "text-left h-6 w-6",
        style: "background-color: " + style?.color,
        src: "/img/topics/" + style?.image,
      });
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
        base_duration: row.original.base_duration,
        query_duration: row.original.query_duration,
        maxTotalDuration: row.original.maxTotalDuration,
        name: row.original.sdg,
      });
    },
  },
  {
    accessorKey: "sdg",
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
      const onlyName = getValue().split(" ").slice(2).join(" ");
      const onlyNumber = getValue().split(" ")[1];
      return h(
        "div",
        {
          class: "flex gap-4 justify-end ",
        },
        [h("span", {}, onlyName), h("span", {}, onlyNumber)]
      );
    },
  },
];
