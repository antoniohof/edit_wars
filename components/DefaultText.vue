<template>
  <v-container class="text-component" fluid ma-0 pa-0>
    <div class="text-component_container">
      <nuxt-content
        class="text-component_container_content"
        :document="step[currentBody]"
      />
    </div>
  </v-container>
</template>

<script>
import StepMixin from '@/mixins/StepMixin.js'

export default {
  name: 'DefaultText',
  mixins: [StepMixin],
  data () {
    return {}
  },
  mounted () {
    console.log('montou')
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
  height: 100vh
  will-change: transform
  @media only screen and (max-width: 480px)
    max-width: 95vw
    align-items: flex-start
    justify-content: flex-start
    align-items: flex-start
    align-content: flex-start
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
        font-size: 20px
        margin-bottom: 0px
</style>
