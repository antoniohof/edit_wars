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


import { getDates, processTableutData, parseDataUrl } from '../utils/DataProcessing'
import StepMixin from "@/mixins/StepMixin.js";

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
    this.showData()
    //
  
  },
  methods: {
    showData () {
      console.log(this.step)
      fetch(parseDataUrl(this.step.data)).then(response => response.json()).then(data => {
        console.log('data', data)
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
              backgroundColor: this.gradient,
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