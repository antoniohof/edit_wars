<template>
  <v-container class="narratives-page ma-0 pa-0" fluid> </v-container>
</template>

<script>
import { narratives } from '@/utils/constants.js'
import SpriteText from 'three-spritetext'
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
  data() {
    return {}
  },
  scrollToTop: true,
  mounted() {
    let ForceGraph3D
    if (window) {
      ForceGraph3D = require('3d-force-graph').default
    } else {
      return
    }
    const el = document.querySelector('.narratives-page')
    const g = ForceGraph3D()(el)
    const N = 3
    const data = narratives.map((narrative) => ({
      id: narrative.id,
      label: narrative.name,
      path: narrative.slug
    }))
    const ds = data.filter((d) => !!d)
    // empty node to conect all
    ds.push({
      id: 0,
      label: '',
      path: ''
    })
    var links = ds.map((n) => ({
      source: 0,
      target: n.id,
      color: 'rgba(0,0,0,1)'
    }))

    const gData = {
      nodes: ds,
      links: links
    }
    g.graphData(gData)
      .backgroundColor('rgba(0,0,0,0)')
      .linkWidth(0.2)
      .showNavInfo(false)
      .numDimensions(2)
      .linkOpacity(1.0)
      .onNodeClick(this.onNodeClick)
      .nodeThreeObject((node) => {
        const group = new THREE.Group()
        if (node.id > 0) {
          const geometry = new THREE.SphereGeometry(5, 64, 64)
          const material = new THREE.MeshBasicMaterial({ color: 0x000000 })
          const sphere = new THREE.Mesh(geometry, material)
          sphere.scale.set(0.8, 0.8, 0.8)
          const sprite = new SpriteText(node.label.toUpperCase())
          sprite.fontFace = 'Space Mono Italic'
          sprite.material.depthWrite = false // make sprite background transparent
          sprite.color = node.color
          sprite.textHeight = 5
          group.add(sprite)

          sprite.position.set(0, 10, 0)
          group.add(sphere)
        }

        return group
      })
    g.d3Force('charge').strength(-1800)
  },
  async asyncData({ $content }) {},
  computed: {},
  components: {},

  methods: {
    onNodeClick(node) {
      this.$router.push({ path: '/narratives/' + node.path })
    }
  },
  watch: {},
  beforeDestroy() {}
}
</script>

<style lang="sass">
.narratives-page
  display: flex
  background-color: white
  flex-direction: column
  align-content: flex-start
  width: 100%
  margin-bottom: 200px
  color: black
</style>
