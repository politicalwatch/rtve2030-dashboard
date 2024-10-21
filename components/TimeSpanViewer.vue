<template>
    <div class="w-full">
        <svg :width="availableWidth" height="49">
            <line x1="0" :x2="width" y1="0" y2="0" stroke="#efefef" />
            <line x1="0" :x2="width" y1="16" y2="16" stroke="#efefef" />
            <line x1="0" :x2="width" y1="32" y2="32" stroke="#efefef" />
            <line x1="0" :x2="width" y1="48" y2="48" stroke="#efefef"/>

            <!-- days -->
            <g v-if="ddToDispaly.length >0">
                
                <line
                    v-for="(dd) in ddToDispaly"
                    :x1="xTimeScale(dd)"
                    :x2="xTimeScale(dd)"
                    y1="0"
                    y2="16"
                    :stroke="dd.getDay() == 1 && dataset.groupingBy == 1 ? '#000' : '#efefef'"
                />

                <g v-if="ddToDispaly.length < availableWidth/24 &&  dataset.groupingBy < 30">
                    <text
                    v-for="(dd) in ddToDispaly"
                    :x="xTimeScale(dd)"
                    y="0"
                    text-anchor="start"
                    dx="0.5em"
                    dy="1em"
                    class="font-mono text-xs"
                > {{ dd.getUTCDate() }} </text>
                </g>
                
            </g>


            <!-- mm -->
             <g v-if="mmToDisplay.length >0">

                <line
                    v-for="(mm) in mmToDisplay"
                    :x1="xTimeScale(mm)"
                    :x2="xTimeScale(mm)"
                    y1="16"
                    y2="32"
                    :stroke="mm.getMonth() == 0 || mmToDisplay.length < 18 ? '#000' : '#ccc' "
                />

                <g v-if="mmToDisplay.length < availableWidth / 32">
                <text
                v-for="(mm) in mmToDisplay"
                :x="xTimeScale(mm) > 0 ? xTimeScale(mm) : 0"
                y="16"
                text-anchor="start"
                dx="0.5em"
                dy="1em"
                class="font-mono text-xs"
             > {{ mm.toLocaleString('es-ES', { month: 'short' }) }} </text>
            </g>

             </g>

            <!-- YYYY v lines -->
             <line
                v-for="(yy) in yyToDispay"
                :x1="xTimeScale(new Date(yy,0,1))"
                :x2="xTimeScale(new Date(yy,0,1))"
                y1="32"
                y2="48"
                stroke="#000"
             />

            <!-- YYYY txt -->
             <text
                v-for="(yy) in yyToDispay"
                :x="xTimeScale(new Date(yy,0,1)) > 0 ? xTimeScale(new Date(yy,0,1)) : 0"
                y="32"
                text-anchor="start"
                dx="0.5em"
                dy="1em"
                class="font-mono text-xs"
             > {{ yy }} </text>


        </svg>

       
    </div>
</template>

<script setup>
    import {
        scaleBand,
        timeFormat,
        timeWeek,
        timeMonth,
        scaleLinear,
        scaleTime,
    } from "d3";

    const props = defineProps({
        availableWidth: {
            type: Number,
            default: 800,
        },
        dataset: {
            type: Object,
            default: () => ({
            initObj: new Date(),
            endObj: new Date(),
            groupedData: [],
            }),
        },
    })

    const margin = { top: 30, right: 60, bottom: 40, left: 0 };
    const width = computed(() => props.availableWidth - margin.left - margin.right );
    // xScale is a band scale with the weeks as domain
    const xScale = computed(() =>
    scaleBand()
        .domain(props.dataset.groupedData.map((d) => d.index))
        .range([0, width.value])
        .padding(0)
    );
    const barWidth = computed(() => xScale.value.bandwidth());

    const lastDay = computed(()=> {
        const day = 60 * 60 * 24 * 1000;
        const dday = props.dataset.groupedData[props.dataset.groupedData.length -1].endDay
        return dday.getTime() + day;
        // return props.dataset.groupedData[props.dataset.groupedData.length -1].endDay;
    })

    const firstDay = computed(()=> {
        return props.dataset.groupedData[0].firstDay;
    })

    // d3.scaleTime([new Date(2000, 0, 1), new Date(2000, 0, 2)], [0, 960]);
    const xTimeScale = computed(()=> {
        return scaleTime([firstDay.value, lastDay.value], [0, width.value]);
    })

    const yyToDispay = computed(()=> {
        console.log("dataset ..........")
        console.log(props.dataset)
        // return array of YYYY
        const yfrom = new Date(props.dataset.initObj).getFullYear();
        const yto = new Date(props.dataset.endObj).getFullYear();
        const length = (yto - yfrom) + 1;
        const arr = Array.from({ length }, (_, i) => yfrom + i);
        return(arr)
    })

    const mmToDisplay = computed(()=> {
        let start = new Date(props.dataset.initObj);
        start.setDate(1);
        // start.setUTCHours(12)
        const end = new Date(props.dataset.endObj).setHours(12);
        const dates = [];
        
        while (start <= end) {
            dates.push(new Date(start))
             // progress the start date by one month
            const displayMonth = start.getMonth() + 1;
            start = new Date(start.setMonth(displayMonth));
        }
        return(dates)
        
    })

    const ddToDispaly = computed(()=> {
        let dates = []
        // let start = new Date(props.dataset.initObj);
        // const end = new Date(props.dataset.endObj).setUTCHours(12);

        if(props.dataset.groupingBy == 1){
            
             dates= props.dataset.groupedData.map((e)=> e.date)

            /*
            while (start <= end) {
                const displayDay = start.getUTCDay() + 1;
                dates.push(start)
                // progress the start date by one month
                start = new Date(start.setUTCDate(displayDay));
            }
                */
        } else {
            // console.log("grouped data ..........")
            // console.log(props.dataset.groupedData.map((e)=>e.firstDay))
            dates = props.dataset.groupedData.map((e)=>e.firstDay);
        }
        // dates= props.dataset.groupedData.map((e)=> e.date)

        return dates;
    })

    onMounted(() => {
         // console.log("dataset ..........")
         // console.log(props.dataset)
        // console.log("mm to display ..........")
        // console.log(mmToDisplay.value)
    });

</script>