<template>
  <v-container class="text-component" fluid ma-0 pa-0>
    <div class="text-component_center">
        <div class="text-component_center_container">
            <h1 class='text-component_center_container_title' v-if="hasTitle">{{currentTitle}}</h1>
            <nuxt-content class='text-component_center_container_content' :document="step[currentBody]" />
        </div>
    </div>
  </v-container>
</template>

<script>
import StepMixin from "@/mixins/StepMixin.js";
import BarChart from './BarChart.vue';

export default {
  name: 'TextCenter',
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
  width: 100vw
  height: 100vh
  &_center
    position: absolute
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
    &_container
      padding: 10px
      display: flex
      background-color: black
      flex-direction: column
      align-content: center
      justify-content: center
      align-items: center
      height: fit-content
      &_title
        color: white
        font-weight: 900
        font-size: 22px
        margin-bottom: 10px
      &_content
        height: fit-content
        color: white
        width: fit-content
        :deep(p)
            color: white
            font-size: 22px
            margin-bottom: 0px
</style>
