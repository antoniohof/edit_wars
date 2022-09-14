<template>
  <div class="graph-container">
    <Bar 
      v-if="currentChartData"
      :chart-options="chartOptions"
      :chart-data="currentChartData"
      :chart-id="chartId"
      :dataset-id-key="datasetIdKey"
      :plugins="plugins"
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


import { getDates, processTableutData } from '../utils/DataProcessing'
import StepMixin from "@/mixins/StepMixin.js";

import { dataSteps } from '../data/'

export default {
  name: 'BarChart',
  mixins: [StepMixin],
  components: { Bar },
  props: {
  },
  data () {
    return {
      gradient: null,
      currentProcessedData: null,
      currentChartData: null,
      chartId: 'bar-chart',
      datasetIdKey: 'label',
      width:800,
      height: 800,
      cssClasses: '',
      styles: {
          width: `70%`,
      },
      plugins: null,
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          subtitle: {
              display: true,
              text: 'Custom Chart Subtitle'
          },
          title: {
            display: true,
            text: () => "Number of Articles"
          }
        }
      }
    }
  },
  mounted () {    
    this.showData(this.currentStepIndex)
    //
  
  },
  methods: {
    showData (index) {
      const rawStepData = dataSteps.find((step) => step.backgroundName === this.step.name)
      if (!rawStepData) {
        console.error('no barChart data for this step')
        return
      }
      const dates = getDates(new Date(rawStepData.startDate), new Date(rawStepData.endDate))
      this.currentProcessedData = processTableutData(rawStepData.data, dates)
      this.currentChartData = {
        labels: dates,
        datasets: [
          {
            backgroundColor: this.gradient,
            data: this.currentProcessedData
          }
        ]
      }
    }
  },
  watch: {
    currentStepIndex (index) {
      this.showData(this.currentStepIndex)
    }
  }
}
</script>

<style lang="sass" scoped>
.graph-container
  width: 1011px !important
</style>