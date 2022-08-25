<template>
  <v-container class="text-component" fluid ma-0 pa-0>
    <div class="text-component_container">
      <h1 class='text-component_container_title' v-if="step.title">{{step.title}}</h1>
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
  display: flex
  flex-direction: column
  align-content: center
  justify-content: center
  width: fit-content
  height: 100vh
  &_container
    background-color: red
    padding: 10px
    &_title
      color: white
      font-weight: 900
      font-size: 22px
      margin-bottom: 10px
    &_content
      height: fit-content
      width: 100%
      :deep(p)
        color: black
        font-size: 22px
        margin-bottom: 0px
</style>
