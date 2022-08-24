<template>
  
</template>

<script>
import { Bar } from 'vue-chartjs'
import { getDates, processTableutData } from '../utils/DataProcessing'

import { steps } from '../data/'

export default Bar.extend({
  props: {
    currentIndex: Number
  },
  data () {
    return {
      gradient: null,
      currentData: null,
      currentStep: null
    }
  },
  mounted () {    
    var dates = getDates(new Date("01/01/2022"), new Date("08/01/2022"))
    var data = processTableutData(steps[this.currentIndex].data, dates)
    
    this.gradient = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 450)
    this.gradient.addColorStop(0, 'rgba(255, 0,0, 1)') // show this color at 0%;
    this.gradient.addColorStop(0.5, 'rgba(255, 0, 0, 1)'); // show this color at 50%
    this.gradient.addColorStop(1, 'rgba(145, 67, 204, 1)'); // show this color at 100%

    this.renderChart({
      labels: dates,//['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [
        {
          label: 'Data One',
          backgroundColor: this.gradient,
          data: data,
          // borderWidth: 1
        }
      ]
    }, {
      responsive: true, 
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true
        }
      }
    })
  }
})
</script>

<style>

</style>