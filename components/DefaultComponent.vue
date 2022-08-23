<template>
  <v-container class="step-component" fluid>
    DEFAULT COMPONENT
    <nuxt-content class='step-component_content' :document="step[currentBody]" />
    {{progress}}
  </v-container>
</template>

<script>
// in case still haven't programmed a component for this step, this one will be loaded
import StepMixin from "@/mixins/StepMixin.js";

export default {
  name: 'DefaultComponent',
  mixins: [StepMixin],
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
  width: 100%
  margin-bottom: 200px
  color: red
  &_content
    color: red
    background-color: yellow
</style>
