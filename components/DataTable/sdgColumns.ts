import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import miniBarChart from "./miniBarChart.vue";
import sdgSquares from "./sdgSquares.vue";
import ChannelIconName from "./ChannelIconName.vue";
import { Icon } from "#components";
export const columns: ColumnDef<StatsSdg>[] = [
  {
    id: "toggle",
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
    accessorKey: "sdg",
    cell: ({ row, getValue }) => {
      return h(
        "div",
        {
          class: "text-left ",
        },
        getValue()
      );
    },
  },
];
