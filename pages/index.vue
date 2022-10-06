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
    this.g = g
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

    window.addEventListener( 'resize', this.onWindowResize, false );
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener( 'resize', this.onWindowResize );

    cancelAnimationFrame(this.animation)
  },
  activated() {},
  updated() {},
  data() {
    return {
      g: null,
      animation: null,
      isScrolled: false,
      showName: false
    }
  },
  computed: {
    getText() {
      return 'The monopoly on information is a key propaganda tool. \nUsing it, a state is able to shape a non-alternative \npicture of the world.\n \nNowadays, not only does the Russian government wage a war \nin Ukraine, but it also works hard on shaping the \ninformation reality using propaganda narratives. \n \nThis is an data and art research project showing how propaganda \nnarratives are reproduced in the Russian-language digital \nmedia in the closed space of destroyed media freedom.'
    }
  },
  components: {},
  async asyncData({ $content, params, error }) {},
  methods: {
    onWindowResize () {
      this.g.width(window.innerWidth)
      this.g.height(window.innerHeight)
    },
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
  pointer-events: none
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
  width: 100vw
  height: 120px
  bottom: 0
  margin: 0 auto
  justify-content: center
  display: flex
  left: 0
  cursor: pointer
  bottom: 0
  background-image: url("/img/gradient.png")
  filter: drop-shadow(16px 16px 15px black)
  img
    animation: spin 4s linear infinite

@keyframes spin
  100%
    -webkit-transform: rotateY(360deg)
    transform: rotateY(360deg)
</style>
