<template>
  <v-container fluid class="graph-container">
    <LineChartJs 
      v-if="currentChartData && !isLoading"
      :chart-options="chartOptions"
      :chart-data="currentChartData"
      :chart-id="chartId"
      :dataset-id-key="datasetIdKey"
      :css-classes="cssClasses"
      :styles="styles"
      :width="width"
      :height="height"
    />
    <div v-if="isLoading" class="loading">
      <v-progress-circular
        indeterminate
        color="black"
      ></v-progress-circular>
    </div>
  </v-container>
</template>

<script>
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, LineController} from 'chart.js'
import {easingEffects} from 'chart.js/helpers'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, LineController)


import { getDates, processTableutData, escapeCode, parseDataUrl} from '../utils/DataProcessing'

import { colorPalette } from '../utils/constants'

import StepMixin from "@/mixins/StepMixin.js";


export default {
  name: 'LineChart',
  mixins: [StepMixin],
  components: { 
    'LineChartJs': Line,
   },
   props: {
    background: {
          type: Object,
          required: true
      }
  },
  data () {
    return {
      isLoading: false,
      chartId: 'line-chart',
      datasetIdKey: 'label',
      width: 1000,
      height: 800,
      cssClasses: '',
      styles: {
          width: `100%`,
      },
      chartOptions: null,
      additionalOptions: null,
      gradient: null,
      currentProcessedData: null,
      currentChartData: null
    }
  },
  async mounted () {    
    this.isLoading = true;

    await this.loadData()
    const dataIndex = this.step.order - this.background.stepstart 
    this.setData(this.dataList[dataIndex])
    this.isLoading = false;
  },
  methods: {
    async loadData () {
      this.dataList = []
      this.chartOptions = JSON.parse(escapeCode(this.background.chartoptions))
      const dataNames = this.background.name.split(',')
      for await (const name of dataNames) {
        let url = 'https://cdn.jsdelivr.net/gh/editwarsteam/edit_wars_api/export/' + name + '.json'
        await fetch(parseDataUrl(url)).then(response => response.json()).then(fetchedData => {
          this.dataList.push(fetchedData)
        })
      }
    },
    setData (fetchedData) {
      if (!fetchedData) {
        console.error('no barChart data for this step')
        return
      }
      fetchedData.datasets = fetchedData.datasets.map((d, i) => {
        d.borderColor = colorPalette[i]
        d.backgroundColor = colorPalette[i]
        return d
      })
      this.currentProcessedData = fetchedData.datasets[0].data
      if (this.chartOptions?.scales.x.time.unit !== "week") {
        //this.setAnimation()
      }
      this.currentChartData = {
        labels: fetchedData.labels,
        datasets: fetchedData.datasets,
        type: 'line'
      }
    },
    setAnimation () {
      let easing = easingEffects.easeOutQuad;
      const data = this.currentProcessedData
      let restart = false;
      const totalDuration = 5000;
      const duration = (ctx) => easing(ctx.index / data.length) * totalDuration / data.length;
      const delay = (ctx) => easing(ctx.index / data.length) * totalDuration;
      const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
      this.animation = {
        x: {
          type: 'number',
          easing: 'linear',
          duration: duration,
          from: NaN, // the point is initially skipped
          delay(ctx) {
            if (ctx.type !== 'data' || ctx.xStarted) {
              return 0;
            }
            ctx.xStarted = true;
            return delay(ctx);
          }
        },
        y: {
          type: 'number',
          easing: 'linear',
          duration: duration,
          from: previousY,
          delay(ctx) {
            if (ctx.type !== 'data' || ctx.yStarted) {
              return 0;
            }
            ctx.yStarted = true;
            return delay(ctx);
          }
        }
      };
      //
      this.additionalOptions = {
        responsive: true,
          elements: {
              point:{
                    radius: 0
                }
            },
          interaction: {
            intersect: false
          },
          scales: {
            x: {
              type: 'linear',
              min: new Date('2022-01-01').valueOf(),
              max: new Date('2022-07-31').valueOf()
            }
          },
          animation: this.animation
        }
        this.chartOptions = {
          ...this.additionalOptions,
          ...this.chartOptions
        }
    }
  },
  watch: {
    step (step) {
      const dataIndex = step.order - this.background.stepstart 
      this.setData(this.dataList[dataIndex] ? this.dataList[dataIndex] : this.dataList[0])
    }
  }
}
</script>

<style lang="sass" scoped>
.graph-container
  display: flex
  flex-direction: column
  justify-content: center
  width: 100%
  width: -moz-available          
  width: -webkit-fill-available 
  width: fill-available
</style>