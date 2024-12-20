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
      return h("div", {});
      width: 20;
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
    header: () => h("div", { class: "text-right text-xs" }, ""),
    cell: ({ row, getValue }) => {
      return h(ChannelIconName, {
        canal: getValue() as Channels,
        showName: false,
      });
    },
  },
  {
    accessorKey: "name",
    header: () => h("div", { class: "text-left text-xs" }, "Programa"),
    cell: ({ row, getValue }) => {
      return h("div", { class: "text-left" }, getValue());
    },
  },
  {
    accessorKey: "sdgs",
    header: () => h("div", { class: "text-left" }, "ods"),
    cell: ({ getValue }) => {
      const sdgs = getValue() as SdgTopic[];
      return h(sdgSquares, {
        sdgs: sdgs,
      });
    },
  },

  {
    id:"mainSorting",
    invertSorting: true,
    accessorFn: (row) =>
      `${row.hasActiveFilters ? row.queryDuration : row.tagged_duration}`,
    header: ({ column }) => {
      return h(
        "button",
        {
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          class: "text-xs flex gap-1 justify-end",
        },
        ["horas", h(Icon, { name: "lucide:arrow-up-down" })]
      );
    },
    cell: ({ row }) => {
      const INshowPercentage = inject("showPercentage") as Ref<boolean>;
      
      let amount = row.original.hasActiveFilters
        ? row.original.queryDuration
        : row.original.tagged_duration;

      let pct = amount / row.original.total_duration;

      return h(
        "div",
        { class: "text-right font-medium" },
        INshowPercentage.value?format.PCT(pct):format.msToTime(amount)
      );
    },
  },
  {
    accessorKey: "total_duration",
    header: ({ column }) => {
      return h("div", { class: "text-right" }, "");
    },
    size: 240,
    cell: ({ row }) => {
      return h(MiniBarChart, {
        total_duration: row.original.total_duration,
        tagged_duration: row.original.tagged_duration,
        maxTotalDuration: row.original.maxTotalDuration,
        queryDuration: row.original.queryDuration,
        showQueryDuration: row.original.hasActiveFilters,
      });
    },
  },
  {
    accessorKey: "episode_count",
       header: ({ column }) => {
      return h(
        "button",
        {
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
          class: "text-xs flex gap-1 justify-end",
        },
        ["episodios", h(Icon, { name: "lucide:arrow-up-down" })]
      );
    },
    cell: ({ row, getValue }) => {
      const count = Number.parseInt(getValue());

      return h("div", { class: "text-right font-medium" }, count);
    },
  },
];
