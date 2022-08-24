<template>
  <v-container class="image-component" fluid>
    <nuxt-content class='image-component_content' :document="step[currentBody]" />
  </v-container>
</template>

<script>
import StepMixin from "@/mixins/StepMixin.js";

export default {
  name: 'DefaultImage',
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
.image-component
  width: 100%
  height: 100%
  &_content
    height: 100%
    color: white
    background-color: transparent
    display: flex
    justify-content: center
    align-items: center
    ::v-deep img
      height: 80%
</style>
