<template>
 <client-only>
    <a-scene embedded>
      <a-entity camera look-controls wasd-controls="acceleration:100; fly: true;" position="5 7 16"></a-entity>
      <a-sky color="#fffffff"></a-sky>
      <a-text font="msdf/cyrilic-msdf.json" opacity="0.2" color="black" font-image="msdf/cyrilic.png" negate="false" v-for="n in news" :key="n.ID" :position="`${Math.random()*size} ${Math.random()*size} ${Math.random()*size}`" :value="n.title_new"></a-text>
    </a-scene>
  </client-only>
</template>

<script>
import { getDates, processTableutData, filterDatabyDate } from '../utils/DataProcessing'
import { steps } from '../data/'

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
      size: 15
    }
  },
  mounted () {
    this.updateData()
  },
  methods: {
    updateData () {
      //console.log("getDates", getDates(new Date("01/01/2022"), new Date("08/01/2022")))
      var currentData = steps[this.currentStep]
      this.news = filterDatabyDate(currentData.data, currentData.startDate, currentData.endData)
      console.log("currentData", currentData)
      console.log("this.news", this.news)
    }
  },
  watch: { 
    currentStep: function(newVal, oldVal) { // watch it
      console.log('Prop changed: ', newVal, ' | was: ', oldVal)
      this.updateData()
    }
  }
}
</script>

<style lang="sass" scoped>

</style>