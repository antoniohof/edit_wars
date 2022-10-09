<template>
  <div class="graph-container">
    <p class="chart-title" v-show="background">{{ background.chart_title }}</p>
    <client-only>
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
    </client-only>
    <p class="chart-description" v-show="background">{{ background.description }}</p>
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
  PointElement,
  CategoryScale,
  LineElement,
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
  PointElement,
  TimeScale,
  LineElement
);

import {
  getDates,
  processTableutData,
  parseDataUrl,
  escapeCode,
} from "../utils/DataProcessing";

import { colorPalette } from "../utils/constants";

import StepMixin from '@/mixins/StepMixin.js'

import { defaultOptions, getDateValue } from "../utils/chart"

/*
Tooltip.positioners.bottom = function(items) {
  const pos = Tooltip.positioners.average(items);
  // Happens when nothing is found
  if (pos === false) {
    return false;
  }
  const chart = this.chart;

  return {
    x: pos.x,
    y: chart.chartArea.bottom + 300,
    xAlign: 'center',
    yAlign: 'top',
  };
};
*/
export default {
  name: "BarChart",
  mixins: [StepMixin],
  components: {     
    Bar, 
    Scatter
},
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
        "max-width": `800px`
      },
      chartOptions: {},
      dataList: [],
    };
  },
  async mounted() {
    await this.loadData();
    const dataIndex = this.step.order - this.background.stepstart;
    let data = this.dataList[0]
    if (this.dataList[dataIndex]) {
      data = this.dataList[dataIndex]
    }
    this.setData(data)
  },
  methods: {
    async loadData() {
      this.dataList = [];
      this.chartOptions = defaultOptions;
      //this.chartOptions.plugins.title.text = this.background.chart_title
      let dataNames = [this.background.name]
      if (this.background.name.indexOf(',')) {
        dataNames = this.background.name.split(",");
      }
      for await (const name of dataNames) {
        let url =
          "https://cdn.jsdelivr.net/gh/mneunomne/edit_wars_database/export/data/" +
          name +
          ".json";
        await fetch(parseDataUrl(url))
          .then((response) => { 
            console.log('response', response)
            return response.ok ? response.json() : undefined 
          })
          .then((fetchedData) => {
            if (!fetchedData) {
              console.error("MISSING DATA FOR STEP: " + this.currentStepIndex)
              return
            }
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
      //console.log('data', fetchedData)
      var datasets = fetchedData.datasets;

      /*
      datasets = datasets.map(narrative => ({
        ...narrative,
        //borderColor: "rgb(255, 0, 0)",
        type: "line",
        data: narrative.data.sort(compare),
        borderWidth: 1,
        tension: 0.1,
        backgroundColor: "transparent",
        pointRadius: 0,
      }));
      */

      var headlines = {
        label: "scatter",
        borderColor: "blue",
        borderWidth: 2,
        radius: 5,
        borderRadius: 4,
        backgroundColor: "transparent",
        //type: 'scatter-chart',
        data: fetchedData.headlines.map((headline) => ({
          x: headline.date,
          y: getDateValue(headline.date,  datasets[0].data),
          label: headline.text_en,
          source: headline.link ? (new URL(headline.link)).hostname : '',
          type: "headline"
        }))
      };

      var events = {
        label: "scatter",
        borderColor: "red",
        pointStyle: 'triangle',
        borderWidth: 2,
        radius: 5,
        borderRadius: 4,
        backgroundColor: "red",
        data: fetchedData.events.map(event => ({
          x: event.date,
          y: 0,
          label: event.text,
          source: event.link ? (new URL(event.link)).hostname : '',
          type: "event"
        }))
      } 

      datasets = datasets.concat(headlines);
      datasets = datasets.concat(events);

      console.log("datasets", datasets)

      this.currentChartData = {
        labels: fetchedData.labels,
        datasets: datasets,
      };
    },
  },
  watch: {
    step(step) {
      const dataIndex = step.order - this.background.stepstart;
      let data = this.dataList[0]
      if (this.dataList[dataIndex]) {
        data = this.dataList[dataIndex]
      }
      this.setData(data)
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
  filter: drop-shadow(1px 1px 6px rgba(0, 0, 0, 0.3))
  @media only screen and (max-width: 480px)

.chart-description
  position: absolute
  bottom: -40px
  right: 0
  transform: translateY(100%)
  text-align: center
  font-size: 12px
  color: black

.chart-title
  position: absolute
  top: 15px
  transform: translateY(-100%)
  text-align: center
  font-size: 14px
  color: black
</style>
