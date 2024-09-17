import { h } from "vue";
import {
  RowPinning,
  type ColumnDef,
  type RowPinningPosition,
} from "@tanstack/vue-table";
import MiniBarChart from "./MiniBarChart.vue";
import sdgSquares from "./sdgSquares.vue";
import ChannelIconName from "./ChannelIconName.vue";
import { Icon } from "#components";
import { Checkbox } from "@/components/ui/checkbox";

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
    id: "select",
    header: ({ column }) => {
      return h('div', {}
      );
      width: 20
    },
    cell: ({ table, row, column }) =>
      h(Checkbox, {
        checked: row.getIsSelected(),
        "onUpdate:checked": (value: boolean) => {
          row.toggleSelected(!!value);
          row.pin(row.getIsPinned() ? false : "top");   
        },
        ariaLabel: "Select row",
      }),
  },
  {
    accessorKey: "canal",
    header: () => h("div", { class: "text-right" }, ""),
    cell: ({ row, getValue }) => {
      return h(ChannelIconName, {
        canal: getValue() as Channels,
        showName: false,
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
