<template>
  <v-container fluid class="home ma-0 pa-0">
    <transition name="fade">
      <div
        class="background"
        v-if="showSticky"
      >
        <LazyNuxtDynamic class='background_container' :component="currStepObj.stickycomponent" :step="currStepObj" :progress="getStepProgress(currStep)" />
      </div>
      <v-container>
        <WordCloud :currentStep="parseInt(currStep)" :currentProgress="parseFloat(currStepProgress)" :step="currStepObj"/>
      </v-container>
    </transition>
    <Scrollama 
    class="scrollama"
    :debug="true"
    @step-enter="stepEnterHandler" 
    @step-exit="stepExitHandler"
    @step-progress="({ progress }) => (currStepProgress = progress)">
      <div
        v-for="(step, index) in steps"
        :key="step.uuid"
        class="step"
        :data-step-no="index"
        :class="{ active: index == currStep }"
      >
        <LazyNuxtDynamic :component="step.component" :step="step" :progress="getStepProgress(index)" />
      </div>
    </Scrollama>
  </v-container>
</template>

<script>
import Vue from 'vue'
import WordCloud from '../components/WordCloud.vue'

export default {
  head () {
    return {
      script: [
            {src: 'https://unpkg.com/aframe/dist/aframe-master.min.js'}
        ]
    }
  },
  beforeMount () {
    // check if each step components exist, if not set to load default
    this.steps.forEach((step) => {
      let componentExists = step.component in Vue.options.components
      if (!componentExists) {
        step.component = 'DefaultComponent'
      }
    })
  },
  mounted () {
    console.log(this.steps)
    this.steps[this.currStep]
  },
  activated () {
  },
  updated () {
  },
  data () {
    return {
      currStep: 0,
      currStepProgress: 0
    }
  },
  computed: {
    showSticky () {
      return this.steps && this.steps[parseInt(this.currStep)] && this.steps[parseInt(this.currStep)].stickycomponent ? true : false
    },
    currStepObj () {
      return this.steps[parseInt(this.currStep)]
    }
  },
  components: {
    WordCloud
  },
  async asyncData({ $content, params, error }) {
    let steps
    try {
      // steps = await $content('steps').only(['name', 'slug']).sortBy('name').fetch()
      steps = await $content('steps').sortBy('order').fetch()
    } catch (e) {
      error({ message: 'steps list not found' })
    }
    return {
      steps
    }
  },
  methods: {
    stepEnterHandler ({element, index, direction}) {
      // handle the step-event as required here
      console.log({ element, index, direction });
      // use the data attributes if needed
      console.log(element.dataset.step) // a, b or c 
      this.currStep = element.dataset.stepNo
      console.log(this.currStep)
    },
    stepExitHandler ({element, index, direction}) {

    },
    getStepProgress (step) {
      const curStepNum = parseInt(this.currStep)
      if (step === curStepNum) {
        return this.currStepProgress
      }
      if (step < curStepNum) {
        return 100
      }
      if (step > curStepNum) {
        return 0
      }
    }
  }
}
</script>
<style lang="sass">
.scrollama__debug-offset
  border-top: 2px dashed red !important
</style>

<style lang="sass" scoped>
.home
  height: 100%
  display: flex
  justify-content: center
  width: 100vw

.scrollama
  position: absolute
.scrollama__steps
  width: 100%
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
.step
  width: fit-content
  background-color: black
  display: flex
  align-items: center
  justify-content: center
  border: 1px solid green
  margin-bottom: 100px

.step.active

.background
  min-width: 100vw
  left: 0
  height: fit-content
  width: 100vw
  heigh: 100vh
  top: 0
  position: sticky
  display: flex
  flex-direction: column
  justify-content: center
  overflow: visible

</style>
