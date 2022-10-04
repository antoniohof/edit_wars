<template>
  <div class="graph-container">
    <Scatter
      v-if="currentChartData"
      :chart-options="chartOptions"
      :chart-data="currentChartData"
      :chart-id="chartId"
      :dataset-id-key="datasetIdKey"
      :css-classes="cssClasses"
      :styles="styles"
      :width="width"
      :height="height"
    />
  </div>
</template>

<script>
import { Bar, Scatter } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  TimeScale
);

import {
  getDates,
  processTableutData,
  parseDataUrl,
  escapeCode,
} from "../utils/DataProcessing";

import { colorPalette } from "../utils/constants";

import StepMixin from "@/mixins/StepMixin.js";

import { renderTooltip } from "../utils/tooltips"

const defaultOptions = {
  responsive: true,
  borderColor: "black",
  backgroundColor: "black",
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      displayColors: false,
      //external: renderTooltip,
      callbacks: {
        label: (context) => "",
        title: (context) => "",
        afterBody: (context) => {
          const maxCharPerLine = 50
          let str = context[0].raw.label ? context[0].raw.label : context[1].raw.label
          if (str == undefined) return ""
          var words = str.split(" ")
          var lines = [""]
          var i = 0
          words.forEach(w => {
            console.log(lines[i].length, w.length)
            if (lines[i].length + w.length > maxCharPerLine) {
              i++
              lines[i] = ""
            } else {
              lines[i] += " " + w
            }
          })
          return lines
        }
      },
      labelTextColor: "white",
      bodyFont: {
        size: "12",
        family: "Golos-Text-Regular",
      },
      backgroundColor: 'rgb(0, 0, 0)'
    },
    subtitle: {
      display: false,
    },
    title: {
      display: true,
      text: "Mentions of the word 'Nazi'",
      color: "black",
      font: {
        size: "18",
        weight: "normal",
        family: "Golos-Text-Regular",
      },
    },
  },
  scales: {
    x: {
      type: "time",
      time: {
        unit: "week",
        //tooltipFormat: "MMM YYYY",
        displayFormats: {
          week: "MMM dd",
        },
      },
      grid: {
        display: false,
        drawBorder: true,
        drawOnChartArea: false,
        drawTicks: false,
      },
    },
    y: {
      grid: {
        display: false,
        drawBorder: true,
        drawOnChartArea: false,
        drawTicks: false,
      },
      ticks: {
        // Include a dollar sign in the ticks
        callback: function (value, index, ticks) {
          return value;
        },
      },
    },
  },
};

export default {
  name: "BarChart",
  mixins: [StepMixin],
  components: { Bar, Scatter },
  props: {
    background: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      currentProcessedData: null,
      currentChartData: null,
      chartId: "bar-chart",
      datasetIdKey: "label",
      width: 800,
      height: 800,
      cssClasses: "",
      styles: {
        width: `85%`,
        "max-width": `800px`,
        //height: '800px',
      },
      chartOptions: {},
      dataList: [],
    };
  },
  async mounted() {
    console.log("this.background", this.background);
    console.log("this.currStepIndex", this.currentStepIndex);
    await this.loadData();
    const dataIndex = this.step.order - this.background.stepstart;
    console.log("dataIndex", dataIndex);
    console.log("this.dataList", this.dataList);
    this.setData(this.dataList[dataIndex]);
  },
  methods: {
    async loadData() {
      this.dataList = [];
      /*
      this.chartOptions = JSON.parse(escapeCode(this.background.chartoptions))
      this.chartOptions = {...defaultOptions, ...this.chartOptions}
      delete this.chartOptions.backgroundColor
      delete this.chartOptions.borderColor
      */
      this.chartOptions = defaultOptions;
      const dataNames = this.background.name.split(",");
      for await (const name of dataNames) {
        let url =
          "https://cdn.jsdelivr.net/gh/mneunomne/edit_wars_database/export/" +
          name +
          ".json";
        await fetch(parseDataUrl(url))
          .then((response) => response.json())
          .then((fetchedData) => {
            this.dataList.push(fetchedData);
            console.log("loaded", this.dataList);
          });
      }
    },
    setData(fetchedData) {
      if (!fetchedData) {
        console.error("no barChart data for this step");
        return;
      }

      var datasets = fetchedData.datasets;

      datasets[0].type = "line";

      datasets[0].data = datasets[0].data.sort(compare);
      datasets[0] = {
        ...datasets[0],
        borderColor: "rgb(255, 0, 0)",
        borderWidth: 2,
        backgroundColor: "transparent",
        pointRadius: 0,
      };

      var scattered = {
        label: "scatter",
        borderColor: "blue",
        borderWidth: 2,
        radius: 4,
        borderRadius: 4,
        backgroundColor: "transparent",
        //type: 'scatter-chart',
        data: datasets[0].data.map((d) => ({
          x: d.x,
          y: d.y,
          label: "this is an illustrative headline this is an illustrative headline 20",
        })).filter((d, i) => {
          return i % 2 == 0
        }),
      };
      console.log("scattered", scattered);

      datasets = datasets.concat(scattered);

      console.log("fetchedData", fetchedData);
      this.currentChartData = {
        labels: fetchedData.labels,
        datasets: datasets,
      };
    },
  },
  watch: {
    step(step) {
      const dataIndex = step.order - this.background.stepstart;
      console.log("this.background.stepstart ", this.background.stepstart);
      console.log("dataIndex", dataIndex);
      this.setData(this.dataList[dataIndex]);
    },
  },
};

function compare(a, b) {
  if (a.x < b.x) {
    return -1;
  }
  if (a.x > b.x) {
    return 1;
  }
  return 0;
}
</script>

<style lang="sass" scoped>
.graph-container
  width: 100%
  width: -moz-available
  width: -webkit-fill-available
  width: fill-available
</style>