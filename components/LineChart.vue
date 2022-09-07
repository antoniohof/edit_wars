<template>
  <div class="graph-container">
    <Line 
      :chart-options="chartOptions"
      :chart-data="chartData"
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
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)


import { getDates, processTableutData } from '../utils/DataProcessing'

import { dataSteps } from '../data/'

export default {
  components: { Line },
  props: {
    currentIndex: {
      type: Number,
      default: 0
    },
    chartId: {
      type: String,
      default: 'bar-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    width: {
      type: Number,
      default: 800
    },
    height: {
      type: Number,
      default: 800
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => {
        return {
          width: `70%`,
        }
      }
    },
    plugins: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      gradient: null,
      currentData: null,
      currentStep: null,
      chartData: {
        labels: [ 'January', 'February', 'March' ],
        datasets: [ { data: [40, 20, 12] } ]
      },
      chartOptions: {
        responsive: true
      }
    }
  },
  mounted () {    
    var dates = getDates(new Date("01/01/2022"), new Date("08/01/2022"))
    var data = processTableutData(dataSteps[this.currentIndex].data, dates)
    this.chartData = {
      labels: dates,//['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [
        {
          label: 'Data One',
          backgroundColor: this.gradient,
          data: data,
          // borderWidth: 1
        }
      ]
    }
  }
}
</script>

<style lang="sass" scoped>
.graph-container
  display: contents !important
  width: 1011px !important
</style>