<template>
  <v-container class="text-component" fluid ma-0 pa-0>
    <transition name="fade">
    <div v-if="step[currentBody] && loaded" class="text-component_container">
      <nuxt-content
        class="text-component_container_content"
        :document="step[currentBody]"
      />
    </div>
  </transition>
  </v-container>
</template>

<script>
import StepMixin from '@/mixins/StepMixin.js'

export default {
  name: 'DefaultText',
  mixins: [StepMixin],
  data () {
    return {
      loaded: false
    }
  },
  mounted () {
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
  width: fit-content
  max-width: 480px
  padding: 0px 15px 0px 15px !important
  height: 100vh
  will-change: transform
  @media only screen and (max-width: 1200px)
    align-items: flex-center
    justify-content: flex-center
    align-items: flex-center
    align-content: flex-center
    margin: 0 auto !important
    min-width: 100vw
    height: fit-content !important
  &_container
    border-radius: 4px
    pointer-events: all !important
    // background-color: $window-text-bg
    background: linear-gradient(180deg, rgba(157, 157, 157, 0.7) 0%, rgba(233, 233, 233, 0) 100%)
    backdrop-filter: blur(25px)
    box-shadow: 0px 4px 25px 0px #00000040
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
      width: 100%
      :deep(p)
        font-family: Open Sans
        color: black
        font-size: max(1.2vw, 18px)
        margin-bottom: 0px
        @media only screen and (max-width: 1200px)
          font-size: 20px
        @media only screen and (max-width: 480px)
          font-size: 16px

</style>
