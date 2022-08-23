<template>
  <v-container fluid class="home ma-0 pa-0">
    <Scrollama 
    :debug="true"
    @step-enter="stepEnterHandler" 
    @step-exit="stepExitHandler"
    @step-progress="({ progress }) => (currStepProgress = progress)">
      <div
        v-for="step in steps"
        :key="step.uuid"
        class="step"
        :data-step-no="step.order"
        :class="{ active: step.order == currStep }"
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
  },
  activated () {
  },
  updated () {
  },
  data () {
    return {
      currStep: null,
      currStepProgress: 0
    }
  },
  computed: {
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
      console.log('step', step)
      console.log('curstep', this.currStep)
      const curStepNum = parseInt(this.currStep)
      console.log(this.currStepProgress)
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

<style lang="sass" scoped>
.home
  height: 100%
  display: flex
  justify-content: center
  width: 100vw
.scrollama__steps
  width: 100%
.step
  padding: 15vh 0
  width: 50%
  margin: 0 auto 30vh
  background-color: beige
  border: 1px solid #ccc
  display: flex
  align-items: center
  justify-content: center
.step.active
  background-color: teal
  color: white
</style>
