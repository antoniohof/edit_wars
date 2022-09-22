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
    background: {
          type: Object,
          required: true
      }
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
      chartOptions: {},
      dataList: []
    }
  },
  async mounted () {   
    console.log('this.background', this.background)
    console.log('this.currStepIndex', this.currentStepIndex)
    await this.loadData()
    const dataIndex = this.step.order - this.background.stepstart 
    console.log('dataIndex', dataIndex)
    console.log('this.dataList', this.dataList)
    this.setData(this.dataList[dataIndex])
  },
  methods: {
    async loadData () {
      this.dataList = []
      this.chartOptions = JSON.parse(escapeCode(this.background.chartoptions))
      const dataNames = this.background.name.split(',')
      for await (const name of dataNames) {
        let url = 'https://cdn.jsdelivr.net/gh/mneunomne/edit_wars_database/export/' + name + '.json'
        await fetch(parseDataUrl(url)).then(response => response.json()).then(fetchedData => {
          this.dataList.push(fetchedData)
          console.log('loaded', this.dataList)
        })
      }
    },
    setData(fetchedData) {
      if (!fetchedData) {
        console.error('no barChart data for this step')
        return
      }
      console.log('fetchedData', fetchedData)
      this.currentChartData = {
        labels: fetchedData.labels,
        datasets: fetchedData.datasets
      }
    }
  },
  watch: {
    step (step) {
      const dataIndex = step.order - this.background.stepstart 
      console.log('this.background.stepstart ', this.background.stepstart)
      console.log('dataIndex', dataIndex)
      this.setData(this.dataList[dataIndex])
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