<template>
  <div class="wordcloud-page ma-0 pa-0" :class="{'hide': fadeCloud }">
  </div>
</template>

<script>
import StepMixin from "@/mixins/StepMixin.js";
import { narratives } from '@/utils/constants.js'
import SpriteText from 'three-spritetext';
import * as THREE from 'three'

export default {
  mixins: [StepMixin],
  props: {
    background: {
          type: Object
      }
  },
  static () {
    return {
      ForceGraph3D: null,
      g: null
    }
  },
  data() {
    return {
      lastBackground: ""
    }
  },
  mounted () {
    console.log(THREE.REVISION)
    this.ForceGraph3D = require('3d-force-graph').default

    this.setData(this.background)
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
    setData(background, data) {
      console.log('bg', background)
      if (!process.client || this.lastBackground === background?.name) {
      return
    }
    this.lastBackground = background?.name || ""
      const N = 10;
      const nodesToLoad = data?.nodes || [...Array(N).keys()].map(i => ({ id: i, label: "Testeca" }))
      const linksToLoad = data?.links || [...Array(N).keys()].filter(id => id).map(id => ({
            source: id,
            target: Math.round(Math.random() * (id-1)),
            color: 'rgba(0,0,0,1)'
          }))
      const el = document.querySelector('.wordcloud-page')
        if (!this.g) {
          this.g = this.ForceGraph3D({rendererConfig: {antialias: false, sortObjects: false}})(el)
        } 
        const gData = {
          nodes: nodesToLoad,
          links: linksToLoad
        };
        console.log("LEGNTH", gData.nodes.length)
        this.g.graphData(gData)
        .backgroundColor("#ffcccb")
        .linkWidth(1)
        //.linkCurvature(0.1)
        //.linkAutoColorBy(function (link) { return "#f542c8"})
        .linkOpacity(0.1)
        .linkColor(() => "#000000")
        // .forceEngine('ngraph')
        // .cooldownTicks(0) // Don't animate-in, jump to final state
        .nodeThreeObject(node => {
          const sprite = new SpriteText(node.id);
          sprite.fontFace = "roboto-mono";
          sprite.material.depthWrite = false; // make sprite background transparent
          sprite.color = node.color;
          sprite.textHeight = 2 + Math.min(20, parseInt(node.value));
          return sprite;
        });
      this.g.d3Force('charge').strength(-300);
    }
  },
  watch: {
    background(entity) {
      
      if (entity && entity.component === "WordCloud") {
        // let url = 'https://cdn.jsdelivr.net/gh/mneunomne/edit_wars_database/export/' + entity.name + '.json'
        let url = 'https://cdn.jsdelivr.net/gh/mneunomne/edit_wars_database/export/narratives_word_graphs/freezing_europe.json'
        fetch(url).then(response => response.json()).then(fetchedData => {
          // this.currentData = fetchedData
          console.log('loaded', fetchedData)
          this.setData(entity, fetchedData)
        })
      }
    }
  },
  beforeDestroy() {
  }
}
</script>

<style lang="sass">

.wordcloud-page
  display: flex
  background-color: white
  poitner-events: none
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

</style>
