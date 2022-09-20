<template>
  <div class="graph-container">
    <Bar 
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
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)


import { getDates, processTableutData, parseDataUrl, escapeCode } from '../utils/DataProcessing'
import StepMixin from "@/mixins/StepMixin.js";

export default {
  name: 'BarChart',
  mixins: [StepMixin],
  components: { Bar },
  props: {
  },
  data () {
    return {
      currentProcessedData: null,
      currentChartData: null,
      chartId: 'bar-chart',
      datasetIdKey: 'label',
      width: 800,
      height: 800,
      cssClasses: '',
      styles: {
          width: `70%`,
      },
      chartOptions: {}
    }
  },
  mounted () {    
    this.loadData()
    //
  
  },
  methods: {
    loadData () {
      this.chartOptions = JSON.parse(escapeCode(this.step.chartoptions))
      fetch(parseDataUrl(this.step.data)).then(response => response.json()).then(data => {
        const rawStepData = data
        if (!rawStepData) {
          console.error('no barChart data for this step')
          return
        }
        const startDate = "01/01/2022"
        const endDate = "08/01/2022"
        const dates = getDates(new Date(startDate), new Date(endDate))
        this.currentProcessedData = processTableutData(rawStepData, dates)
        this.currentChartData = {
          labels: dates,
          datasets: [
            {
              data: this.currentProcessedData
            }
          ]
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
  width: 1011px !important
</style>