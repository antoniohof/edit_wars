<template>
  <v-container fluid class="home ma-0 pa-0">
    <v-container fluid class="intro pa-0">
      <div class="intro-background"></div>
      <transition name="fadelongo">
        <div v-show="showName" class="intro-title">EDIT WARS</div>
      </transition>
    </v-container>
    <client-only>
      <vue-typer
        :type-delay="20"
        :repeat="0"
        :text="getText"
        :erase-on-complete="false"
        class="intro-text"
        v-if="isScrolled"
      >
      </vue-typer>
    </client-only>
    <transition name="fade">
      <div class="arrow" v-show="!isScrolled" @click="onClickArrow">
        <img src="~/assets/icons/arrow.svg" />
      </div>
    </transition>
  </v-container>
</template>

<script>
import throttle from 'lodash/throttle'
import SpriteText from 'three-spritetext'
import * as THREE from 'three'
import { request } from 'http'
import EventBus from '@/utils/event-bus'

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
    window.scrollTo(0, 0)
    setTimeout(() => {
      this.showName = true
    }, 700)
    window.addEventListener('scroll', this.handleScroll)

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
        return group
      })
    let distance = 500
    g.d3Force('charge').strength(-85)

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
    window.removeEventListener('scroll', this.handleScroll)
    cancelAnimationFrame(this.animation)
  },
  activated() {},
  updated() {},
  data() {
    return {
      animation: null,
      isScrolled: false,
      showName: false
    }
  },
  computed: {
    getText() {
      return 'The monopoly on information is a key propaganda \ntool. Using it, a state is able to shape a \nnon-alternative picture of the world. Nowadays, not \nonly does the Russian government wage a war in \nUkraine, but it also works hard on shaping the \ninformation reality using propaganda narratives. \nThis is an data and art research project showing how \npropaganda narratives are reproduced in the \nRussian-language digital media in the closed space \nof destroyed media freedom.'
    }
  },
  components: {},
  async asyncData({ $content, params, error }) {},
  methods: {
    handleScroll() {
      if (window.scrollY > 100) {
        if (!this.isScrolled) {
          EventBus.$emit('introsecond')
        }
        this.isScrolled = true
      } else {
        if (this.isScrolled) {
          EventBus.$emit('introfirst')
        }
        this.isScrolled = false
      }
      const text = document.querySelector('.intro-title')
      const percentage = window.scrollY / window.innerHeight
      const x = percentage * window.innerWidth
      text.style.transform = `translateX(${-x}px)`
    },
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
  height: 175vh
  display: flex
  flex-direction: column
  width: 100vw
  color: black
  position: relative
  align-content: flex-start
  justify-content: flex-start
  align-items: flex-start
  overflow-y: hidden !important

.intro
  height: calc(100vh - 64px)
  margin: 0px
  display: flex
  flex-direction: column
  justify-content: center

.intro-background
  position: fixed
  pointer-events: none
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  z-index: 0
  opacity: 1.0
  transition: opacity 0.4s ease
.intro-title
  z-index: 1
  width: 100%
  margin-top: -64px
  position: relative
  font-size: 16vw
  font-weight: 700
  white-space: nowrap
  font-family: Space Mono
  text-align: center
  display: flex
  justify-content: center
  align-content: center
  align-items: center
  &:after
    content: none !important

.intro-text
  height: 75vh
  font-family: Space Mono !important
  font-size: 35px
  padding: 0px 64px 0px 64px
  z-index: 5
  color: black
  @media only screen and (max-width: 480px)
    padding: 0px 15px 0px 15px
    font-size: 22px

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
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 10%, rgba(0,0, 0,0.5) 100%)
</style>
