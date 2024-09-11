import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import MiniBarChart from "./MiniBarChart.vue";
import sdgSquares from "./sdgSquares.vue";
import ChannelIconName from "./ChannelIconName.vue";
import { Icon } from "#components";
export const columns: ColumnDef<TablePrograms>[] = [
  // {
  //   accessorKey: "name",
  //   header: () => h("div", { class: "text-right" }, "Canal"),
  //   cell: ({ row }) => {
  //     return h(ChannelIconName, {
  //       canal: row.getValue("name") as Channels,
  //     });
  //   },
  // },
  {
    accessorKey: "canal",
    header: () => h("div", { class: "text-right" }, ""),
    cell: ({ row, getValue }) => {
      return h(ChannelIconName, {
        canal: getValue() as Channels,
      });
    },
  },
  {
    accessorKey: "name",
    header: () => h("div", { class: "text-right" }, "Programa"),
    cell: ({ row, getValue }) => {
      return h("div", { class: "text-right" }, getValue());
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
    header: ({ column }) => {
      return h(
        "button",
        {
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        ["Detectadas ", h(Icon, { name: "lucide:arrow-up-down" })]
      );
    },
    cell: ({ row }) => {
      const amount = msToHours(row.original.tagged_duration);

      return h("div", { class: "text-right font-medium" }, format.N(amount));
    },
  },
  {
    accessorKey: "total_duration",
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
      return h(MiniBarChart, {
        total_duration: row.original.total_duration,
        tagged_duration: row.original.tagged_duration,
        maxTotalDuration: row.original.maxTotalDuration,
      });
    },
  },
  {
    accessorKey: "episode_count",
    header: () => h("div", { class: "text-right" }, "Episodios"),
    cell: ({ row, getValue }) => {
      const count = Number.parseInt(getValue());

      return h("div", { class: "text-right font-medium" }, count);
    },
  },
];
