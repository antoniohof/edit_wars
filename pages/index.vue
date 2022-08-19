<template>
  <v-container fluid class="home ma-0 pa-0">
    <div class='home_container'>
      <Scrollama 
      :debug="true"
      @step-enter="stepEnterHandler" 
      @step-exit="stepExitHandler"
      :offset="0.2">
        <div
          v-for="n in 4"
          :key="n"
          class="step"
          :data-step-no="n"
          :class="{ active: n == currStep }"
        >
          step {{ n }}
        </div>
      </Scrollama>
    </div>
  </v-container>
</template>

<script>
import 'intersection-observer' // for cross-browser support
import Scrollama from 'vue-scrollama' // local registration in this example, can also be globally registered

export default {
  head () {
    return {
    }
  },
  mounted () {
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
    Scrollama
  },
  async asyncData({ $content }) {
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
  height: 100%
  display: flex
  justify-content: center
  width: 100vw
  &_container
    height: 100vh
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
