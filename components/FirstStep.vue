<template>
  <v-container class="step-component" fluid>
    <nuxt-content class='step-component_content' :document="step[currentBody]" />
  </v-container>
</template>

<script>

export default {
  name: 'FirstStep',
  props: {
    step: {
        type: Object,
        required: true
    }
  },
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
    currentBody () {
      return 'body_' + this.$i18n.locale
    }
  },
  components: {},

  methods: {
  },
  watch: {

  }
}
</script>

<style lang="sass">

.step-component
  display: flex
  flex-direction: column
  align-content: flex-start
  width: 100%
  margin-bottom: 200px
</style>
