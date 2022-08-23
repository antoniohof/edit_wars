<template>
  <v-container class="step-component" fluid>
    	{{progress}}
    <nuxt-content :style="{ 'filter': getSaturation }" class='step-component_content' :document="step[currentBody]"/>
  </v-container>
</template>

<script>
import StepMixin from "@/mixins/StepMixin.js";

export default {
  name: 'StepParalaxe',
  mixins: [StepMixin],
  data() {
    return {
      saturation: 1
    }
  },
  mounted () {
    console.log('montou comp step: ', this.step.name)
    console.log('scrollbox', this.$refs.scrollBox)
  },
  async asyncData({ $content }) {
  },
  computed: {
    getSaturation () {
      return 'saturate(' + this.saturation + ')'
    }
  },

  methods: {
  },
  watch: {
    progress (value) {
      this.saturation = value * 50
    }
  }
}
</script>

<style lang="sass">

</style>

<style lang="sass" scoped>

.step-component
  height: 100vw
  max-width: 100%
  display: flex
  overflow: hidden
  flex-direction: column
  &_content
    color: white
    background-color: black
    display: flex
    width: 100%

</style>
