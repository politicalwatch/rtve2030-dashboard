import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import miniBarChart from "./miniBarChart.vue";
import sdgSquares from "./sdgSquares.vue";
import ChannelIconName from "./ChannelIconName.vue";
import { Icon } from "#components";
export const columns: ColumnDef<TableChannels>[] = [
  {
    accessorKey: "name",
    header: () => h("div", { class: "text-right" }, "Canal"),
    cell: ({ row }) => {
      return h(ChannelIconName, {
        canal: row.getValue("name") as Channels,
      });
    },
  },
  {
    accessorKey: "sdgs",
    header: () => h("div", { class: "text-right" }, "ods"),
    cell: ({ getValue }) => {
      const sdgs = getValue() as SdgTopic[];
      return h(sdgSquares,
        {
        sdgs: sdgs,
        });
    },
  },

  {
    accessorKey: "total_duration",
    header: () => h("div", { class: "text-right" }, ""),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("total_duration"));
      const formatted = new Intl.NumberFormat("es-Es").format(
        msToHours(amount)
      );
      return h("div", { class: "text-right font-medium" }, formatted);
    },
  },
  {
    accessorKey: "tagged_duration",
    header: ({ column }) => {
      return h(
        "button",
        {
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        ["Duración", h(Icon, { name: "lucide:arrow-up-down" })]
      );
    },
    cell: ({ row }) => {
      const totalDuration = Number.parseFloat(row.getValue("total_duration"));
      const taggedDuration = Number.parseFloat(row.getValue("tagged_duration"));
      return h(miniBarChart, {
        total_duration: totalDuration,
        tagged_duration: taggedDuration,
      });
    },
  },
];
