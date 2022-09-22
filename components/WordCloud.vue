<template>
  <v-container class="wordcloud-page ma-0 pa-0" :class="{'hide': fadeCloud }" fluid>
  </v-container>
</template>

<script>
import StepMixin from "@/mixins/StepMixin.js";
import { narratives } from '@/utils/constants.js'
import SpriteText from 'three-spritetext';
import * as THREE from 'three'
export default {
  head: {
    title: 'Narratives',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Narratives Page'
      }
    ]
  },
  mixins: [StepMixin],
  props: {
    background: {
          type: Object
      }
  },
  data() {
    return {
      currentData: null
    }
  },
  mounted () {
    this.setData()
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
    setData(data) {
      const N = 10;
      const nodesToLoad = data?.nodes || [...Array(N).keys()].map(i => ({ id: i, label: "Testeca" }))
      const linksToLoad = data?.links || [...Array(N).keys()].filter(id => id).map(id => ({
            source: id,
            target: Math.round(Math.random() * (id-1)),
            color: 'rgba(0,0,0,1)'
          }))
      const el = document.querySelector('.wordcloud-page')
        const g = window.ForceGraph3D()(el)
        const gData = {
          nodes: nodesToLoad,
          links: linksToLoad
        };
    g.graphData(gData)
    .backgroundColor('rgba(0,0,0,0)')
    .nodeLabel('id')
    .linkWidth(1)
    .linkOpacity(1.0)
    .nodeAutoColorBy('group')
    // .onNodeClick(this.onNodeClick)
    .nodeThreeObject(node => {
      // const group = new THREE.Group()
        // const geometry = new THREE.SphereGeometry( 5, 64, 64 );
        // const material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
        // const sphere = new THREE.Mesh( geometry, material );
        const sprite = new SpriteText(node.en || node.label);
        sprite.fontFace = "roboto-mono";
        sprite.material.depthWrite = false; // make sprite background transparent
        sprite.color = node.color;        
        sprite.textHeight = 8;
        // group.add(sprite)
        sprite.position.set(0,10,0)
        // group.add(sphere)
        return sprite;
      });
    }
  },
  watch: {
    background(entity) {
      if (entity && entity.component === "WordCloud") {
        // let url = 'https://cdn.jsdelivr.net/gh/mneunomne/edit_wars_database/export/' + entity.name + '.json'
        let url = 'https://cdn.jsdelivr.net/gh/mneunomne/edit_wars_database/export/narratives_word_graphs/mythical_nazis.json'
        fetch(url).then(response => response.json()).then(fetchedData => {
          this.currentData = fetchedData
          console.log('loaded', fetchedData)
          this.setData(fetchedData)
        })
      }
    }
  },
  beforeDestroy() {
    console.log(window.ForceGraph3D)
  }
}
</script>

<style lang="sass">

.wordcloud-page
  z-index: -1
  pointer-events: none
  display: flex
  background-color: white
  flex-direction: column
  align-content: flex-start
  width: 100%
  margin-bottom: 200px
  color: black
  opacity: 0.8
  transition: opacity 0.4s ease
.hide
  opacity: 0.05 !important

</style>
