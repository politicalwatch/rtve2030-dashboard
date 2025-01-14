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
    size: 24,
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

    header: () => h("div", { class: "text-left text-xs " }, "Canal"),
    cell: ({ row }) => {
      return h(ChannelIconName, {
        canal: row.getValue("name") as Channels,
      });
    },
  },
  {
    accessorKey: "sdgs",
    size: 80,
    header: () => h("div", { class: "text-left text-xs" }, "ods"),
    cell: ({ getValue }) => {
      const sdgs = getValue() as SdgTopic[];
      return h(sdgSquares, {
        sdgs: sdgs,
      });
    },
  },
  {
    accessorKey: "queryDuration",
    id:"mainSorting",
    invertSorting: true,
    header: ({ column }) => {
      return h(
        "button",
        {
          class: "text-xs flex gap-1 justify-end",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        ["horas", h(Icon, { name: "lucide:arrow-up-down" })]
      );
    },
    cell: ({ row }) => {
      const INshowPercentage = inject("showPercentage") as Ref<boolean>;

      const amount = row.original.queryDuration;
      const formatted = INshowPercentage.value?format.PCT(row.original.queryDuration/row.original.total_duration):format.msToTime(amount);
      return h("div", { class: "text-right font-medium" }, formatted);
    },
  },
  {
    accessorFn: (row) => `${row.queryDuration}`,
    id: "duration",
    size: 100,
    header: () => h("div", { class: "text-right" }, ""),
    cell: ({ row }) => {
      const miniBarProps = {
        total_duration: row.original.total_duration,
        tagged_duration: row.original.tagged_duration,
        queryDuration: row.original.queryDuration,
        maxTotalDuration: row.original.maxTotalDuration,
        showQueryDuration: row.original.showQueryDuration,
      };      
      return h(MiniBarChart, miniBarProps);
    },
  },
  {
    accessorKey: "programs",
    size: 50,
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
