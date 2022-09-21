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
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, TimeScale } from 'chart.js'
import 'chartjs-adapter-date-fns'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, TimeScale)


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
          width: `95%`,
      },
      chartOptions: {}
    }
  },
  mounted () {    
    this.loadData()  
  },
  methods: {
    loadData () {
      this.chartOptions = JSON.parse(escapeCode(this.step.chartoptions))
      let data = 'https://cdn.jsdelivr.net/gh/mneunomne/edit_wars_database/export/' + this.step.name + '.json'
      if (this.step.data) {
        data = this.step.data
      }
      fetch(parseDataUrl(data)).then(response => response.json()).then(data => {
        const rawStepData = data
        if (!rawStepData) {
          console.error('no barChart data for this step')
          return
        }
        console.log('rawStepData', rawStepData)
        this.currentChartData = {
          labels: rawStepData.labels,
          datasets: rawStepData.datasets
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