<template>
  <v-container class="step-component" fluid>
        E foi ai que eles se foderam
  </v-container>
</template>

<script>
import StepMixin from "@/mixins/StepMixin.js";

export default {
  name: 'TextOverlayBackgroundLoco',
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
  position: absolute
  top: 0
  flex-direction: column
  align-content: flex-start
  width: 100%
  color: red
  margin-bottom: 200px
  height: 1000px !important
  justify-content: center
  font-size: 100px
  z-index: 1000
  text-align: center
</style>
