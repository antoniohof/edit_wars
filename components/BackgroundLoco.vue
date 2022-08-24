<template>
  <v-container class="background-component" fluid>
    <nuxt-content class='background-component_content' :document="step[currentBody]" />
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
.background-component
  width: 300px
  height: 300px
  &_content
    height: 100%
    color: white
    background-color: transparent
    display: flex
    justify-content: center
    align-items: center
    ::v-deep img
      height: 300px !important
</style>
