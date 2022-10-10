<template>
  <div class="graph-container">
    <p class="chart-title" v-show="background">{{ background.chart_title }}</p>
    <scatterjs
      ref="graph"
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
    <p class="chart-description" v-show="background">{{ background.description }}</p>
  </div>
</template>

<script>
import { Bar as barjs, Scatter as scatterjs, Line as linejs } from "vue-chartjs";
import Chart from 'chart.js/auto';  

import { Tooltip } from 'chart.js'

import "chartjs-adapter-date-fns";

import {
  getDates,
  processTableutData,
  parseDataUrl,
  escapeCode,
} from "../utils/DataProcessing";

import { colorPalette, colors } from "../utils/constants";

import StepMixin from '@/mixins/StepMixin.js'

import { defaultOptions, getDateValue, getClostestDate } from "../utils/chart"


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

export default {
  name: "BarChart",
  mixins: [StepMixin],
  components: {     
    barjs, 
    scatterjs,
    linejs
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
    if (process.client) {
      // Chart.register(zoomPlugin);
      await this.loadData();
      const dataIndex = this.step.order - this.background.stepstart;
      let data = this.dataList[0]
      console.log("this.dataList", this.dataList)
      if (this.dataList[dataIndex]) {
        data = this.dataList[dataIndex]
      }
      this.setData(data)
    }
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
          "https://raw.githubusercontent.com/mneunomne/edit_wars_database/main/export/data/"+
          //"https://cdn.jsdelivr.net/gh/mneunomne/edit_wars_database/export/data/" +
          name +
          ".json";
        await fetch(parseDataUrl(url))
          .then((response) => response.json())
          .then((fetchedData) => {
            if (!fetchedData) {
              console.error(url)
              console.error("MISSING DATA FOR STEP: " + this.currentStepIndex)
              return
            }
            this.dataList.push(fetchedData);
            console.log("loaded", this.dataList, name);
          });
      }
    },
    setData(fetchedData) {
      if (!fetchedData) {
        console.error("no barChart data for this step");
        return;
      }
      //var fetchedDatasets = [...fetchedData.datasets];
      var datasets = []
      
      console.log("fetchedData", fetchedData)
      fetchedData.datasets.forEach(narrative => {
        console.log("narrative", narrative)
        var data = narrative.data.sort(compare)
        datasets.push({
          ...narrative,
          //borderColor: "rgb(255, 0, 0)",
          type: "line",
          data: data,
          borderWidth: 1,
          tension: 0,
          borderColor: colors.chartColor,
          backgroundColor: "transparent",
          pointRadius: 0,
          events: narrative.events,
          headlines: narrative.headlines,
        })
      });
      
      
      var headlines = {
        label: "scatter",
        borderColor: colors.chartColor,
        borderWidth: 2,
        radius: 6,
        borderRadius: 4,
        backgroundColor: colors.chartColor,
        //type: 'scatter-chart',
        data: fetchedData.headlines.map((headline) => ({
          x: headline.date,
          y: getDateValue(headline.date, datasets[0].data),
          label: headline.text_en,
          source: headline.link ? (new URL(headline.link)).hostname : '',
          type: "headline"
        }))
      };

      var events = {
        label: "scatter",
        borderColor: colors.chartColor,
        pointStyle: 'triangle',
        rotation: 180,
        borderWidth: 2,
        radius: 5,
        borderRadius: 4,
        backgroundColor: colors.chartColor,
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

      this.currentChartData = {
        labels: fetchedData.labels,
        datasets: datasets,
      };
    },
  },
  watch: {
      step(step) {
        if (step.filterDate) {
          var closestDates = getClostestDate(step.filterDate.startDate, step.filterDate.endDate,  this.currentChartData)          
          this.$refs.graph.chart.zoomScale('x',  closestDates, 'default');
          this.$refs.graph.chart.update();
        } else if (this.$refs.graph.chart) {
          this.$refs.graph.chart.resetZoom();
          this.$refs.graph.chart.update();
        }
        if (process.client) {
        const dataIndex = step.order - this.background.stepstart;
        //console.lg("this.dataList", this.dataList)
        let data = this.dataList[0]
        if (this.dataList[dataIndex]) {
          data = this.dataList[dataIndex]
        }
        this.setData(data)
      }
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
  font-family: 'Space Mono'

.chart-title
  position: absolute
  top: 0px
  font-family: 'Space Mono'
  transform: translateY(-100%)
  text-align: center
  font-size: 18px
  color: black
</style>
