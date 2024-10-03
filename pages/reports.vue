<template>
  <div class="dashboard-content mt-6">
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
          class="flex items-center font-mono text-sm hover:text-gray-600"
        >
          <LayoutDashboard :size="16" class="mr-2" /> ir al dashboard
        </NuxtLink>
      </div>
    </header>
    <section class="border-b border-gray-500">
      <div class="container py-4">
        <!--
          <h1 class="text-sm uppercase font-bold font-mono">
            vista global y selección de periodo de estudio
          </h1>
        -->
        <div class="grid grid-cols-5 gap-8 my-4">
          <div class="border-t border-black">
            <DateSelector />
          </div>
          <div class="border-t pt-4 border-black">
            <p class="font-mono text-xs mb-2">periodo de estudio:</p>
            <PeriodSelector />
          </div>
          <div class="border-t pt-4 border-black">
            <p class="font-mono text-xs mb-2">tipo de informe:</p>
            <ReportTypeSelector />
          </div>
          <div
            v-if="['aenor'].includes(reportType)"
            class="border-t pt-4 border-black"
          >
            <p class="font-mono text-xs mb-2">año fin comparativa:</p>
            <YearCompareSelector />
          </div>
        </div>
      </div>
    </section>
    <div v-if="reportDataStatus === 'pending'">
      <div class="container py-4 flex flex-col justify-center items-center">
        <h2 class="text-xl uppercase font-bold font-mono my-4">
          Generando el informe
        </h2>
        <Spinner :size="64" />
      </div>
    </div>
    <div v-else-if="reportDataStatus === 'success'">
      <section>
        <div class="container py-4">
          <div
            class="mt-8 mb-4"
            v-if="
              ['einf', 'sprsc', 'sostenibilidad', 'sepi'].includes(reportType)
            "
          >
            <h2 class="text-sm uppercase font-bold font-mono">
              Porcentaje de acierto del análisis
            </h2>
            <p>{{ reportData.accuracy }}</p>
          </div>
          <div class="mt-8 mb-4">
            <h2 class="text-sm uppercase font-bold font-mono">
              Número de programas incluidos en en análisis
            </h2>
            <p>{{ reportData.programs_count }} programas</p>
          </div>
          <div class="mt-8 mb-4">
            <h2 class="text-sm uppercase font-bold font-mono">
              Número de horas analizadas
            </h2>
            <p>{{ msToHours(reportData.total_duration).toFixed(0) }} horas</p>
          </div>
          <div class="mt-8 mb-4">
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
            class="mt-8 mb-4"
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
                <strong>{{ channel }}:</strong>
                {{ programs.sort().join(", ") }}.
              </li>
            </ul>
          </div>
          <div class="mt-8 mb-4" v-if="['einf', 'sepi'].includes(reportType)">
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
          <div class="mt-10 mb-4" v-if="['aenor'].includes(reportType)">
            <h2 class="mb-4 text-sm uppercase font-bold font-mono">
              Número de horas dedicadas a cada ODS y su % respecto del total
            </h2>
            <table
              id="table-ods"
              class="min-w-full bg-white border border-gray-200"
            >
              <thead>
                <tr class="bg-gray-100">
                  <th class="px-4 py-2 border-b">ODS</th>
                  <th class="px-4 py-2 border-b">Horas</th>
                  <th class="px-4 py-2 border-b">%</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(data, sdg) in reportData.sdg_summary"
                  :key="sdg"
                  class="hover:bg-gray-50"
                >
                  <td class="px-4 py-2 border-b">{{ sdg }}</td>
                  <td class="px-4 py-2 border-b">
                    {{
                      msToHours(data.duration).toLocaleString("es-ES", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    }}
                  </td>
                  <td class="px-4 py-2 border-b">
                    {{
                      (
                        (data.duration / reportData.total_duration) *
                        100
                      ).toLocaleString("es-ES", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    }}
                    %
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            class="mt-10 mb-4"
            v-if="
              reportSdgCompareStatus === 'success' &&
              ['aenor'].includes(reportType)
            "
          >
            <h2 class="mb-4 text-sm uppercase font-bold font-mono">
              Evolución del porcentaje del tiempo dedicado a cada ODS en dos
              años consecutivos
            </h2>
            <table
              id="table-ods-compare"
              class="min-w-full bg-white border border-gray-200"
            >
              <thead>
                <tr class="bg-gray-100">
                  <th class="px-4 py-2 border-b">ODS</th>
                  <th class="px-4 py-2 border-b">
                    {{ Object.keys(reportSdgCompareData)[0] }}
                  </th>
                  <th class="px-4 py-2 border-b">
                    {{ Object.keys(reportSdgCompareData)[1] }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(data, sdg) in reportSdgCompareData[yearCompare]
                    .sdg_summary"
                  :key="sdg"
                  class="hover:bg-gray-50"
                >
                  <td class="px-4 py-2 border-b">{{ sdg }}</td>
                  <td class="px-4 py-2 border-b">
                    {{
                      (
                        (reportSdgCompareData[Number(yearCompare) - 1][
                          "sdg_summary"
                        ][sdg].duration /
                          reportSdgCompareData[Number(yearCompare) - 1]
                            .total_duration) *
                        100
                      ).toLocaleString("es-ES", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    }}
                    %
                  </td>
                  <td class="px-4 py-2 border-b">
                    {{
                      (
                        (data.duration /
                          reportSdgCompareData[yearCompare].total_duration) *
                        100
                      ).toLocaleString("es-ES", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    }}
                    %
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            class="mb-4"
            v-if="
              false &&
              ['einf', 'sprsc', 'sostenibilidad', 'aenor'].includes(reportType)
            "
          >
            <h2 class="text-sm uppercase font-bold font-mono">
              Gráfica % dedicado a cada ODS
            </h2>
          </div>
          <div
            class="mb-4"
            v-if="
              false && ['einf', 'sostenibilidad', 'aenor'].includes(reportType)
            "
          >
            <h2 class="text-sm uppercase font-bold font-mono">
              Nube de palabras con principales temáticas
            </h2>
          </div>
        </div>
      </section>
    </div>
    <div v-if="reportDataStatus === 'error'">
      <section class="container py-4">
        <h2 class="text-sm uppercase font-bold font-mono">
          Error cargando los datos
        </h2>
        <pre class="whitespace-pre-wrap">{{ reportDataError }}</pre>
      </section>
    </div>
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
const filtersStore = useFiltersStore();
const apiRepo = dashboardApiRepo($api);

const { timespan, reportType, yearCompare } = storeToRefs(filtersStore);

const {
  data: reportData,
  status: reportDataStatus,
  error: reportDataError,
} = await useLazyAsyncData(
  `reports-${jsDatetoApiString(timespan.value[0])}-${jsDatetoApiString(
    timespan.value[1]
  )}`,
  () =>
    apiRepo.getReportData(
      jsDatetoApiString(timespan.value[0]),
      jsDatetoApiString(timespan.value[1])
    ),
  {
    immediate: true,
    watch: [timespan],
  }
);

const {
  data: reportSdgCompareData,
  status: reportSdgCompareStatus,
  error: reportSdgCompareError,
} = await useLazyAsyncData(
  `reports-compare-${yearCompare.value}`,
  () => apiRepo.getReportSdgCompare(yearCompare.value),
  {
    immediate: true,
    watch: [yearCompare],
  }
);

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
