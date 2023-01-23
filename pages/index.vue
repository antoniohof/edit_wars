<template>
  <v-container fluid class="home ma-0 pa-0">
    <transition name="fadelongo">
      <h3 v-show="showName && !isScrolled" id="announcements">Propaganda Narrative Soundscapes exhibition, February 2 – Vernissage, 7-11 pm, February 3-4 – Main program, 5-9 pm, Feb 5 – Finissage & Discussion, 5-9 pm, tor 40, Beim Handelsmuseum (Güterbahnhof), 28195 Bremen</h3>
    </transition>
    <v-container fluid class="intro pa-0">
      <div  class="intro-background">
      </div>
      <div class="intro-header">
        <transition name="fadelongo">
          <h1 v-show="showName" class="intro-title">EDIT WARS</h1>
        </transition>
        <transition name="fadelongo">
          <h2 v-show="showName && !isScrolled" class="intro-subtitle">Deconstructing Russian Propaganda Narratives</h2>
        </transition>
      </div>
    </v-container>
    <client-only>
      <vue-typer
        :type-delay="10"
        :repeat="0"
        :text="getTextToShow"
        :erase-on-complete="false"
        class="intro-text"
        v-if="isScrolled"
      >
      </vue-typer>
    </client-only>
    <transition name="fade">
      <div class="arrow" v-show="!isScrolled || endScroll" @click="onClickArrow">
        <div class="adjuster">
          <img src="~/assets/icons/arrow.svg" />
        </div>
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
import { getIsMobile } from '@/utils/index.js'

export default {
  scrollToTop: true,
  head: {
    title: 'Edit Wars',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Deconstructing Russian Propaganda Narratives'
      }
    ]
  },
  components: {},
  beforeMount() {},
  mounted() {
    EventBus.$emit('introfirst')
    window.scrollTo(0, 0)
    setTimeout(() => {
      this.showName = true
    }, 700)
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('touchmove', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('touchmove', this.handleScroll)

    // window.removeEventListener( 'resize', this.onWindowResize );

    cancelAnimationFrame(this.animation)
  },
  activated() {},
  updated() {},
  data() {
    return {
      g: null,
      animation: null,
      isScrolled: false,
      endScroll: false,
      showName: false
    }
  },
  computed: {
    getTextToShow () {
      return getIsMobile() ? this.getTextMobile : this.getText
    },
    getText() {
      return 'The monopoly on information is a key propaganda tool. \nUsing it, a state is able to shape a non-alternative \npicture of the world.\n \nNowadays, not only does the Russian government wage a war \nin Ukraine, but it also works hard on shaping the \ninformation reality using propaganda narratives. \n \nThis is a data and art research project showing how propaganda \nnarratives are reproduced in the Russian-language digital \nmedia in the closed space of destroyed media freedom.'
    },
    getTextMobile() {
      return 'The monopoly on \ninformation is a key \npropaganda tool. Using it, \na state is able to shape a \nnon-alternative picture of \nthe world. \n\nNowadays, not only does \nthe Russian government \nwage a war in Ukraine, but \nit also works hard on \nshaping the information \nreality using propaganda \nnarratives. \n \nThis is a data and art \nresearch project showing how \npropaganda narratives are \nreproduced in the Russian-\nlanguage digital media in \nthe closed space of \ndestroyed media freedom.'
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
      if (window.scrollY > (window.innerHeight - 200)) {
        this.endScroll = true
      } else {
        this.endScroll = false
      }
      const text = document.querySelector('.intro-title')
      const percentage = window.scrollY / window.innerHeight
      const x = percentage * window.innerWidth
      text.style.transform = `translateX(${-x}px)`
    },
    onClickArrow() {
      if (this.endScroll) {
        this.$router.push({ path: '/narratives'})
      } else {
        window.scrollTo({
          top: window.innerHeight,
          left: 0,
          behavior: 'smooth'
        })
      }
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
  @media only screen and (max-width: 480px)
    height: 188vh

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
  z-index: 20
  width: 100%
  pointer-events: none
  position: relative
  height: 16vw
  font-size: 16vw
  font-weight: 700
  user-select: none
  white-space: nowrap
  font-family: Space Mono
  text-align: center
  display: flex
  justify-content: center
  align-content: center
  align-items: center
  @media only screen and (max-width: 480px)
    margin-top: 64px

.intro-header
  display: flex
  align-items: center
  flex-direction: column
  margin-top: -128px
  justify-content: center
.intro-subtitle
  z-index: 5000 !important
  width: 100%
  pointer-events: none
  position: relative
  font-size: 2.5vw
  font-weight: 300
  user-select: none
  white-space: nowrap
  font-family: Space Mono
  text-transform: uppercase
  text-align: center
  display: flex
  justify-content: center
  align-content: center
  transition: transform 0.5s ease
  align-items: center
  @media only screen and (max-width: 480px)
    font-size: 3vw


.intro-text
  height: fit-content
  font-family: Space Mono !important
  font-size: 2vw
  padding: 0px 64px 0px 64px
  z-index: 101
  width: 100%
  color: black
  @media only screen and (max-width: 480px)
    padding: 0px 26px 0px 26px
    font-size: 4.7vw
    margin-top: 50px
    margin-bottom: 100px

#announcements
  position: fixed
  color: black
  top: 0
  z-index: 999
  animation: animate 30s linear infinite
  font-family: Space Mono
  text-transform: uppercase
  color: #27AEEF
  font-size: 1.5vw
  font-weight: 300
  white-space: pre
  @media only screen and (max-width: 480px)
    font-size: 4vw

@keyframes animate
  0%
    transform: translateX(100vw)
  100%
    transform: translateX(-100%)
</style>
