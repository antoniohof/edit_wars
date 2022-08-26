<template>
  <v-container class="text-component" fluid ma-0 pa-0>
    <div class="text-component_container">
      <h1 class='text-component_container_title' v-if="hasTitle">{{currentTitle}}</h1>
      <nuxt-content class='text-component_container_content' :document="step[currentBody]" />
    </div>
  </v-container>
</template>

<script>
import StepMixin from "@/mixins/StepMixin.js";
import BarChart from './BarChart.vue';

export default {
  name: 'DefaultText',
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

.text-component
  position: absolute
  width: 100vw
  height: fit-content
  margin: 0 auto
  left: 0
  display: flex
  flex-direction: column
  align-content: center
  justify-content: center
  padding: 0px 20px 0px 20px !important
  height: 100vh
  &_container
    align-self: center
    width: fit-content
    background-color: black
    padding: 10px
    &_title
      color: white
      font-weight: 900
      font-size: 22px
      margin-bottom: 10px
    &_content
      height: fit-content
      color: white
      width: 100%
      :deep(p)
        color: white
        font-size: 22px
        margin-bottom: 0px
</style>
