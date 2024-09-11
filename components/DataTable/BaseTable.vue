<script setup lang="ts" generic="TData, TValue">
import {
  FlexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
  getFilteredRowModel,
  getExpandedRowModel,
} from "@tanstack/vue-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";

import type {
  ColumnDef,
  SortingState,
  ExpandedState,
  ColumnFiltersState
} from "@tanstack/vue-table";

const columnFilters = ref<ColumnFiltersState>([]);

import GoalSub from "./GoalSub.vue";
const afterNextTick = ref(false);
onMounted(async () => {
  await nextTick();
  afterNextTick.value = true;
});
interface Props<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchColumnName?: keyof TData;
  teleportTarget?: string;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props<TData, TValue>>(), {
  searchColumnName: undefined,
  teleportTarget: "body",
  placeholder: "Filtrar términos...",
});

const sorting = ref<SortingState>([]);
const expanded = ref<ExpandedState>({});

const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return props.columns;
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),

  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onExpandedChange: (updaterOrValue) => valueUpdater(updaterOrValue, expanded),
  onColumnFiltersChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnFilters),
  getFilteredRowModel: getFilteredRowModel(),

  getExpandedRowModel: getExpandedRowModel(),
  initialState: {
    pagination: {
      pageSize: 15,
    },
  },
  // getSubRows: (row) => row.getExpandedRowModel().rows,
  state: {
    get sorting() {
      return sorting.value;
    },
    get expanded() {
      return expanded.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
  },
});

const tableCurrentPage = computed(() => {
  return table.getState().pagination.pageIndex;
});

function getVisiblePages() {
  const currentPage = tableCurrentPage.value;
  const pageCount = table.getPageCount();
  const visiblePages = [];

  if (currentPage <= 3) {
    for (let i = 1; i <= 4; i++) {
      visiblePages.push(i);
    }
  } else if (currentPage >= pageCount - 3) {
    for (let i = pageCount - 4; i <= pageCount; i++) {
      visiblePages.push(i);
    }
  } else {
    for (let i = currentPage - 2; i <= currentPage + 2; i++) {
      visiblePages.push(i);
    }
  }
  return visiblePages;
}
</script>

<template>
  <div class="border rounded-md">
    <template
      v-if="
        teleportTarget !== 'body' &&
        searchColumnName != undefined &&
        afterNextTick
      "
    >
      <Teleport defer :to="teleportTarget">
        <div class="relative w-full max-w-md items-center">
          <Input
            class="pr-10 placeholder:text-gray-300"
            :placeholder="placeholder"
            :model-value="
              table.getColumn(searchColumnName)?.getFilterValue() ?? ''
            "
            @update:model-value="
              table
                .getColumn(searchColumnName)
                ?.setFilterValue($event as string)
            "
          />
          <span
            class="absolute end-0 inset-y-0 flex items-center justify-center px-2"
          >
            <Icon name="lucide:search" class="size-4 text-gray-200 " />
          </span>
        </div>
      </Teleport>
    </template>
    <Table>
      <TableHeader>
        <TableRow
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
          <TableHead v-for="header in headerGroup.headers" :key="header.id">
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <template v-for="row in table.getRowModel().rows" :key="row.id">
            <TableRow
              :data-state="row.getIsSelected() ? 'selected' : undefined"
            >
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </TableCell>
            </TableRow>
            <TableRow v-if="row.getIsExpanded()">
              <TableCell :colspan="columns.length">
                <GoalSub :data="row.original.goals"> </GoalSub>
              </TableCell>
            </TableRow>
          </template>
        </template>
        <template v-else>
          <TableRow>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
    <!-- pagination getPageCount() is the total number of pages. While pageIndex start with 0.
      so max page is getPageCount() - 1 
      page array also starts with 1 so when we loop through it we need to subtract 1 from it to use it as pageIndex
    -->

    <div
      class="flex items-center justify-center py-4 space-x-2 w-full"
      v-if="table.getPageCount() > 1"
    >
      <button :disabled="tableCurrentPage === 0" @click="table.previousPage()">
        <Icon name="lucide:chevron-left" class="text-gray-400" />
      </button>

      <template v-if="table.getPageCount() <= 6">
        <button
          v-for="page in table.getPageCount()"
          :key="page"
          class="text-gray-400 text-xs"
          :class="{ 'font-bold !text-black': page === tableCurrentPage + 1 }"
          @click="table.setPageIndex(page - 1)"
        >
          {{ page }}
        </button>
      </template>
      <!-- larger pages -->
      <template v-else>
        <button
          class="text-gray-400 text-xs"
          :class="{ 'font-bold !text-black': tableCurrentPage === 0 }"
          v-if="!getVisiblePages().includes(1)"
          @click="table.setPageIndex(0)"
        >
          1
        </button>
        <span v-if="tableCurrentPage > 4">...</span>

        <button
          v-for="page in getVisiblePages()"
          :key="page"
          class="text-gray-400 text-xs"
          :class="{ 'font-bold !text-black': page === tableCurrentPage + 1 }"
          @click="table.setPageIndex(page - 1)"
        >
          {{ page }}
        </button>
        <span v-if="tableCurrentPage < table.getPageCount() - 3">...</span>

        <button
          v-if="!getVisiblePages().includes(table.getPageCount())"
          class="text-gray-400 text-xs"
          :class="{
            'font-bold !text-black':
              tableCurrentPage === table.getPageCount() - 1,
          }"
          @click="table.setPageIndex(table.getPageCount() - 1)"
        >
          {{ table.getPageCount() }}
        </button>
      </template>
      <button
        :disabled="tableCurrentPage === table.getPageCount()"
        @click="table.nextPage()"
      >
        <Icon name="lucide:chevron-right" class="text-gray-400" />
      </button>
    </div>
  </div>
</template>
