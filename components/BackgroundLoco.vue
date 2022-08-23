<template>
  <v-container class="step-component" fluid>
    <nuxt-content class='step-component_content' :document="step[currentBody]" />
    {{progress}}
  </v-container>
</template>

<script>
import StepMixin from "@/mixins/StepMixin.js";

export default {
  name: 'BackgroundLoco',
  mixins: [StepMixin],
  data() {
    return {
    }
  },
  mounted () {
    console.log('montou comp step: ', this.step.name)
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

.step-component
  display: flex
  flex-direction: column
  align-content: flex-start
  width: 100vw
  height: fit-content
  &_content
    color: white
    background-color: black
</style>
