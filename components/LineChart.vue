<template>
  <v-container fluid class="graph-container">
    <LineChartJs 
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
  </v-container>
</template>

<script>
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement} from 'chart.js'
import {easingEffects} from 'chart.js/helpers'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement)


import { getDates, processTableutData } from '../utils/DataProcessing'
import StepMixin from "@/mixins/StepMixin.js";


export default {
  name: 'LineChart',
  mixins: [StepMixin],
  components: { 
    'LineChartJs': Line,
   },
  props: {
  },
  data () {
    return {
      chartId: 'line-chart',
      datasetIdKey: 'label',
      width:800,
      height: 800,
      cssClasses: '',
      styles: {
          width: `95%`,
      },
      chartOptions: null,
      additionalOptions: null,
      gradient: null,
      currentProcessedData: null,
      currentChartData: null
    }
  },
  mounted () {    
    this.loadData()
  },
  methods: {
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
              type: 'linear'
            }
          },
          animation: this.animation
        }
    },
    loadData (index) {
      console.log(this.step)
      this.chartOptions = JSON.parse(escapeCode(this.step.chartoptions))
      fetch(parseDataUrl(this.step.data)).then(response => response.json()).then(data => {
        console.log('data', data)
        const rawStepData = data
          if (!rawStepData) {
            console.error('no barChart data for this step')
            return
          }
          // const startDate = "01/01/2022"
          // const endDate = "08/01/2022"
          // const dates = getDates(new Date(startDate), new Date(endDate))
          // this.currentProcessedData = processTableutData(rawStepData, dates)
          this.setAnimation()
          this.currentChartData = {
            labels: rawStepData.labels,
            datasets: rawStepData.datasets,
            type: 'line'
          }
        })
      }
  },
  watch: {
    currentStepIndex (index) {
      this.showData()
    }
  }
}
</script>

<style lang="sass" scoped>
.graph-container
  width: 100%
  width: -moz-available          
  width: -webkit-fill-available 
  width: fill-available
</style>