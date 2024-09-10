import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import MiniBarChartDos from "./MiniBarChartDos.vue";
import sdgSquares from "./sdgSquares.vue";
import ChannelIconName from "./ChannelIconName.vue";
import { Icon } from "#components";
export const columns: ColumnDef<TableTags>[] = [
  {
    accessorKey: "name",
    header: () => h("div", { class: "text-left" }, "términos"),
    cell: ({ row }) => {
      const name = row.original.name;
      return h("div", { class: "text-left font-medium" }, name ?? "");
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
    accessorKey: "filtered_occurrences",
    header: () => h("div", { class: "text-right" }, ""),
    cell: ({ row }) => {
      const amount = row.original.filtered_occurrences ?? -1 ;
      const formatted = format.N(amount);
      return h("div", { class: "text-right font-medium" }, formatted);
    },
  },

  {
    accessorKey: "total_occurrences",
    id: "duration",
    header: ({ column }) => {
      return h(
        "button",
        {
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        ["Ocurrencias", h(Icon, { name: "lucide:arrow-up-down" })]
      );
    },
    cell: ({ row }) => {
      const totalDuration = row.original.total_occurrences;
      const maxTotalOccurrences = row.original.maxTotalOccurrences;
      const filteredTaggedOcc = row.original.filtered_occurrences;
      const hasActiveFilters = row.original.hasActiveFilters;
      const miniBarProps: {
        total: number;
        maxTotal: number;
        filtered?: number;
        hasActiveFilters: boolean;
      } = {
        total: totalDuration,
        maxTotal: maxTotalOccurrences,
      };
      if (filteredTaggedOcc !== undefined) {
        miniBarProps.filtered = filteredTaggedOcc;
      }
      return h(MiniBarChartDos, miniBarProps);
    },
  },
];
