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
      const miniBarProps: {
        total_duration: number;
        tagged_duration: number;
        maxTotalDuration: number;
        filteredTaggedDuration?: number;
      } = {
        total_duration: totalDuration,
        tagged_duration: taggedDuration,
        maxTotalDuration: maxTotalDuration,
      };
      if (filteredTaggedDuration !== undefined) {
        miniBarProps.filteredTaggedDuration = filteredTaggedDuration;
      }
      return h(MiniBarChart, miniBarProps);
    },
  },
  {
    accessorKey: "programs",
    header: () => h("div", { class: "text-right" }, "Programas"),
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
