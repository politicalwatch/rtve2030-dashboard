import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import miniBarChart from "./MiniBarChart.vue";
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
      return h(sdgSquares, {
        sdgs: sdgs,
      });
    },
  },

  {
    accessorKey: "tagged_duration",
    header: () => h("div", { class: "text-right" }, ""),
    cell: ({ row }) => {
      const amount = row.original.tagged_duration;
      const formatted = format.N(msToHours(amount));
      return h("div", { class: "text-right font-medium" }, formatted);
    },
  },

  {
    accessorFn: (row) => `${row.total_duration / row.maxTotalDuration}`,
    id: "duration",
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
      const totalDuration = row.original.total_duration;
      const taggedDuration = row.original.tagged_duration;
      const maxTotalDuration = row.original.maxTotalDuration;
      const filteredTaggedDuration = row.original.filteredTaggedDuration;
      const props = {
        total_duration: totalDuration,
        tagged_duration: taggedDuration,
        maxTotalDuration: maxTotalDuration,
      };

      if (filteredTaggedDuration !== undefined) {
        props.filteredTaggedDuration = filteredTaggedDuration;
      }

      return h(miniBarChart, props);
    },
  },
];
