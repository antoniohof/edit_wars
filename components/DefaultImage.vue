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
    height: 70%
    width: 70%
    color: white
    background-color: transparent
    display: flex
    justify-content: center
    align-items: center
    :deep(p)
      height: 100%
      width: 100%
      margin-bottom: 0px
      display: flex
      img
        height: auto
        width: 100%
        align-self: center
</style>
