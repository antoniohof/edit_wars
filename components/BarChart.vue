<template>
  <div class="graph-container">
    <p
      class="chart-title"
      v-show="!isLoading && background"
      v-html="background.chart_title"
    ></p>
    <transition name="fade">
      <scatterjs
        class="scatterjs"
        ref="graph"
        v-show="!isLoading"
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
    </transition>
    <div v-if="isLoading" class="loading">
      <v-progress-circular indeterminate color="black"></v-progress-circular>
    </div>
    <!--
    <p v-if="!isLoading && !isMobile" class="chart-description" v-show="background" v-html="background.description"></p>
    -->
  </div>
</template>

<script>
import {
  Bar as barjs,
  Scatter as scatterjs,
  Line as linejs,
} from "vue-chartjs";
import Chart from "chart.js/auto";
import { Tooltip } from "chart.js";
import { getIsMobile } from "@/utils/index.js";

import "chartjs-adapter-date-fns";

import { parseDataUrl } from "../utils/DataProcessing";
import { colors, graph_colors } from "../utils/constants";
import StepMixin from "@/mixins/StepMixin.js";
import { defaultOptions, getDateValue, getClostestDate } from "../utils/chart";

Tooltip.positioners.bottom = function (items) {
  const pos = Tooltip.positioners.average(items);
  // Happens when nothing is found
  if (pos === false) {
    return false;
  }
  const chart = this.chart;
  return {
    x: pos.x,
    y: chart.chartArea.bottom + 300,
    xAlign: "center",
    yAlign: "top",
  };
};

export default {
  name: "BarChart",
  mixins: [StepMixin],
  components: {
    barjs,
    scatterjs,
    linejs,
  },
  props: {
    background: {
      type: Object,
      required: true,
    },
  },
  beforeMount() {},
  data() {
    return {
      isLoading: false,
      isMobile: false,
      currentProcessedData: null,
      currentChartData: null,
      chartId: "bar-chart",
      datasetIdKey: "label",
      width: 1000,
      height: 800,
      cssClasses: "",
      styles: {
        width: `100%`,
        height: getIsMobile() ? "50vh" : "auto",
      },
      chartOptions: {},
      dataList: [],
      loadedStep: null,
    };
  },
  async mounted() {
    if (!this.step) {
      return;
    }
    this.isLoading = true;
    if (process.client) {
      this.isMobile = getIsMobile();
      // Chart.register(zoomPlugin);
      await this.loadData();
      const dataIndex = this.step.order - this.background.stepstart;
      let data = this.dataList[0];
      if (this.dataList[dataIndex]) {
        data = this.dataList[dataIndex];
      }
      this.setData(data);
      this.isLoading = false;
    }
  },
  methods: {
    async loadData() {
      this.dataList = [];
      this.chartOptions = {
        ...defaultOptions,
        maintainAspectRatio: !this.isMobile,
        //animation: !this.isMobile,
        // spanGaps: true
      };
      let dataNames = [this.background.name];
      if (this.background.name.indexOf(",")) {
        dataNames = this.background.name.split(",");
      }
      for await (const name of dataNames) {
        let url =
          "https://raw.githubusercontent.com/editwarsteam/edit_wars_api/main/export/data/" +
          //"https://raw.githubusercontent.com/mneunomne/edit_wars_database/main/export/data/"+
          //"https://cdn.jsdelivr.net/gh/mneunomne/edit_wars_database/export/data/" +
          name +
          ".json";
        await fetch(parseDataUrl(url), { cache: "force-cache" })
          .then((response) => response.json())
          .then((fetchedData) => {
            if (!fetchedData) {
              console.error(url);
              console.error("MISSING DATA FOR STEP: " + this.currentStepIndex);
              return;
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
      var datasets = [];
      const colors =
        graph_colors["graph_colors_" + fetchedData.datasets.length];
      fetchedData.datasets.forEach((narrative, index) => {
        var data = narrative.data.sort(compare);
        datasets.push({
          ...narrative,
          type: isChartWeekly(data) ? "line" : "bar",
          pointStyle: isChartWeekly(data) ? "line" : "rect",
          data: data,
          borderWidth: 1.1,
          order: 99,
          tension: 0,
          borderColor: isChartWeekly(data) ? colors[index] : "#BDCF32",
          backgroundColor: isChartWeekly(data) ? "transparent" : "#BDCF32",
          pointRadius: 0,
          events: narrative.events,
          headlines: narrative.headlines,
        });
      });
      if (!this.isMobile) {
        var headlines = {
          label: "headlines",
          borderColor: "#27AEEF",
          borderWidth: 2,
          order: 1,
          radius: this.isMobile ? 3 : 4,
          borderRadius: this.isMobile ? 2 : 4,
          backgroundColor: "#27AEEF",
          data: fetchedData.headlines.map((headline) => ({
            x: headline.date,
            y: getDateValue(headline.date, datasets[0].data),
            label: headline.text_en,
            source: headline.link ? new URL(headline.link).hostname : "",
            type: "headline",
          })),
        };

        var events = {
          label: "events",
          borderColor: "#A9A9A9", //colors.chartColor,
          pointStyle: "triangle",
          rotation: 180,
          borderWidth: 2,
          order: 2,
          radius: this.isMobile ? 3 : 5,
          // borderRadius: this.isMobile ? 2 : 4,
          backgroundColor: "#A9A9A9",
          data: fetchedData.events.map((event) => ({
            x: event.date,
            y: 0,
            label: event.text,
            source: event.link ? new URL(event.link).hostname : "",
            type: "event",
          })),
        };

        datasets = datasets.concat(headlines);
        datasets = datasets.concat(events);
      }

      var options = {};
      if (fetchedData.datasets.length > 1) {
        options;
      }

      this.chartOptions = { ...this.chartOptions, options };
      this.currentChartData = {
        labels: fetchedData.labels,
        datasets: datasets,
      };

      if (this.step.filterDate && this.$refs.graph) {
        console.log("this.step.filterDate", this.step)

        var closestDates = getClostestDate(
          this.step.filterDate.startDate,
          this.step.filterDate.endDate,
          this.currentChartData
        );
        this.$nextTick(() => {
          this.$refs?.graph?.chart.zoomScale("x", closestDates, "default");
          this.$refs?.graph?.chart.update();
        });
      }
    },
  },
  watch: {
    async step(step) {
      if (!this.loadedStep) {
        this.loadedStep = true;
        if (!this.step) {
          console.error("no step for bar chart!");
          return;
        }
        this.isLoading = true;
        if (process.client) {
          this.isMobile = getIsMobile();
          // Chart.register(zoomPlugin);
          await this.loadData();
          const dataIndex = this.step.order - this.background.stepstart;
          let data = this.dataList[0];
          if (this.dataList[dataIndex]) {
            data = this.dataList[dataIndex];
          }
          this.setData(data);
          this.isLoading = false;
        }
      }
      if (process.client) {
        if (this?.$refs?.graph?.chart) {
          if (step.filterDate) {
            var closestDates = getClostestDate(
              step.filterDate.startDate,
              step.filterDate.endDate,
              this.currentChartData
            );
            this.$refs?.graph?.chart.zoomScale("x", closestDates, "default");
            this.$refs?.graph?.chart.update();
          } else if (this.$refs.graph.chart) {
            this.$refs.graph.chart.resetZoom();
            this.$refs.graph.chart.update();
          }
        }
        const dataIndex = step.order - this.background.stepstart;
        //console.lg("this.dataList", this.dataList)
        let data = this.dataList[0];
        if (this.dataList[dataIndex]) {
          data = this.dataList[dataIndex];
        }
        this.setData(data);
      }
    },
  },
};

function isChartWeekly(data) {
  var d1 = new Date(data[0].x).getTime();
  var d2 = new Date(data[1].x).getTime();
  let difference = d1 - d2;
  let TotalDays = Math.abs(Math.ceil(difference / (1000 * 3600 * 24)));
  return TotalDays > 1;
}

function compare(a, b) {
  if (a.x < b.x) {
    return -1;
  }
  if (a.x > b.x) {
    return 1;
  }
  return 0;
}

function compareHeadlines(a, b) {
  if (a.date < b.date) {
    return -1;
  }
  if (a.date > b.date) {
    return 1;
  }
  return 0;
}
</script>

<style lang="sass" scoped>
.loading
  width: 100%
  height: 300px
  display: flex
  align-items: center
  justify-content: center
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
  width: 100% !important
  margin-top: 10px
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
  width: 100%
  color: black
  @media only screen and (max-width: 480px)
    font-size: 12px
</style>
