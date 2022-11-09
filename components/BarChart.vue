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
import { getIsMobile } from '@/utils/index.js'

import "chartjs-adapter-date-fns";

import { parseDataUrl } from "../utils/DataProcessing";
import { colors } from "../utils/constants";
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
      isMobile: false,
      currentProcessedData: null,
      currentChartData: null,
      chartId: "bar-chart",
      datasetIdKey: "label",
      width: 800,
      height: 800,
      cssClasses: "",
      styles: {
        "width": `85%`,
        "max-width": `800px`,
        "height": getIsMobile() ? '70vw' : 'auto'
      },
      chartOptions: {},
      dataList: [],
    };
  },
  async mounted() {
    this.isMobile = getIsMobile()
    if (process.client) {
      // Chart.register(zoomPlugin);
      await this.loadData();
      const dataIndex = this.step.order - this.background.stepstart;
      let data = this.dataList[0]
      if (this.dataList[dataIndex]) {
        data = this.dataList[dataIndex]
      }
      this.setData(data)
    }
  },
  methods: {
    async loadData() {
      this.dataList = [];
      this.chartOptions = {...defaultOptions, maintainAspectRatio: !this.isMobile};
      let dataNames = [this.background.name]
      if (this.background.name.indexOf(',')) {
        dataNames = this.background.name.split(",");
      }
      for await (const name of dataNames) {
        let url =
          "https://raw.githubusercontent.com/editwarsteam/edit_wars_api/main/export/data/"+
          //"https://raw.githubusercontent.com/mneunomne/edit_wars_database/main/export/data/"+
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
          });
      }
    },
    setData(fetchedData) {
      if (!fetchedData) {
        console.error("no barChart data for this step");
        return;
      }
      var datasets = []      
      fetchedData.datasets.forEach(narrative => {
        var data = narrative.data.sort(compare)
        datasets.push({
          ...narrative,
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
        radius: this.isMobile ? 3 : 6,
        borderRadius: this.isMobile ? 2 : 4,
        backgroundColor: colors.chartColor,
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
        radius: this.isMobile ? 3 : 5,
        // borderRadius: this.isMobile ? 2 : 4,
        backgroundColor: colors.chartColor,
        data: fetchedData.events.map(event => ({
          x: event.date,
          y: 0,
          label: event.text,
          source: event.link ? (new URL(event.link)).hostname : '',
          type: "event"
        }))
      } 
  /*
      var test = {
        radius: 2,
        label: "scatter",
        data: datasets[0].data.map(d => {
          x: d.x,
          y: 0,
        })
      }
*/    

      datasets = datasets.concat(headlines);
      datasets = datasets.concat(events);

      this.currentChartData = {
        labels: fetchedData.labels,
        datasets: datasets,
      };

      if (this.step.filterDate) {
        var closestDates = getClostestDate(this.step.filterDate.startDate, this.step.filterDate.endDate, this.currentChartData)          
        console.log("this.step.filterDate", this.step.filterDate.startDate, this.step.filterDate.endDate, this.currentChartData.labels.length)
        console.log("closestDates", closestDates)
        this.$nextTick(() => {
            this.$refs.graph.chart.zoomScale('x',  closestDates, 'default');
            this.$refs.graph.chart.update();
        })
      } 
    },
  },
  watch: {
      step(step) {
        if (process.client) {
          if (this?.$refs?.graph?.chart) {
            if (step.filterDate) {
              var closestDates = getClostestDate(step.filterDate.startDate, step.filterDate.endDate, this.currentChartData)          
              this.$refs.graph.chart.zoomScale('x',  closestDates, 'default');
              this.$refs.graph.chart.update();
            } else if (this.$refs.graph.chart) {
              this.$refs.graph.chart.resetZoom();
              this.$refs.graph.chart.update();
            }
          }
        const dataIndex = step.order - this.background.stepstart;
        //console.lg("this.dataList", this.dataList)
        let data = this.dataList[0]
        if (this.dataList[dataIndex]) {
          data = this.dataList[dataIndex]
        }
        this.setData(data)
      }
    }
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
  display: flex
  flex-direction: column
  width: -moz-available
  justify-self: center
  @media only screen and (max-width: 480px)

.chart-description
  text-align: left
  font-size: 10px
  width: 83%  !important
  max-width: 83% !important
  margin-top: 20px
  font-size: 12px
  color: black
  font-family: 'Space Mono'
  @media only screen and (max-width: 480px)
    font-size: 9px

.chart-title
  font-family: 'Space Mono'
  text-align: center
  margin-bottom: -25px !important
  font-size: 16px
  width: 83%
  color: black
  @media only screen and (max-width: 480px)
    font-size: 12px
</style>
