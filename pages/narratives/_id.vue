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
        <div class="timeline">
          <v-timeline dense>
            <v-timeline-item 
            small 
            fill-dot             
            v-for="(step, index) in narrativeSteps"
            @click.native="onClickTimeline(index)"
            :class="{'active': currStepIndex === index}"
            :key="index">{{index}}</v-timeline-item>
           
          </v-timeline>
        </div>
    <transition :name="getBackgroundTransition">
      <div class="background" v-if="currentBackgroundToShow && currentBackgroundToShow.component !== 'WordCloud'">
          <NuxtDynamic
            class="background_container"
            :component="currentBackground.component"
            :background="currentBackground"
            keep-alive
            :step="currStepObj"
            :currentStepIndex="currStepIndex"
            :progress="getStepProgress(currStepIndex)"
          />
      </div>
    </transition>
    <div class="side">
      <client-only>
        <Scrollama
          class="scrollama"
          :debug="false"
          @step-enter="stepEnterHandler"
          v-if="narrativeSteps.length > 0"
          @step-exit="stepExitHandler"
          @step-progress="onProgress"
        >
          <div
            v-for="(step, index) in narrativeSteps"
            :key="step.uuid"
            class="step"
            :data-step-no="index"
          >
            <NuxtDynamic
              class="step-child"
              :component="step.component"
              :step="step"
              :currentStepIndex="currStepIndex"
              :progress="getStepProgress(index)"
            />
          </div>
        </Scrollama>
      </client-only>
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
  scrollToTop: true,
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
      window.scrollTo(0,0)
      this.currStepIndex = -1
      this.startBackgroundScroll = window.scrollY
      this.lastEnterBackgroundDirection = 'down'
      this.lastDirection = 'down'

    this.backgroundAnimation = requestAnimationFrame(this.backgroundLoop)
    this.currentBackgroundScroll = window.scrollY
    process.nextTick(() => {
      window.dispatchEvent(new Event('resize'));
      if (this.currentBackground) {
        // in case theres background at step
        this.currentBackgroundToShow = this.currentBackground
        this.lastBackground = this.currentBackgroundToShow
        window.dispatchEvent(new Event('resize'));
      }
    })
    setTimeout(() => {
      this.isLoaded = true
      this.currStepIndex = 0
      process.nextTick(() => {
        window.dispatchEvent(new Event('resize'));
      })
    }, 250)
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
      currStepProgress: 0,
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
    narrativeSteps () {
      if (!process.browser) {
        return []
      }
      return this.steps.filter((step) => step.narrative === parseInt(this.currentNarrative))
    },
    currStepObj() {
      return this.narrativeSteps[this.currStepIndex]
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

    } catch (e) {
      error({ message: 'error retrieveing content' })
    }
    return {
      steps,
      backgrounds
    }
  },
  methods: {
    onProgress (val) {
      this.currStepProgress = val.progress
    },
    stepEnterHandler({ element, index, direction }) {
      if (!this.isLoaded) {
        return
      }
      this.currStepIndex = parseInt(element.dataset.stepNo)
      if (this.lastEnterBackgroundDirection !== "jump") {
        this.lastEnterBackgroundDirection = direction
        this.startBackgroundScroll = window.scrollY
      }
      this.lastDirection = direction
      window.dispatchEvent(new Event('resize'));
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
    onClickTimeline (index) {
      this.lastEnterBackgroundDirection = "jump"
      console.log('index', index)
      const margin = 100
      const pixels = (index * (window.innerHeight + margin))
      scrollTo(0, pixels)
      process.nextTick(() => {
        this.startBackgroundScroll = (pixels - window.innerHeight/2)
        window.dispatchEvent(new Event('resize'))
        setTimeout(() => {
          this.lastEnterBackgroundDirection = "down"
        }, 250)
      })
    },
    backgroundLoop() {
      if (this.currentBackgroundToShow) {
        this.backgroundContainer = document.querySelector('.background_container')
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
          const currOrder = parseInt(this.narrativeSteps[this.currStepIndex].order)

          let translateY = top - this.currentBackgroundScroll
          if (currOrder === 1 && this.startBackgroundScroll === 0) {
            translateY = translateY - (window.innerHeight / 2 - 64) // 64 is topbar height
          }
          translateY = translateY

          if (oneStepBackground) {
            this.backgroundContainer.style.setProperty('transform', `translateY(${translateY}px)`, 'important');
          } else {
            if (
              this.currStepProgress < 0.5 &&
              this.currentBackground.stepstart === currOrder
            ) {
              this.backgroundContainer.style.setProperty('transform', `translateY(${translateY}px)`, 'important');
            }
            else if (
              this.currStepProgress > 0.5 &&
              this.currentBackground.stepend === currOrder
            ) {
              this.backgroundContainer.style.setProperty('transform', `translateY(${translateY}px)`, 'important');
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
      const currOrder = parseInt(this.narrativeSteps[this.currStepIndex].order)
      back = this.backgrounds.find((item) => {
        if (currOrder >= item.stepstart && currOrder <= item.stepend && parseInt(item.narrative) === parseInt(this.currentNarrative)) {
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


.v-timeline-item__body
  color: white
  cursor: pointer
  font-size: 13px
  font-family: Space Mono
  position: absolute
  left: 48px
  display: flex
  justify-content: center
  margin-top: 2px
  z-index: 10
.v-timeline-item__inner-dot
  opacity: 0.35
  cursor: pointer

.v-timeline-item__dot 
  box-shadow: none !important
</style>

<style lang="sass" scoped>

.narrative
  height: 100%
  display: flex
  justify-content: flex-end
  width: 100vw
  position: relative

.timeline
  position: fixed
  left: 0px
  top: 0px
  height: 100vh
  width: 50px
  display: flex
  z-index: 10

.v-timeline
  display: flex
  justify-content: center
  flex-direction: column

.v-timeline::before
  bottom: 0
  content: ""
  height: 100%
  position: absolute
  top: 0
  width: 0px

.v-timeline-item
  flex-direction: row !important
  padding-bottom: 14px !important
  z-index: 12
  &.active
    :deep(.v-timeline-item__dot)
      background: black !important
      cursor: pointer
      box-shadow: 0px !important

.side
  display: flex
  width: 25vw !important
  align-self: flex-end
  padding: 0px 27px 0px 27px
  z-index: 2

.scrollama
  flex: 1
  will-change: transform

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
  will-change: transform
.step:last-child
// .step.active

.step-child
  will-change: transform

.background
  height: 100vh
  width: 75vw
  position: fixed
  left: 30px
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
