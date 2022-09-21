<template>
  <v-container fluid class="home ma-0 pa-0">

  </v-container>
</template>

<script>
import Vue from 'vue'
import WordCloud from '../components/WordCloud.vue'
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
  justify-content: flex-end
  width: 100vw
  position: relative

</style>
