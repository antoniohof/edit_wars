<template>
<div class="wordcloud-page ma-0 pa-0" :class="{'hide': fadeCloud }">
    <iframe class="wordcloudiframe" v-if="currentUrl !== ''" :src="currentUrl" ></iframe>
</div>
</template>
  
<script>
  import StepMixin from "@/mixins/StepMixin.js";
  import { narratives } from '@/utils/constants.js'
  
  export default {
    mixins: [StepMixin],
    props: {
      background: {
            type: Object
        }
    },
    static () {
      return {
      }
    },
    data() {
      return {
        lastBackground: "",
        currentUrl: ""
      }
    },
    mounted () {
    },
    async asyncData({ $content }) {
  
    },
    computed: {
      fadeCloud () {
        return (!!this.background && this.background.component !== 'WordCloud')|| this.step.component === "TextCenter"
      }
    },
    components: {},
  
    methods: {
      setData(background, url) {
        console.log('bg', background)
        if (!process.client || this.lastBackground === background?.name || !url) {
        return
      }
      this.lastBackground = background?.name || ""
      this.currentUrl = url
          // this.g.resumeAnimation()
  
      }
    },
    watch: {
      background(entity) {
        if (entity && entity.component === "WordCloud") {
          // let url = 'https://cdn.jsdelivr.net/gh/mneunomne/edit_wars_database/export/' + entity.name + '.json'
            let url = 'https://mneunomne.github.io/edit_wars_database/force-graph/index.html?narrative=freezing_europe'
            // this.currentData = fetchedData
            this.setData(entity, url)
        }
      }
    },
    beforeDestroy() {

    }
  }
</script>
  
<style lang="sass">
.wordcloudiframe
  width: 100%
  height: 100%

.wordcloud-page
  display: flex
  background-color: white
  z-index: -1
  flex-direction: column
  align-content: flex-start
  width: 100%
  margin-bottom: 200px
  color: black
  opacity: 0.8
  transition: opacity 0.4s ease
  will-change: transform
  -webkit-transform: translateZ(0)
  -moz-transform: translateZ(0)
  -ms-transform: translateZ(0)
  -o-transform: translateZ(0)
  transform: translateZ(0)
.hide
  opacity: 0.05 !important
  pointer-events: none !important
  

  </style>
  