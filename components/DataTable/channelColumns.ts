import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import MiniBarChart from "./MiniBarChart.vue";
import sdgSquares from "./sdgSquares.vue";
import ChannelIconName from "./ChannelIconName.vue";
import { Icon } from "#components";
import { Checkbox } from "@/components/ui/checkbox";
export const columns: ColumnDef<TableChannels>[] = [
  {
    id: "select",
    size: 20,
    header: ({ column }) => {
      return h("div", {});
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
    size: 80,
    header: () => h("div", { class: "text-right" }, "ods"),
    cell: ({ getValue }) => {
      const sdgs = getValue() as SdgTopic[];
      return h(sdgSquares, {
        sdgs: sdgs,
      });
    },
  },
  {
    accessorKey: "queryDuration",
    header: ({ column }) => {
      return h(
        "button",
        {
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        ["tagged", h(Icon, { name: "lucide:arrow-up-down" })]
      );
    },
    cell: ({ row }) => {
      const amount = row.original.queryDuration;
      const formatted = format.N(msToHours(amount));
      return h("div", { class: "text-right font-medium" }, formatted);
    },
  },
  {
    accessorFn: (row) => `${row.queryDuration}`,
    id: "duration",
    cell: ({ row }) => {
      const totalDuration = row.original.total_duration;
      const taggedDuration = row.original.tagged_duration;
      const maxTotalDuration = row.original.maxTotalDuration;
      const queryDuration = row.original.queryDuration;
      const miniBarProps: {
        total_duration: number;
        tagged_duration: number;
        maxTotalDuration: number;
        queryDuration?: number;
        showQueryDuration?: boolean;
      } = {
        total_duration: totalDuration,
        tagged_duration: taggedDuration,
        maxTotalDuration: maxTotalDuration,
        showQueryDuration: row.original.hasActiveFilters,
      };
      if (queryDuration !== undefined) {
        miniBarProps.queryDuration = queryDuration;
      }
      return h(MiniBarChart, miniBarProps);
    },
  },
  {
    accessorKey: "programs",
    size: 40,
    header: () => h("div", { class: "text-right !text-xs" }, "Programas"),
    cell: ({ row, getValue }) => {
      const basePrograms = row.original.basePrograms ?? 0;
      const programs = row.original.programs ?? 0;
      return h("div", { class: "text-right font-medium" }, [
        h("span", { class: "font-black" }, programs),
        "/",
        basePrograms,
      ]);
    },
  },
];
