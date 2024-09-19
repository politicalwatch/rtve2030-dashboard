<template>
  <div class="w-full h-96" ref="chartWrapper">
    <ChartsFrequencyChart
      v-if="evoDataGrouped != null && availableHeight > 0"
      :dataset="evoDataGrouped"
      :hasActiveFilters="hasActiveFilters"
      :topicsStyles="STYLES.topics"
      :availableWidth="availableWidth"
      :availableHeight="availableHeight"
    />
  </div>
</template>

<script lang="ts" setup>
import { useElementSize } from "@vueuse/core";

import { rollup, sum } from "d3";
interface Props {
  evoData: StatsEvolutionStacked;
  hasActiveFilters: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  hasActiveFilters: false,
});

//*** set responsive width and  heights */
const chartWrapper = ref(null); // wrapper for the svg. Template reference
/* svg size */
const { width: availableWidth, height: availableHeight } =
  useElementSize(chartWrapper);

const daysBetweenInitAndEnd = computed(() => {
  const diffTime = Math.abs(
    props.evoData.endObj.getTime() - props.evoData.initObj.getTime()
  );
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

/* group data by week, month or not grouped
// return an object with the format:
// initDate:Obj,
endDate:Obj,
groupingBy:number,
groupedData: Array<{
date:string (this is the init date of the week, month or day),
total_duration:number,
tagged_duration:number,
query_duration:number,
label:string (this is the label of the week, month or day)
}>
*/
const evoDataGrouped = computed(() => {
  if (daysBetweenInitAndEnd.value < 100) {
    return {
      initObj: props.evoData.initObj,
      endObj: props.evoData.endObj,
      groupingBy: 1,
      groupedData: props.evoData.hoursPeriod.map((item, index) => ({
        date: item.dateObj,
        total_duration: item.total_duration,
        tagged_duration: item.tagged_duration,
        query_duration: item.query_duration,
        label: item.date,
        index: index,
        firstDay: item.dateObj,
        endDay: item.dateObj,
      })),
    };
  } else if (
    daysBetweenInitAndEnd.value >= 100 &&
    daysBetweenInitAndEnd.value < 1000
  ) {
    // console.log("grouping by week");
    // return data grouped by groups of 7 days starting on mondays ending on sundays between init and end date
    const initDayOfWeek = props.evoData.initObj.getDay();
    // in case the dataset doesn't start with a monday let's find the first monday before the init date
    const initDateMonday = new Date(props.evoData.initObj);
    initDateMonday.setDate(initDateMonday.getDate() - initDayOfWeek);
    // in case the dataset doesn't end with a sunday let's find the last sunday after the end date
    const endDateSunday = new Date(props.evoData.endObj);
    endDateSunday.setDate(
      endDateSunday.getDate() + (6 - endDateSunday.getDay())
    );

    // let's add a new property to the data called "weekIndex" that goes from 0 to the number of weeks between init and end date
    // let's also add a new property to the data called "weekYear"
    // this weekYear is the week of the year (e.g. 1, 2, 3, etc.) using the iso standard for weeks

    const newEvoData = props.evoData.hoursPeriod.map((row, index) => {
      return {
        dateObj: row.dateObj,
        query_duration: row.query_duration,
        total_duration: row.total_duration,
        tagged_duration: row.tagged_duration,
        index: Math.floor(
          (row.dateObj.getTime() - initDateMonday.getTime()) /
            (7 * 24 * 60 * 60 * 1000)
        ),
        labelindex: ISO8601_week_no(row.dateObj),
      };
    });
    // now let's group the data by labelindex and weekIndex using d3.rollup
    const groupedData = rollup(
      newEvoData,
      (values) => {
        return {
          total_duration: sum(values, (d) => d.total_duration),
          tagged_duration: sum(values, (d) => d.tagged_duration),
          query_duration: sum(values, (d) => d.query_duration),
          index: values[0].index,
          labelindex: values[0].labelindex,
          firstDay: values[0].dateObj,
          endDay: values[values.length - 1].dateObj,
        };
      },
      (d) => d.index
    );
    return {
      initObj: props.evoData.initObj,
      endObj: props.evoData.endObj,
      groupingBy: 7,
      groupedData: Array.from(groupedData.values()),
    };
  } else {
    // return data grouped by month
    const initDayOfMonth = props.evoData.initObj.getDate();
    // in case the dataset doesn't start in the first day of the month let's find the first day of the month before the init date
    const initDateFirstDayOfMonth = new Date(props.evoData.initObj);
    initDateFirstDayOfMonth.setDate(1);
    // in case the dataset doesn't end in the last day of the month let's find the last day of the month after the end date
    const endDateLastDayOfMonth = new Date(props.evoData.endObj);
    endDateLastDayOfMonth.setDate(
      new Date(props.evoData.endObj).getMonth() + 1
    );
    // let's add a new property to the data called "monthIndex" that goes from 0 to the number of months between init and end date
    // let's also add a new property to the data called "monthYear"
    // this monthYear is the month of the year (e.g. 1, 2, 3, etc.) using the iso standard for months
    const newEvoData = props.evoData.hoursPeriod.map((row, index) => {
      return {
        dateObj: row.dateObj,
        query_duration: row.query_duration,
        total_duration: row.total_duration,
        tagged_duration: row.tagged_duration,
        labelIndex: row.dateObj.getMonth(),
        index: Math.floor(
          (row.dateObj.getTime() - initDateFirstDayOfMonth.getTime()) /
            (30 * 24 * 60 * 60 * 1000)
        ),
      };
    });
    // now let's group the data by monthYear and index using d3.rollup
    const groupedData = rollup(
      newEvoData,
      (values) => {
        return {
          total_duration: sum(values, (d) => d.total_duration),
          tagged_duration: sum(values, (d) => d.tagged_duration),
          query_duration: sum(values, (d) => d.query_duration),
          index: values[0].index,
          labelIndex: values[0].labelIndex,
          firstDay: values[0].dateObj,
          endDay: values[values.length - 1].dateObj,
        };
      },
      (d) => d.index
    );
    return {
      initObj: initDateFirstDayOfMonth,
      endObj: endDateLastDayOfMonth,
      groupingBy: 30,
      groupedData: Array.from(groupedData.values()),
    };
  }
});

function ISO8601_week_no(dt: Date) {
  // Create a copy of the provided date object to avoid modifying the original
  var tdt = new Date(dt.valueOf());
  // Calculate the day number (0 for Sunday, 1 for Monday, ..., 6 for Saturday) and adjust it to have Monday as the first day of the week
  var dayn = (dt.getDay() + 6) % 7;
  // Adjust the copied date object to represent the Thursday of the current week
  tdt.setDate(tdt.getDate() - dayn + 3);
  // Store the value of the first Thursday of the year
  var firstThursday = tdt.valueOf();
  // Set the copied date object to January 1st of the current year
  tdt.setMonth(0, 1);
  // If January 1st is not a Thursday, find the date of the first Thursday of the year
  if (tdt.getDay() !== 4) {
    tdt.setMonth(0, 1 + ((4 - tdt.getDay() + 7) % 7));
  }
  // Calculate the ISO 8601 week number based on the difference between the value of the first Thursday and the current Thursday, divided by the number of milliseconds in a week
  return 1 + Math.ceil((firstThursday - tdt) / 604800000);
}
</script>

<style></style>
