<template>
  <v-container fluid class="home ma-0 pa-0">
    <transition name="fade">
      <div
        class="sticky-div-container"
        v-if="showSticky"
      >
        <LazyNuxtDynamic class='sticky' :component="currStepObj.stickycomponent" :step="currStepObj" :progress="getStepProgress(currStepObj.order)" />
      </div>
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
        <LazyNuxtDynamic :component="step.component" :step="step" :progress="getStepProgress(step.order)" />
      </div>
    </Scrollama>
  </v-container>
</template>

<script>
import Vue from 'vue'

export default {
  head () {
    return {
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
    showSticky () { // se o prox tem sticky... se brotar so quando tiver nele vai ficar ruim
      return this.steps && this.steps[parseInt(this.currStep)] && this.steps[parseInt(this.currStep)].stickycomponent ? true : false
    },
    currStepObj () {
      return this.steps[parseInt(this.currStep)]
    }
  },
  components: {
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

.sticky-div-container
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
