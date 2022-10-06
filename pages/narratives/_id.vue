<template>
  <v-container fluid class="narrative ma-0 pa-0">
    <div class="narrative_title">
      <h1 class="narrative_title_name">
        {{ getNarrativeName }}
      </h1>
    </div>
    <WordCloud
      keep-alive
      class="wordcloud"
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
          :class="{ active: currStepIndex === index }"
          :key="index"
          >{{ index }}</v-timeline-item
        >
      </v-timeline>
    </div>
    <transition :name="getBackgroundTransition">
      <div
        class="background"
        v-if="
          currentBackgroundToShow &&
          currentBackgroundToShow.component !== 'WordCloud'
        "
      >
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
    this.currentNarrative = narratives.find((narrative) => {
      return narrative?.slug === $nuxt.$route.params.id
    })
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
    window.mobileCheck = function () {
      let check = false
      ;(function (a) {
        if (
          /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
            a
          ) ||
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            a.substr(0, 4)
          )
        )
          check = true
      })(navigator.userAgent || navigator.vendor || window.opera)
      return check
    }

    this.isMobile = window.mobileCheck()

    window.scrollTo(0, 0)
    this.currStepIndex = -1
    this.startBackgroundScroll = window.scrollY
    this.lastEnterBackgroundDirection = 'down'
    this.lastDirection = 'down'

    this.backgroundAnimation = requestAnimationFrame(this.backgroundLoop)
    this.currentBackgroundScroll = window.scrollY
    process.nextTick(() => {
      window.dispatchEvent(new Event('resize'))
      if (this.currentBackground) {
        // in case theres background at step
        this.currentBackgroundToShow = this.currentBackground
        this.lastBackground = this.currentBackgroundToShow
        window.dispatchEvent(new Event('resize'))
      }
    })
    setTimeout(() => {
      this.isLoaded = true
      this.currStepIndex = 0
      process.nextTick(() => {
        window.dispatchEvent(new Event('resize'))
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
      isMobile: false,
      backgroundContainer: null,
      currentNarrative: {},
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
    getNarrativeName() {
      console.log(' this.currentNarrative?.name', this.currentNarrative?.name)
      return this.currentNarrative?.name
    },
    narrativeSteps() {
      if (!process.browser) {
        return []
      }
      return this.steps.filter(
        (step) => step.narrative === parseInt(this.currentNarrative.id)
      )
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
    onProgress(val) {
      this.currStepProgress = val.progress
    },
    stepEnterHandler({ element, index, direction }) {
      if (!this.isLoaded) {
        return
      }
      this.currStepIndex = parseInt(element.dataset.stepNo)
      if (this.lastEnterBackgroundDirection !== 'jump') {
        this.lastEnterBackgroundDirection = direction
        this.startBackgroundScroll = window.scrollY
      }
      this.lastDirection = direction
      window.dispatchEvent(new Event('resize'))
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
    onClickTimeline(index) {
      this.lastEnterBackgroundDirection = 'jump'
      console.log('index', index)
      const margin = 100
      const pixels = index * (window.innerHeight + margin)
      scrollTo(0, pixels)
      process.nextTick(() => {
        this.startBackgroundScroll = pixels - window.innerHeight / 2
        window.dispatchEvent(new Event('resize'))
        setTimeout(() => {
          this.lastEnterBackgroundDirection = 'down'
        }, 250)
      })
    },
    backgroundLoop() {
      if (this.currentBackgroundToShow) {
        this.backgroundContainer = document.querySelector(
          '.background_container'
        )
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
          const currOrder = parseInt(
            this.narrativeSteps[this.currStepIndex].order
          )

          let translateY = top - this.currentBackgroundScroll
          if (currOrder === 1 && this.startBackgroundScroll === 0) {
            translateY = translateY - (window.innerHeight / 2 - 64) // 64 is topbar height
          }
          translateY = translateY

          if (oneStepBackground) {
            this.backgroundContainer.style.setProperty(
              'transform',
              `translateY(${translateY}px)`,
              'important'
            )
          } else {
            if (
              this.currStepProgress < 0.5 &&
              this.currentBackground.stepstart === currOrder
            ) {
              this.backgroundContainer.style.setProperty(
                'transform',
                `translateY(${translateY}px)`,
                'important'
              )
            } else if (
              this.currStepProgress > 0.5 &&
              this.currentBackground.stepend === currOrder
            ) {
              this.backgroundContainer.style.setProperty(
                'transform',
                `translateY(${translateY}px)`,
                'important'
              )
            }
          }
        }
      }
      this.backgroundAnimation = requestAnimationFrame(this.backgroundLoop)
    }
  },
  watch: {
    currStepIndex(index) {
      let back = null
      if (!this.currStepObj) {
        this.currentBackground = null
        return
      }
      const currOrder = parseInt(this.narrativeSteps[this.currStepIndex].order)
      back = this.backgrounds.find((item) => {
        if (
          currOrder >= item.stepstart &&
          currOrder <= item.stepend &&
          parseInt(item.narrative) === parseInt(this.currentNarrative?.id)
        ) {
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
  &_title
    pointer-events: none
    position: sticky
    top: 35px
    left: 0
    width: 100vw
    height: 200px
    margin-top: 100px
    z-index: 15
    @media only screen and (max-width: 480px)
      font-size: 20px
      top: 50px
    &_name
      display: flex
      justify-content: center
      position: absolute
      width: 100vw
      left: 0
      color: black
      font-family: Space Mono
      font-weight: 400
      font-size: 24px
      text-transform: uppercase
      @media only screen and (max-width: 480px)
        padding: 0px 50px 0px 50px !important
        text-align: center

.timeline
  position: fixed
  left: 0px
  top: 0px
  height: 100vh
  width: 50px
  display: flex
  z-index: 10
  @media only screen and (max-width: 480px)
    left: -25px

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
  @media only screen and (max-width: 480px)
    width: 100% !important
    left: 0 !important
    margin-top: 50% // check
    padding: 0px 50px 0px 50px
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
  @media only screen and (max-width: 480px)

.step
  width: fit-content
  background-color: transparent
  display: flex
  align-items: center
  justify-content: center
  margin-bottom: 100px
  z-index: 2
  will-change: transform
  @media only screen and (max-width: 480px)


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
  @media only screen and (max-width: 480px)
    width: 100vw !important
    left: 0
.background_container
  display: flex
  justify-content: center
  align-items: center
  height: fit-content
  width: 85%
  margin-bottom: 0px
  position: relative
  z-index: 1
  @media only screen and (max-width: 480px)
    width: 100% !important

.wordcloud
  position: fixed
  height: 100vh
  top: 0
  width: 100vw
  z-index: 0
  background-color: transparent
</style>
