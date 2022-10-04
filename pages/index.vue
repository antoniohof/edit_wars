<template>
  <v-container fluid class="home ma-0 pa-0">
    <v-container fluid class="intro pa-0">
      <div class="intro-background"></div>
      <div class="intro-title">EDIT WARS</div>
    </v-container>
    <div class="arrow" @click="onClickArrow">
      <img src="~/assets/icons/arrow.svg" />
    </div>
  </v-container>
</template>

<script>
import Vue from 'vue'
import throttle from 'lodash/throttle'
import SpriteText from 'three-spritetext'
import * as THREE from 'three'
import { request } from 'http'
export default {
  scrollToTop: true,
  head() {
    return {
      // script: [{ src: 'https://unpkg.com/aframe/dist/aframe-master.min.js' }]
    }
  },
  components: {},
  beforeMount() {},
  mounted() {
    let ForceGraph3D
    if (window) {
      ForceGraph3D = require('3d-force-graph').default
    } else {
      return
    }
    const el = document.querySelector('.intro-background')
    const g = ForceGraph3D()(el)

    const N = 30
    const gData = {
      nodes: [...Array(N).keys()].map((i) => ({ id: i })),
      links: [...Array(N).keys()]
        .filter((id) => id)
        .map((id) => ({
          source: id,
          target: Math.round(Math.random() * (id - 1))
        }))
    }

    g.graphData(gData)
      .backgroundColor('rgba(0,0,0,0)')
      .nodeLabel('id')
      .linkWidth(0.5)
      .showNavInfo(false)
      .numDimensions(3)
      .linkOpacity(1.0)
      .onNodeClick(this.onNodeClick)
      .nodeThreeObject((node) => {
        const group = new THREE.Group()
        if (node.id > 0) {
          console.log(group)
          const geometry = new THREE.SphereGeometry(5, 64, 64)
          const material = new THREE.MeshBasicMaterial({ color: 0x000000 })
          const sphere = new THREE.Mesh(geometry, material)
          const sprite = new SpriteText(node.label)
          sprite.fontFace = 'Space Mono'
          sprite.material.depthWrite = false // make sprite background transparent
          sprite.color = node.color
          sprite.textHeight = 8
          group.add(sprite)
          sprite.position.set(0, 10, 0)
          group.add(sphere)
        }
        console.log(g.d3Force('charge'))

        return group
      })
    let distance = 500
    g.d3Force('charge').strength(-35)
    // camera orbit
    let angle = 0
    const step = () => {
      g.cameraPosition({
        x: distance * Math.sin(angle),
        z: distance * Math.cos(angle)
      })
      angle += Math.PI / 1000
      this.animation = requestAnimationFrame(step)
    }

    this.animation = requestAnimationFrame(step)
  },
  beforeDestroy() {
    cancelAnimationFrame(this.animation)
  },
  activated() {},
  updated() {},
  data() {
    return {
      animation: null
    }
  },
  computed: {},
  components: {},
  async asyncData({ $content, params, error }) {},
  methods: {
    onClickArrow() {
      window.scrollTo({
        top: window.innerHeight,
        left: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style lang="sass" scoped>

.home
  height: 200vh
  display: flex
  width: 100vw
  color: black
  position: relative
  font-family: Space Mono !important
  font-size: 32px !important
  align-content: flex-start
  justify-content: flex-start
  align-items: flex-start
  overflow-y: hidden !important

.intro
  height: calc(100vh - 128px)
  margin: 0px 62px 0px 62px
  display: flex
  justify-content: center

.intro-background
  position: fixed
  pointer-events: none
  top: 0
  width: 100vw
  height: 100vh
  z-index: 0
.intro-title
  z-index: 1
  width: 100%
  font-size: 16vw
  font-weight: 700
  white-space: nowrap
  font-family: Space Mono
  text-align: center
  display: flex
  justify-content: center
  align-content: center
  align-items: center

.arrow
  position: fixed
  width: 100%
  height: 50px
  bottom: 0
  width: 100%
  margin: 0 auto
  height: 100px
  justify-content: center
  display: flex
  cursor: pointer
  bottom: 0
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.4) 100%)
</style>
