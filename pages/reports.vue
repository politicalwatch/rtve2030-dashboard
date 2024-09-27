<template>
  <div class="dashboard-content">
    <header class="container flex justify-between bg-white mb-2">
      <div class="flex justify-start items-center gap-16">
        <img src="/img/logo.svg" alt="logo" class="h-16" />
        <div class="flex gap-4">
          <img src="/img/tve.svg" alt="logo" class="h-6" />
          <img src="/img/rne.svg" alt="logo" class="h-6" />
        </div>
      </div>
      <div class="flex items-center">
        <NuxtLink
          to="/"
          class="flex items-center font-bold hover:text-gray-600 uppercase"
        >
          <LayoutDashboard :size="16" class="mr-2" /> Ir al dashboard
        </NuxtLink>
      </div>
    </header>
    <section class="bg-gray-50 border-b border-gray-500">
      <div class="container py-4">
        <h1 class="text-sm uppercase font-bold font-mono">
          vista global y selección de periodo de estudio
        </h1>
        <div class="grid grid-cols-5 gap-8 items-center my-4">
          <DateSelector />
          <div>
            <PeriodSelector />
          </div>
          <div>
            <ReportTypeSelector />
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="container py-4">
        <div
          class="mb-4"
          v-if="
            ['einf', 'sprsc', 'sostenibilidad', 'sepi'].includes(reportType)
          "
        >
          <h2 class="text-sm uppercase font-bold font-mono">
            Porcentaje de acierto del análisis
          </h2>
          <p>{{ reportData.accuracy }}</p>
        </div>
        <div class="mb-4">
          <h2 class="text-sm uppercase font-bold font-mono">
            Número de programas incluidos en en análisis
          </h2>
          <p>{{ reportData.programs_count }} programas</p>
        </div>
        <div class="mb-4">
          <h2 class="text-sm uppercase font-bold font-mono">
            Número de horas analizadas
          </h2>
          <p>{{ msToHours(reportData.total_duration).toFixed(0) }} horas</p>
        </div>
        <div class="mb-4">
          <h2 class="text-sm uppercase font-bold font-mono">
            Porcentaje de horas dedicadas a la Agenda 2030
          </h2>
          <p>
            {{
              (
                (reportData.tagged_duration / reportData.total_duration) *
                100
              ).toFixed(2)
            }}
            %
          </p>
        </div>
        <div
          class="mb-4"
          v-if="['einf', 'sprsc', 'sostenibilidad'].includes(reportType)"
        >
          <h2 class="text-sm uppercase font-bold font-mono">
            Nombre de los programas (por canales) que se analizan
          </h2>
          <ul>
            <li
              v-for="(programs, channel) in reportData.programs_per_channel"
              :key="channel"
            >
              <strong>{{ channel }}:</strong> {{ programs.sort().join(", ") }}.
            </li>
          </ul>
        </div>
        <div class="mb-4" v-if="['einf', 'sepi'].includes(reportType)">
          <h2 class="text-sm uppercase font-bold font-mono">
            Número de horas dedicadas a cada ODS
          </h2>
          <ul>
            <li v-for="(data, sdg) in reportData.sdg_summary" :key="sdg">
              <strong>{{ sdg }}:</strong>
              {{ msToHours(data.duration).toFixed(2) }} horas.
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { LayoutDashboard } from "lucide-vue-next";
// import { Button } from "@/components/ui/button";
// import PizZip from "pizzip";
// import PizZipUtils from "pizzip/utils/index.js";
// import Docxtemplater from "docxtemplater";
// import { saveAs } from "file-saver";

definePageMeta({
  middleware: ["auth-user"],
});

const { $api } = useNuxtApp();
const filters = useFiltersStore();
const apiRepo = dashboardApiRepo($api);

const { timespan, reportType } = storeToRefs(filters);

const { data: reportData } = await useAsyncData(
  `reports-${reportType}-${jsDatetoApiString(
    timespan.value[0]
  )}-${jsDatetoApiString(timespan.value[1])}`,
  () =>
    apiRepo.getReportData(
      reportType.value,
      jsDatetoApiString(timespan.value[0]),
      jsDatetoApiString(timespan.value[1])
    ),
  {
    immediate: true,
    watch: [timespan, reportType],
  }
);

/* loading  */
const loading = ref(false);
useNuxtApp().hook("page:start", () => {
  loading.value = true;
});

useNuxtApp().hook("page:finish", () => {
  loading.value = false;
});

// const loadFile = (
//   url: string,
//   callback: (error: Error, data: string) => void
// ) => {
//   PizZipUtils.getBinaryContent(url, callback);
// };

// const downloadReport = () => {
//   loadFile("/templates/einf-report-template.docx", (error, content) => {
//     if (error) {
//       console.error("Error loading file:", error);
//       return;
//     }

//     const zip = new PizZip(content);
//     const doc = new Docxtemplater(zip, {
//       paragraphLoop: true,
//       linebreaks: true,
//     });

//     const reportContent = {
//       programs_count: reportData.value.programs_count,
//       total_duration: reportData.value.total_duration,
//       tagged_duration: reportData.value.tagged_duration,
//       tagged_percentage:
//         (
//           (reportData.value.tagged_duration / reportData.value.total_duration) *
//           100
//         ).toFixed(2) + "%",
//       programs_per_channel: reportData.value.programs_per_channel,
//       programs_la1: reportData.value["La 1"],
//     };

//     doc.setData(reportContent);

//     try {
//       doc.render();
//     } catch (error) {
//       console.error("Error rendering document:", error);
//       return;
//     }

//     const out = doc.getZip().generate({
//       type: "blob",
//       mimeType:
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     });

//     saveAs(
//       out,
//       `rtve-report-${reportType.value}-${jsDatetoApiString(
//         timespan.value[0]
//       )}-${jsDatetoApiString(timespan.value[1])}.docx`
//     );
//   });
// };
</script>

<style></style>
