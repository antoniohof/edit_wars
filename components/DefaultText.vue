<template>
  <v-container class="text-component" fluid>
    <nuxt-content class='text-component_content' :document="step[currentBody]" />
    {{progress}}
  </v-container>
</template>

<script>
import StepMixin from "@/mixins/StepMixin.js";

export default {
  name: 'DefaultText',
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

.text-component
  display: flex
  flex-direction: column
  align-content: flex-start
  width: 100%
  margin-bottom: 200px
  height: 100vh
  &_content
    color: black
    background-color: black
</style>
