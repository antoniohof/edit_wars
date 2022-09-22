<template>
  <v-container fluid class="home ma-0 pa-0">
    Intro
  </v-container>
</template>

<script>
import Vue from 'vue'
import throttle from 'lodash/throttle'

export default {
  head() {
    return {
      // script: [{ src: 'https://unpkg.com/aframe/dist/aframe-master.min.js' }]
    }
  },
  components: {},
  beforeMount() {

  },
  mounted() {

  },
  beforeDestroy() {
  },
  activated() {},
  updated() {},
  data() {
    return {

    }
  },
  computed: {
   
  },
  components: {
  },
  async asyncData({ $content, params, error }) {

  },
  methods: {
   
  }
}
</script>

<style lang="sass" scoped>

.home
  height: 100%
  display: flex
  width: 100vw
  color: black
  position: relative
  font-family: Space Mono !important
  font-size: 32px !important
</style>
