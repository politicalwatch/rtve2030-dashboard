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
    size: 40,
    cell: ({ getValue }) => {
      const sdgs = getValue() as SdgTopic[];
      return h(sdgSquares, {
        sdgs: sdgs,
      });
    },
  },

  {
    accessorKey: "filtered_duration",
    id: "mainSorting",
    invertSorting: true,
    header: ({ column }) => {
      return h(
        "button",
        {
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        ["", h(Icon, { name: "lucide:arrow-up-down" })]
      );
    },
    cell: ({ row }) => {
      const amount = row.original.filtered_duration ?? -1;
      const formatted = format.msToTime(amount);
      return h("div", { class: "text-right font-medium" }, formatted);
    },
  },

  {
    accessorFn: (row) => `${row.filtered_duration / row.total_duration}`,
    id: "tagged_duration",
    size: 240,
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
      const maxTotalDuration = row.original.maxTotalDuration;
      const filteredTaggedOcc = row.original.filtered_duration;
      const hasActiveFilters = row.original.hasActiveFilters;
      const miniBarProps: {
        total: number;
        maxTotal: number;
        filtered?: number;
        hasActiveFilters: boolean;
      } = {
        total: totalDuration,
        maxTotal: maxTotalDuration,
        hasActiveFilters: hasActiveFilters,
        filtered: filteredTaggedOcc,
      };
      if (filteredTaggedOcc !== undefined) {
      }
      return h(MiniBarChartDos, miniBarProps);
    },
  },
];
