<template>
  <v-container fluid class="home ma-0 pa-0">
    <Scrollama 
    :debug="true"
    @step-enter="stepEnterHandler" 
    @step-exit="stepExitHandler"
    :offset="0.2">
      <div
        v-for="step in steps"
        :key="step.uuid"
        class="step"
        :data-step-no="step.order"
        :class="{ active: step.order == currStep }"
      >
        <LazyNuxtDynamic :component="step.component" :step="step" />
      </div>
    </Scrollama>
  </v-container>
</template>

<script>

export default {
  head () {
    return {
    }
  },
  mounted () {
    console.log('steps', this.steps)
  },
  activated () {
  },
  updated () {
  },
  data () {
    return {
      currStep: null
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

    }
  }
}
</script>

<style lang="sass" scoped>
.home
  height: 100vh
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
