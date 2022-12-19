<template>
  <v-container class="text-component" fluid ma-0 pa-0>
    <div class="text-component_center">
      <transition name="fade">
        <div v-if="step[currentBody] && loaded" class="text-component_center_container">
          <nuxt-content
            class="text-component_center_container_content"
            :document="step[currentBody]"
          />
        </div>
    </transition>
    </div>
  </v-container>
</template>

<script>
import StepMixin from '@/mixins/StepMixin.js'
import BarChart from './BarChart.vue'

export default {
  name: 'TextCenter',
  mixins: [StepMixin],
  data() {
    return {
      loaded: false
    }
  },
  mounted() {
    setTimeout(()=> {
      this.loaded = true;
    }, 250)
  },
  async asyncData({ $content }) {},
  computed: {},
  methods: {},

  watch: {}
}
</script>

<style lang="sass" scoped>

.text-component
  display: flex
  flex-direction: column
  align-content: center
  justify-content: center
  width: 500px
  max-width: 100vw !important
  height: 100vh
  &_center
    position: absolute
    left: 0px
    transform: translate(calc(-50vw + 480px - 200px), 0px)
    width: fit-content
    height: fit-content
    margin: 0 auto
    align-self: center
    display: flex
    height: 100vh
    align-content: center
    align-items: center
    align-self: center
    padding: 0px 15px 0px 15px !important
    @media only screen and (max-width: 1000px)
      left: 0 !important
      transform: translate(0px, 0px) !important
      align-items: flex-start
    &_container
      display: flex
      // background-color: $window-text-bg
      background: linear-gradient(180deg, rgba(157, 157, 157, 0.7) 0%, rgba(233, 233, 233, 0) 100%)
      backdrop-filter: blur(25px)
      border-radius: 4px
      max-width: 500px
      pointer-events: all !important
      flex-direction: column
      align-content: center
      justify-content: center
      align-items: center
      height: fit-content
      box-shadow: 0px 4px 25px 0px #00000040
      @media only screen and (max-width: 480px)
      &_top
        border-radius: 4px 4px 0px 0px
        height: 24px
        width: 100%
        background-color: $window-top-bg
      &_title
        color: white
        font-weight: 900
        font-size: 22px
        margin-bottom: 10px
      &_content
        padding: 12px
        height: fit-content
        width: fit-content
        :deep(p)
            font-family: Open Sans
            color: black
            font-size: max(1.2vw, 18px)
            margin-bottom: 0px
            @media only screen and (max-width: 1000px)
            font-size: 20px
            @media only screen and (max-width: 480px)
              font-size: 16px
</style>
