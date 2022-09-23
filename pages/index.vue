<template>
  <v-container fluid class="home ma-0 pa-0">
    <v-container fluid class="intro">
      The monopoly on information is a key propaganda tool. Using it, a state is able to shape a non-alternative picture of the world.

  Nowadays, not only does the Russian government wage a war in Ukraine, but it also works hard on shaping the information reality using propaganda narratives.

  This project is the data and art research how propaganda narratives are reproduced in the Russian-language digital media in the closed space of destroyed media freedom.
    </v-container>
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
  align-content: center
  justify-content: flex-start
  align-items: center
.intro
  width: 80%
  margin-left: 85px

</style>
