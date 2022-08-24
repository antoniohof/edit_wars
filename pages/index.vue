<template>
  <v-container fluid class="home ma-0 pa-0">
    <transition name="fade">
      <div class='background' v-if="currentBackground">
        <LazyNuxtDynamic  class='background_container' :component="currentBackground.component" :step="currentBackground" :currentStepIndex="currStep" :progress="getStepProgress(currStep)" />
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
        <LazyNuxtDynamic :component="step.component" :step="step" :currentStepIndex="currStep" :progress="getStepProgress(index)" />
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
  components: {
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
    currStepObj () {
      return this.steps[this.currStep]
    },
    currentBackground () {
      let back = null
      back = this.backgrounds.find((item) => {
        if ((this.currStep >= (item.stepstart)) && (this.currStep <= (item.stepend))) {
          return item
        }
      })
      console.log('cur back', back)
      return back
    }
  },
  components: {
  },
  async asyncData({ $content, params, error }) {
    let steps
    let backgrounds
    try {
      // steps = await $content('steps').only(['name', 'slug']).sortBy('name').fetch()
      steps = await $content('steps').sortBy('order').fetch()
      backgrounds = await $content('backgrounds').fetch()
    } catch (e) {
      error({ message: 'error retrieveing content' })
    }
    return {
      steps,
      backgrounds
    }
  },
  methods: {
    onStick () {
      console.log('on sitck')
    },
    stepEnterHandler ({element, index, direction}) {
      // handle the step-event as required here
      console.log({ element, index, direction });
      // use the data attributes if needed
      console.log(element.dataset.step) // a, b or c 
      this.currStep = parseInt(element.dataset.stepNo)
      console.log(this.currStep)
    },
    stepExitHandler ({element, index, direction}) {

    },
    getStepProgress (step) {
      const curStepNum = this.currStep
      if (step === curStepNum) {
        return this.currStepProgress
      }
      if (step < curStepNum) {
        return 1
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
  position: relative

.scrollama
  flex: 1

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
  height: 100vh
  width: 100vw
  position: fixed
  top: 0
  display: flex
  justify-content: center
  align-items: center

.background_container
  display: flex
  justify-content: center
  align-items: center
  height: fit-content
  width: fit-content


</style>
