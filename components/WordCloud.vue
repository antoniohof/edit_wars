<template>
 <client-only>
    <a-scene embedded>
      <a-entity camera look-controls wasd-controls="acceleration:100; fly: true;" :position="`5 7 ${5 + 4*totalProgress}`"></a-entity>
      <a-sky color="#fffffff"></a-sky>
      <a-text font="msdf/cyrilic-msdf.json" opacity="0.8" color="black" font-image="msdf/cyrilic.png" negate="false" v-for="n in news" :key="n.ID" :position="`${n.x} ${n.y} ${n.z}`" :value="n.title_new"></a-text>
    </a-scene>
  </client-only>
</template>

<script>
import { getDates, processTableutData, filterDatabyDate } from '../utils/DataProcessing'
import { dataSteps } from '../data/'

import StepMixin from "@/mixins/StepMixin.js";

export default {
  head () {
    return {
      mixins: [
        StepMixin
      ],
      script: [
            {src: 'https://unpkg.com/aframe/dist/aframe-master.min.js'}
        ]
    }
  },
  props: {
    currentStep: Number,
    currentProgress: Number
  },
  data () {
    return {
      currentIndex: 0,
      texts: [],
      news: [],
      size: 15,
      totalProgress: 0
    }
  },
  mounted () {
    this.updateData()
  },
  methods: {
    updateData () {
      //console.log("getDates", getDates(new Date("01/01/2022"), new Date("08/01/2022")))
      var currentData = dataSteps[this.currentStep]
      this.news = filterDatabyDate(currentData.data, currentData.startDate, currentData.endData)
      this.news = this.news.map(n => {
        n.x = Math.random()*this.size
        n.y = Math.random()*this.size
        n.z = Math.random()*this.size
        return n
      })
      console.log("currentData", currentData)
      console.log("this.news", this.news)
    }
  },
  watch: { 
    currentStep: function(newVal, oldVal) { // watch it
      console.log('Prop changed: ', newVal, ' | was: ', oldVal)
      this.updateData()
    },
    currentProgress: function(newVal, oldVal) {
      this.totalProgress = this.currentStep + newVal
    }
  }
}
</script>

<style lang="sass" scoped>

</style>