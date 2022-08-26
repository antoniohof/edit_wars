<template>
  <v-container class="image-component" fluid>
    <nuxt-content class='image-component_content' :document="step[currentBody]" />
  </v-container>
</template>

<script>
import StepMixin from "@/mixins/StepMixin.js";

export default {
  name: 'ImageCenter',
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
.image-component
  display: flex
  flex-direction: column
  align-content: center
  justify-content: center
  width: 100vw
  height: 100vh
  &_content
    position: absolute !important
    width: 100vw
    height: fit-content
    margin: 0 auto
    left: 0
    display: flex
    height: 100vh
    align-content: center
    justify-content: center
    align-items: center
    align-self: center
    padding: 0px 20px 0px 20px !important
    :deep(p)
      height: 100%
      width: 100%
      margin-bottom: 0px
      display: flex
      justify-content: center
      img
        height: auto
        width: 65%
        align-self: center
</style>
