<template>
  <v-container class="text-component" fluid ma-0 pa-0>
    <div class="text-component_center">
        <div class="text-component_center_container">
            <div class='text-component_center_container_top'></div>
            <h1 class='text-component_center_container_title' v-if="hasTitle">{{currentTitle}}</h1>
            <nuxt-content class='text-component_center_container_content' :document="step[currentBody]" />
        </div>
    </div>
  </v-container>
</template>

<script>
import StepMixin from "@/mixins/StepMixin.js";
import BarChart from './BarChart.vue';

export default {
  name: 'TextCenter',
  mixins: [StepMixin],
  data() {
    return {
    }
  },
  mounted () {
  },
  async asyncData({ $content }) {
  },
  computed: {
  },
  methods: {
  },

  watch: {

  }
}
</script>

<style lang="sass" scoped>

.text-component
  display: flex
  flex-direction: column
  align-content: center
  justify-content: center
  width: 100vw
  height: 100vh
  &_center
    position: absolute
    left: -38vw
    width: 100vw
    height: fit-content
    margin: 0 auto
    align-self: center
    display: flex
    height: 100vh
    align-content: center
    justify-content: center
    align-items: center
    align-self: center
    padding: 0px 20px 0px 20px !important
    &_container
      display: flex
      background-color: $window-text-bg
      backdrop-filter: blur(3px)
      border-radius: 4px
      max-width: 80%
      flex-direction: column
      align-content: center
      justify-content: center
      align-items: center
      height: fit-content
      box-shadow: 0px 4px 25px 0px #00000040
      &_top
        border-radius: 4px 4px 0px 0px
        height: 24px
        width: 100%
        background-color: $window-top-bg
      &_title
        color: white
        font-weight: 900
        font-size: 22px
        margin-bottom: 10px
      &_content
        padding: 12px
        height: fit-content
        width: fit-content
        :deep(p)
            font-family: Golos-Text-Regular
            color: black
            font-size: 21px
            margin-bottom: 0px
</style>
