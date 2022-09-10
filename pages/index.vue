<template>
  <v-container fluid class="home ma-0 pa-0">
    <!--
      <v-container fluid class='wordcloud'>
        <WordCloud :currentStepIndex="currStep" :progress="getStepProgress(currStep)" :step="currStepObj"/>
      </v-container>
      -->
    <transition :name="getBackgroundTransition">
      <div class="background" v-if="currentBackgroundToShow">
        <keep-alive>
          <NuxtDynamic
            class="background_container"
            :component="currentBackground.component"
            :step="currentBackground"
            :currentStepIndex="currStep"
            :progress="getStepProgress(currStep)"
          />
        </keep-alive>
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
          v-for="(step, index) in steps"
          :key="step.uuid"
          class="step"
          :data-step-no="index"
          :class="{ active: index == currStep }"
        >
          <LazyNuxtDynamic
            :component="step.component"
            :step="step"
            :currentStepIndex="currStep"
            :progress="getStepProgress(index)"
          />
        </div>
      </Scrollama>
    </div>
  </v-container>
</template>

<script>
import Vue from 'vue'
import WordCloud from '../components/WordCloud.vue'
import throttle from 'lodash/throttle'

export default {
  head() {
    return {
      script: [{ src: 'https://unpkg.com/aframe/dist/aframe-master.min.js' }]
    }
  },
  components: {},
  beforeMount() {
    // check if each step components exist, if not set to load default
    this.steps.forEach((step) => {
      let componentExists = step.component in Vue.options.components
      if (!componentExists) {
        step.component = 'DefaultComponent'
      }
    })
  },
  mounted() {
    this.backgroundAnimation = requestAnimationFrame(this.backgroundLoop)
    if (this.currentBackground) {
      // in case theres background at step
      this.currentBackgroundToShow = this.currentBackground
      this.lastBackground = this.currentBackgroundToShow
    }

    //window.addEventListener('scroll', throttle(callback, 1000));
  },
  beforeDestroy() {
    cancelAnimationFrame(this.backgroundAnimation)
  },
  activated() {},
  updated() {},
  data() {
    return {
      currStep: 0,
      currStepProgress: 0,
      backgroundAnimation: null,
      startBackgroundScroll: 0,
      currentBackgroundScroll: 0,
      lastEnterBackgroundDirection: 'down',
      lastDirection: 'down',
      currentBackgroundToShow: null,
      lastBackground: null
    }
  },
  computed: {
    currStepObj() {
      return this.steps[this.currStep]
    },
    currentBackground() {
      let back = null
      if (!this.currStepObj) {
        return null
      }
      const currOrder = parseInt(this.steps[this.currStep].order)
      back = this.backgrounds.find((item) => {
        if (currOrder >= item.stepstart && currOrder <= item.stepend) {
          return item
        }
      })
      return back
    },
    getBackgroundTransition() {
      if (this.lastDirection === 'down') {
        return 'slide-fade-down'
      }
      return 'slide-fade-up'
    }
  },
  components: {
    WordCloud
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
    stepEnterHandler({ element, index, direction }) {
      this.currStep = parseInt(element.dataset.stepNo)
      if (this.currentBackground) {
        this.startBackgroundScroll = window.scrollY
      }
      this.lastEnterBackgroundDirection = direction
      this.lastDirection = direction
    },
    stepExitHandler({ element, index, direction }) {
      this.lastDirection = direction
    },
    getStepProgress(step) {
      const curStepNum = this.currStep
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
        let backgroundContainer = document.querySelector(
          '.background_container'
        )
        if (backgroundContainer) {
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
          const currOrder = parseInt(this.steps[this.currStep].order)

          let translateY = top - this.currentBackgroundScroll
          if (currOrder === 1 && this.startBackgroundScroll === 0) {
            translateY = translateY - (window.innerHeight / 2 - 64) // 64 is topbar height
          }
          if (oneStepBackground) {
            backgroundContainer.style.transform = `translateY(${translateY}px)`
          } else {
            if (
              this.currStepProgress < 0.5 &&
              this.currentBackground.stepstart === currOrder
            ) {
              backgroundContainer.style.transform = `translateY(${translateY}px)`
            }
            if (
              this.currStepProgress > 0.5 &&
              this.currentBackground.stepend === currOrder
            ) {
              backgroundContainer.style.transform = `translateY(${translateY}px)`
            }
          }
        }
      }
      this.backgroundAnimation = requestAnimationFrame(this.backgroundLoop)
    }
  },
  watch: {
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

.home
  height: 100%
  display: flex
  justify-content: flex-end
  width: 100vw
  position: relative

.side
  display: flex
  width: 30vw !important
  align-self: flex-end
  padding: 0px 20px 0px 20px
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
.step.active

.background
  height: 100vh
  width: 70vw
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
  width: fit-content
  margin-bottom: 0px
  position: relative
  z-index: 1

.wordcloud
  position: fixed
  height: 100vh
  width: 100vw
  z-index: 0
  background-color: transparent
</style>
