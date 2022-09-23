<template>
  <v-container fluid class="narrative ma-0 pa-0">
      <WordCloud
        keep-alive
        class='wordcloud'
        :step="currStepObj"
        :currentStepIndex="currStepIndex"
        :progress="getStepProgress(currStepIndex)" 
        :background="currentBackground"
        />
    <transition :name="getBackgroundTransition">
      <div class="background" v-if="currentBackgroundToShow && currentBackgroundToShow.component !== 'WordCloud'">
          <NuxtDynamic
            class="background_container"
            :component="currentBackgroundToShow.component"
            :background="currentBackgroundToShow"
            :step="currStepObj"
            :currentStepIndex="currStepIndex"
            :progress="getStepProgress(currStepIndex)"
          />
      </div>
    </transition>
    <div class="side">
      <Scrollama
        class="scrollama"
        :debug="false"
        :threshold="1"
        @step-enter="stepEnterHandler"
        @step-exit="stepExitHandler"
        @step-progress="({ progress }) => (currStepProgress = progress)"
      >
        <div
          v-for="(step, index) in currenteSteps"
          :key="step.uuid"
          class="step"
          :data-step-no="index"
          :class="{ active: index == currStepIndex }"
        >
          <LazyNuxtDynamic
            :component="step.component"
            :step="step"
            :currentStepIndex="currStepIndex"
            :progress="getStepProgress(index)"
          />
        </div>
      </Scrollama>
    </div>
  </v-container>
</template>

<script>
import Vue from 'vue'
import throttle from 'lodash/throttle'
import { narratives } from '@/utils/constants.js'

export default {
  head() {
    return {
      // script: [{ src: 'https://unpkg.com/aframe/dist/aframe-master.min.js' }]
    }
  },
  components: {
    // WordCloud: process.browser ? () => import('@/layouts/WordCloud.vue') : null
  },
  beforeMount() {
    this.currentNarrative = narratives.find((narrative) => { return narrative?.slug === $nuxt.$route.params.id })?.id
    if (!this.currentNarrative) {
      console.error('narrative not found!', $nuxt.$route.params.id)
    }
    // check if each step components exist, if not set to load default
    this.steps.forEach((step) => {
      let componentExists = step.component in Vue.options.components
      if (!componentExists) {
        step.component = 'DefaultComponent'
      }
    })
  },
  mounted() {
      this.currStepIndex = 0
      this.startBackgroundScroll = window.scrollY
      this.lastEnterBackgroundDirection = 'down'
      this.lastDirection = 'down'
      console.log('this.currentBackground', this.currentBackground)

    this.backgroundAnimation = requestAnimationFrame(this.backgroundLoop)
    this.currentBackgroundScroll = window.scrollY
    process.nextTick(() => {
      if (this.currentBackground) {
      // in case theres background at step
      this.currentBackgroundToShow = this.currentBackground
      this.lastBackground = this.currentBackgroundToShow
    }
    })
    setTimeout(() => {
      this.isLoaded = true
      this.currStepIndex = 0
    }, 20)
    //window.addEventListener('scroll', throttle(callback, 1000));
  },
  beforeDestroy() {
    cancelAnimationFrame(this.backgroundAnimation)
  },
  activated() {},
  updated() {},
  data() {
    return {
      backgroundContainer: null,
      currentNarrative: 0,
      currStepIndex: -1,
      currStepProgress: 0.01,
      backgroundAnimation: null,
      startBackgroundScroll: 0,
      currentBackgroundScroll: 0,
      isLoaded: false,
      lastEnterBackgroundDirection: 'down',
      lastDirection: 'down',
      currentBackgroundToShow: null,
      currentBackground: null,
      lastBackground: null
    }
  },
  computed: {
    currenteSteps () {
      if (!process.browser) {
        return []
      }
      return this.steps.filter((step) => step.narrative === parseInt(this.currentNarrative))
    },
    currStepObj() {
      return this.steps[this.currStepIndex]
    },
    getBackgroundTransition() {
      if (this.lastDirection === 'down') {
        return 'slide-fade-down'
      }
      return 'slide-fade-up'
    }
  },
  async asyncData({ $content, params, error }) {
    let steps
    let backgrounds
    try {
      // steps = await $content('steps').only(['name', 'slug']).sortBy('name').fetch()
      steps = await $content('steps').sortBy('order').fetch()
      backgrounds = await $content('backgrounds').fetch()
      console.log(steps)

    } catch (e) {
      error({ message: 'error retrieveing content' })
    }
    return {
      steps,
      backgrounds
    }
  },
  methods: {
    stepEnterHandler({ element, index, direction }) {
      if (!this.isLoaded) {
        return
      }
      this.currStepIndex = parseInt(element.dataset.stepNo)
      process.nextTick(() => {

        if (this.currentBackground) {
          this.startBackgroundScroll = window.scrollY
        }
        this.lastEnterBackgroundDirection = direction
        this.lastDirection = direction
        console.log('this.currentBackground', this.currentBackground)
      })
    },
    stepExitHandler({ element, index, direction }) {
      this.lastDirection = direction
    },
    getStepProgress(step) {
      const curStepNum = this.currStepIndex
      if (step === curStepNum) {
        return this.currStepProgress
      }
      if (step < curStepNum) {
        return 1
      }
      if (step > curStepNum) {
        return 0
      }
    },
    backgroundLoop() {
      if (this.currentBackgroundToShow) {
        if (!this.backgroundContainer) {
          this.backgroundContainer = document.querySelector('.background_container')
        }
        if (this.backgroundContainer) {
          let oneStepBackground = true
          if (
            this.currentBackground.stepend - this.currentBackground.stepstart >
            0
          ) {
            oneStepBackground = false
          }
          let top = window.innerHeight / 2
          this.currentBackgroundScroll =
            window.scrollY - this.startBackgroundScroll
          if (this.lastEnterBackgroundDirection === 'up') {
            top = -window.innerHeight / 2
          }
          const currOrder = parseInt(this.steps[this.currStepIndex].order)

          let translateY = top - this.currentBackgroundScroll
          if (currOrder === 1 && this.startBackgroundScroll === 0) {
            translateY = translateY - (window.innerHeight / 2 - 64) // 64 is topbar height
          }
          if (oneStepBackground) {
            this.backgroundContainer.style.transform = `translateY(${translateY}px)`
          } else {
            if (
              this.currStepProgress < 0.5 &&
              this.currentBackground.stepstart === currOrder
            ) {
              this.backgroundContainer.style.transform = `translateY(${translateY}px)`
            }
            if (
              this.currStepProgress > 0.5 &&
              this.currentBackground.stepend === currOrder
            ) {
              this.backgroundContainer.style.transform = `translateY(${translateY}px)`
            }
          }
        }
      }
      this.backgroundAnimation = requestAnimationFrame(this.backgroundLoop)
    }
  },
  watch: {
    currStepIndex (index) {
      let back = null
      if (!this.currStepObj) {
        this.currentBackground = null
        return
      }
      const currOrder = this.steps[this.currStepIndex].order
      console.log('currOrder', currOrder)
      back = this.backgrounds.find((item) => {
        if (currOrder >= item.stepstart && currOrder <= item.stepend) {
          return item
        }
      })
      this.currentBackground = back
    },
    currentBackground(value) {
      if (!value) {
        this.currentBackgroundToShow = null
        return
      }
      if (!this.lastBackground || value.uuid !== this.lastBackground.uuid) {
        this.currentBackgroundToShow = null
        this.lastBackground = value
        process.nextTick(() => {
          this.currentBackgroundToShow = value
        })
      } else {
        this.currentBackgroundToShow = value
      }
    }
  }
}
</script>
<style lang="sass">
.scrollama__debug-offset
  border-top: 2px dashed red !important
</style>

<style lang="sass" scoped>

.narrative
  height: 100%
  display: flex
  justify-content: flex-end
  width: 100vw
  position: relative

.side
  display: flex
  width: 25vw !important
  align-self: flex-end
  padding: 0px 27px 0px 27px
  z-index: 2

.scrollama
  flex: 1
  will-change: true

.scrollama__steps
  width: 100%
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  z-index: 2

.step
  width: fit-content
  background-color: transparent
  display: flex
  align-items: center
  justify-content: center
  margin-bottom: 100px
  z-index: 2
.step:last-child
  margin-bottom: 500px !important
// .step.active

.background
  height: 100vh
  width: 75vw
  position: fixed
  left: 0
  top: 0
  display: flex
  justify-content: center
  align-items: center
  z-index: 1

.background_container
  display: flex
  justify-content: center
  align-items: center
  height: fit-content
  width: 85%
  margin-bottom: 0px
  position: relative
  z-index: 1

.wordcloud
  position: fixed
  height: 100vh
  top: 0
  width: 100vw
  z-index: 0
  background-color: transparent
</style>
