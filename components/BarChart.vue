<template>
  <div class="graph-container">
    <Bar 
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
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)


import { getDates, processTableutData } from '../utils/DataProcessing'
import StepMixin from "@/mixins/StepMixin.js";

import { dataSteps } from '../data/'

export default {
  mixins: [StepMixin],
  components: { Bar },
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
  },
  watch: {
    currentStepIndex (index) {
      if (index === 0) {
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
      } else {
        var dates = getDates(new Date("05/01/2022"), new Date("07/01/2022"))
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
  }
}
</script>

<style lang="sass" scoped>
.graph-container
  width: 1011px !important
</style>