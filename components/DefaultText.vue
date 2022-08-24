<template>
  <v-container class="text-component" fluid ma-0 pa-0>
    <nuxt-content class='text-component_content' :document="step[currentBody]" />
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
  align-content: center
  justify-content: center
  width: fit-content
  height: 100vh
  &_content
    padding: 10px
    height: fit-content
    width: 100%
    background-color: red
    :deep(p)
      color: black
      font-size: 22px
      margin-bottom: 0px
</style>
