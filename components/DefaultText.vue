<template>
  <v-container class="text-component" fluid ma-0 pa-0>
    <div class="text-component_container">
      <div class='text-component_container_top'></div>
      <h1 class='text-component_container_title' v-if="hasTitle">{{currentTitle}}</h1>
      <nuxt-content class='text-component_container_content' :document="step[currentBody]" />
    </div>
  </v-container>
</template>

<script>
import StepMixin from "@/mixins/StepMixin.js";
import BarChart from './BarChart.vue';

export default {
  name: 'DefaultText',
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
  width: fit-content
  height: 100vh
  &_container
    border-radius: 4px
    background-color: $window-text-bg
    backdrop-filter: blur(3px)
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
      width: 100%
      :deep(p)
        font-family: Golos-Text-Regular
        color: black
        font-size: 21px
        margin-bottom: 0px
</style>
