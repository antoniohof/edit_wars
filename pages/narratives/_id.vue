<template>
  <div>
    <transition name="fade">
      <Loading v-if="!isWordCloudLoaded" class="load-icon"></Loading>
    </transition>
    <transition name="fade">
      <v-container :class="{ loaded: isWordCloudLoaded }" v-show="isWordCloudLoaded" fluid class="narrative ma-0 pa-0">
        <div class="narrative_title">
          <div class="narrative_title_name italic">
            <h1>
              {{ getNarrativeName }}
            </h1>
          </div>
          <div class="narrative_title_name">
            <h1>
              {{ getNarrativeSubtitle }}
            </h1>
          </div>
        </div>
        <client-only>
          <WordCloud
            @click="closeInfo"
            class="wordcloud"
            :step="currStepObj"
            :forceFadeOut="forceFadeOutWordCloud"
            :currentStepIndex="currStepIndex"
            :progress="getStepProgress(currStepIndex)"
            :background="currentBackground"
          />
        </client-only>
        <!--
      <div class="timeline" v-if="showTimeline">
        <v-timeline dense>
          <v-timeline-item
            small
            fill-dot
            v-for="(n, index) in narrativesList"
            @click.native="onClickTimeline(index)"
            :class="{ active: currentNarrative.id === (index + 1), 'unclickable': n.disabled }"
            :key="index"
            >{{ index + 1 }}</v-timeline-item
          >
        </v-timeline>
      </div>
      -->
        <div v-if="!infoOpen" class="infobutton" @click="onClickOnInfo">
          <img src="~/assets/icons/info.svg" />
        </div>
        <div v-if="infoOpen" class="infosquare">
          <p>
            The network graph and diagrams depicts the result of N-gram language
            modelling analysis based on relevant Russian-language media
            headlines. Timeframe: 01.01.2022 – 31.07.2022. Data source:
            <u @click="onClickGdelt">GDELT</u>.
          </p>
        </div>
        <transition name="fade">
          <div
            class="background"
            v-if="
              !isSausage &&
              currentBackground &&
              currentBackground.component !== 'WordCloud'
            "
          >
            <client-only>
              <transition name="fade">
                <NuxtDynamic
                  class="background_container"
                  :component="currentBackground.component"
                  :background="currentBackground"
                  :step="currStepObj"
                  :currentStepIndex="currStepIndex"
                  :progress="getStepProgress(currStepIndex)"
                />
              </transition>
            </client-only>
          </div>
        </transition>
        <div class="side" v-if="!isSausage">
          <client-only>
            <Scrollama
              ref="scrollama"
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
        <div class="sausage_mobile" v-if="isSausage">
          <Scrollama
            ref="scrollama"
            class="scrollama_mobile"
            :debug="false"
            @step-enter="stepEnterHandler"
            v-if="narrativeSteps.length > 0"
            @step-exit="stepExitHandler"
            @step-progress="onProgress"
          >
            <div
              v-for="(step, index) in narrativeSteps"
              :key="step.uuid"
              class="step_mobile"
              :data-step-no="index"
            >
              <NuxtDynamic
                class="step-child_mobile"
                :component="step.component"
                :step="step"
                :currentStepIndex="currStepIndex"
                :progress="getStepProgress(index)"
              />
              <LazyNuxtDynamic
                class="step-child-background_mobile"
                v-if="step && getBackgroundOfStep(step.order).component != 'WordCloud'"
                :component="step && getBackgroundOfStep(step.order).component"
                :background="step && getBackgroundOfStep(step.order)"
                :step="currStepObj"
                keep-alive
                :currentStepIndex="currStepIndex"
                :progress="getStepProgress(currStepIndex)"
              />
              <div
                class="wordcloudhole"
                v-if="
                  step &&
                  getBackgroundOfStep(step.order).component === 'WordCloud'
                "
              ></div>
            </div>
          </Scrollama>
        </div>
        <div class="next" @click="onClickNext">
          <p>NEXT NARRATIVE</p>
        </div>
      </v-container>
    </transition>
  </div>
</template>

<script>
import Vue from "vue";
import { narratives } from "@/utils/constants.js";
import { getIsMobile } from "@/utils/index.js";

export default {
  head() {
    return {
      // script: [{ src: 'https://unpkg.com/aframe/dist/aframe-master.min.js' }]
    };
  },
  scrollToTop: true,
  components: {
    // WordCloud: process.browser ? () => import('@/layouts/WordCloud.vue') : null
  },
  beforeMount() {
    window.addEventListener("message", this.wordCloudLoaded);
    this.isSausage = window.innerWidth < 1200;
    this.currentNarrative = narratives.find((narrative) => {
      return narrative?.slug === $nuxt.$route.params.id;
    });
    if (!this.currentNarrative) {
      console.error("narrative not found!", $nuxt.$route.params.id);
    }
    // check if each step components exist, if not set to load default
    this.steps.forEach((step) => {
      let componentExists = step.component in Vue.options.components;
      if (!componentExists) {
        step.component = "DefaultComponent";
      }
    });
  },
  mounted() {
    this.backgroundContainer = document.querySelector(".background_container");
    this.narrativesList = narratives; //.filter((n) => !n.disabled)
    document.addEventListener("click", this.closeInfo);
    window.addEventListener('resize', () => {
      this.isSausage = window.innerWidth < 1200;
    })
    this.isMobile = getIsMobile() || window.innerWidth < 1200;

    if (this.isMobile) {
      this.showTimeline = false;
    }
    window.scrollTo(0, 0);
    this.currStepIndex = -1;
    this.startBackgroundScroll = window.scrollY;
    this.lastEnterBackgroundDirection = "down";
    this.lastDirection = "down";

    // this.backgroundAnimation = requestAnimationFrame(this.backgroundLoop);
    this.currentBackgroundScroll = window.scrollY;
    process.nextTick(() => {
      window.dispatchEvent(new Event("resize"));
      if (
        this.currentBackground &&
        this.currentBackground.component !== "WordCloud"
      ) {
        // in case theres background at step
        this.currentBackgroundToShow = this.currentBackground;
        this.lastBackground = this.currentBackgroundToShow;
        window.dispatchEvent(new Event("resize"));
      }
    });
    setTimeout(() => {
      console.log("scrollama", this.$refs.scrollama);
      this.isLoaded = true;
      this.currStepIndex = 0;
      process.nextTick(() => {
        window.dispatchEvent(new Event("resize"));
      });
    }, 250);
    // window.addEventListener('scroll', debounce(this.onEndScroll, 500));
  },
  beforeDestroy() {
    window.removeEventListener("message", this.wordCloudLoaded);
    document.removeEventListener("click", this.closeInfo);
    cancelAnimationFrame(this.backgroundAnimation);
  },
  activated() {},
  updated() {},
  data() {
    return {
      isSausage: false,
      showTimeline: true,
      infoOpen: false,
      isMobile: false,
      backgroundContainer: null,
      currentNarrative: {},
      currStepIndex: -1,
      currStepProgress: 0,
      narrativesList: [],
      backgroundAnimation: null,
      startBackgroundScroll: 0,
      currentBackgroundScroll: 0,
      isLoaded: false,
      lastEnterBackgroundDirection: "down",
      lastDirection: "down",
      currentBackgroundToShow: null,
      currentBackground: null,
      lastBackground: null,
      magneticCenter: false,
      animatingToStep: false,
      animateToStepTimeout: null,
      isWordCloudLoaded: false,
    };
  },
  computed: {
    forceFadeOutWordCloud() {
      return this.totalProgress > this.narrativeSteps.length - 0.5;
    },
    getNarrativeName() {
      return this.currentNarrative?.name;
    },
    getNarrativeSubtitle() {
      return this.currentNarrative?.subtitle;
    },
    narrativeSteps() {
      if (!process.browser) {
        return [];
      }
      return this.steps.filter((step) => step.narrative === parseInt(this.currentNarrative.id));
    },
    currStepObj() {
      return this.narrativeSteps[this.currStepIndex];
    },
    getBackgroundTransition() {
      if (this.lastDirection === "down") {
        return "slide-fade-down";
      }
      return "slide-fade-up";
    },
    totalProgress() {
      return this.currStepIndex + this.currStepProgress;
    },
  },
  async asyncData({ $content, params, error }) {
    let steps;
    let backgrounds;
    try {
      let n = narratives.find((narrative) => {
        return narrative?.slug === params.id;
      });
      const nameSteps = `${n?.id}/steps`;
      const nameBgs = `${n?.id}/backgrounds`;
      steps = await $content(nameSteps).sortBy("order").fetch();
      backgrounds = await $content(nameBgs).fetch();
    } catch (e) {
      error({ message: "error retrieving content" });
    }
    return {
      steps,
      backgrounds,
    };
  },
  methods: {
    wordCloudLoaded(e) {
      console.log("wordCloudLoaded! 2");
      this.isWordCloudLoaded = true;
    },
    onEndScroll() {
      if (this.isMobile) {
        return;
      }
      if (!this.animatingToStep) {
        clearTimeout(this.animateToStepTimeout);
        const index = this.currStepIndex;
        const percentage = index / this.narrativeSteps.length;
        const side = document.querySelector(".side");
        if (!side) {
          clearTimeout(this.animateToStepTimeout);
          return;
        }
        const totalHeight = side.clientHeight - 64;
        const added = this.narrativeSteps.length * 13 * -1;
        const pixels = percentage * (totalHeight + added);
        this.animatingToStep = true;
        window.scroll({
          top: pixels,
          left: 0,
          behavior: "smooth",
        });
        this.animateToStepTimeout = setTimeout(() => {
          console.log("ended animate to step");
          this.animatingToStep = false;
        }, 1000);
      }
    },
    isLastNarrative() {
      if (!this.narrativesList || !this.isLoaded) {
        return false;
      }
      const validNarratives = this.narrativesList.filter((n) => !n.disabled);
      const lastId = validNarratives[validNarratives.length - 1].id;
      return this.currentNarrative.id === lastId;
    },
    onClickNext() {
      const validNarratives = this.narrativesList.filter((n) => !n.disabled);
      let nextNarrative = null;
      for (let i = 0; i < validNarratives.length; i++) {
        if (validNarratives[i].id === this.currentNarrative.id) {
          if (this.isLastNarrative()) {
            nextNarrative = validNarratives[0];
          } else {
            nextNarrative = validNarratives[i + 1];
          }
        }
      }
      if (nextNarrative) {
        this.$router.push({ path: "/narratives/" + nextNarrative.slug });
      }
    },
    onClickGdelt() {
      const url = "https://www.gdeltproject.org/";
      window.open(url, "_blank").focus();
    },
    closeInfo() {
      if (this.infoOpen) {
        this.infoOpen = false;
      }
    },
    onClickOnInfo() {
      process.nextTick(() => {
        this.infoOpen = true;
      });
    },
    onProgress(val) {
      this.currStepProgress = val.progress;
    },
    stepEnterHandler({ element, index, direction }) {
      if (!this.isLoaded) {
        return;
      }
      this.isMobile = getIsMobile() || window.innerWidth < 1000;

      this.currStepIndex = parseInt(element.dataset.stepNo);
      if (this.lastEnterBackgroundDirection !== "jump") {
        this.lastEnterBackgroundDirection = direction;
        this.startBackgroundScroll = window.scrollY;
      }
      this.lastDirection = direction;
      window.dispatchEvent(new Event('resize'))
    },
    stepExitHandler({ element, index, direction }) {
      this.lastDirection = direction;
    },
    getStepProgress(step) {
      const curStepNum = this.currStepIndex;
      if (step === curStepNum) {
        return this.currStepProgress;
      }
      if (step < curStepNum) {
        return 1;
      }
      if (step > curStepNum) {
        return 0;
      }
    },
    onClickTimeline(index) {
      if (!narratives[index].disabled) {
        this.$router.push({ path: "/narratives/" + narratives[index].slug });
      }

      /*
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
      */
    },
    backgroundLoop() {
      /*
      if (this.currentBackgroundToShow) {
        // to do remove query from loop
        // this.backgroundContainer = document.querySelector(".background_container");
        if (this.backgroundContainer) {
          let oneStepBackground = true;
          if (this.currentBackground.stepend - this.currentBackground.stepstart > 0) {
            oneStepBackground = false;
          }
          let top = window.innerHeight / 2;
          this.currentBackgroundScroll =
            window.scrollY - this.startBackgroundScroll;
          if (this.lastEnterBackgroundDirection === "up") {
            top = -(window.innerHeight / 2);
          }
          const currOrder = parseInt(this.narrativeSteps[this.currStepIndex]?.order);

          let translateY = top - this.currentBackgroundScroll;
          if (currOrder === 1 && this.startBackgroundScroll === 0) {
            translateY = translateY - (window.innerHeight / 2 - 64); // 64 is topbar height
          }

          if (oneStepBackground) {
            this.backgroundContainer.style.setProperty(
              "transform",
              `translateY(${translateY - 32}px)`,
              "important"
            );
          } else {
            if (this.isMobile) {translateY = translateY - 300;}
            if (this.currStepProgress < 0.5 && this.currentBackground.stepstart === currOrder) {
              this.backgroundContainer.style.setProperty(
                "transform",
                `translateY(${translateY}px)`,
                "important"
              );
            } else if (this.currStepProgress > 0.5 && this.currentBackground.stepend === currOrder) {
              this.backgroundContainer.style.setProperty(
                "transform",
                `translateY(${translateY}px)`,
                "important"
              );
            }
          }
        }
      }
      this.backgroundAnimation = requestAnimationFrame(this.backgroundLoop);
        */
    },
    mergedGraphSequence(backgrounds) {
      backgrounds.sort((a, b) => {
        return b.stepstart - a.stepstart;
      });
      var mergedBackgrounds = [];
      var hasBarSequence = true;
      while (hasBarSequence == true) {
        mergedBackgrounds = [];
        for (var i = 0; i < backgrounds.length - 1; i++) {
          var hasfound = false;
          var cur = backgrounds[i];
          var next = backgrounds[i + 1];
          if (cur.component == "BarChart" && next.component == "BarChart") {
            cur.name += `,${next.name}`;
            cur.stepend = next.stepend;
            hasBarSequence = true;
            mergedBackgrounds.push(cur);
            hasfound = true;
          } else if (cur.component !== "BarChart") {
            mergedBackgrounds.push(cur);
          }
          hasBarSequence = hasfound;
        }
      }
      mergedBackgrounds.map((bg) => {
        console.log("bg", bg.name);
      });
      return mergedBackgrounds;
    },
    getBackgroundOfStep(stepIndex) {
      const back = this.backgrounds.find(
        (item) =>
          stepIndex >= item.stepstart &&
          stepIndex <= item.stepend &&
          parseInt(item.narrative) === parseInt(this.currentNarrative?.id)
      );
      return back;
    },
  },
  watch: {
    currStepIndex(index) {
      let back = null;
      if (!this.currStepObj) {
        this.currentBackground = null;
        return;
      }
      const currOrder = parseInt(this.narrativeSteps[this.currStepIndex].order);
      back = this.backgrounds.find(
        (item) =>
          currOrder >= item.stepstart &&
          currOrder <= item.stepend &&
          parseInt(item.narrative) === parseInt(this.currentNarrative?.id)
      );
      this.currentBackground = back;
      //console.log("this.currentBackground", this.currentBackground)
    },
    currentBackground(value) {
      if (!value || value.component === "WordCloud") {
        this.currentBackgroundToShow = null;
        return;
      }
      if (!this.lastBackground || value.uuid !== this.lastBackground.uuid) {
        this.currentBackgroundToShow = null;
        this.lastBackground = value;
        process.nextTick(() => {
          this.currentBackgroundToShow = value;
        });
      } else {
        this.currentBackgroundToShow = value;
      }
    },
  },
};
</script>
<style lang="sass">
.scrollama__debug-offset
  border-top: 2px dashed red !important

.unclickable
  opacity: 0.2 !important
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
@font-face
  font-family: "Space Mono Italic"
  src: url(/fonts/space-mono-v12-latin/Space_Mono/SpaceMono-Italic.ttf) format("truetype")

.narrative
  height: 100%
  display: flex
  justify-content: flex-end
  width: 100vw
  position: relative
  transition-delay: 0.3s
  &_title
    pointer-events: none
    position: sticky
    top: -100px
    word-spacing: -15px !important
    left: 0
    width: 100vw !important
    min-width: 100vw !important
    height: 200px
    margin-top: 100px
    z-index: 100
    @media only screen and (max-width: 480px)
      font-size: 20px
      top: -100px
      margin-top: 50px !important
    &_name
      display: flex
      // background-color: rgba(255,255,255,0.8) !important
      // backdrop-filter: blur(3px)
      justify-content: center
      position: absolute
      margin-top: 28px
      margin: 0 auto
      text-align: center
      left: 50%
      transform: translate(-50%, 0)
      width: 100vw
      color: black
      font-family: Space Mono Italic !important
      font-weight: 300
      padding-left: 30vw
      padding-right: 30vw
      font-size: 20px
      text-transform: uppercase
      h1
        font-size: 20px
        background-color: rgba(255,255,255,0.8) !important
        font-weight: 300
        font-family: Space Mono Italic !important
        @media only screen and (max-width: 480px)
          font-size: 12px
          padding: 0px 20px 0px 20px !important
          text-align: center
      @media only screen and (max-width: 480px)
        font-size: 12px
        padding: 0px 20px 0px 20px !important
        text-align: center
.italic
  font-family: Space Mono Italic !important
  font-weight: 300
  margin-top: -26px
  @media only screen and (max-width: 480px)
    margin-top: -18px

.timeline
  position: fixed
  left: 3px
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
  // -webkit-mask-image: -webkit-gradient(linear, left top, left bottom, from(black), to(transparent)), -webkit-gradient(linear, left bottom, left top, from(black), to(transparent))
  // -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%), linear-gradient(to top, black 50%, transparent 100%)
  // mask-image: -webkit-gradient(linear, left top, left bottom, from(black), to(transparent)), -webkit-gradient(linear, left bottom, left top, from(black), to(transparent))
  // mask-image: linear-gradient(to bottom, black 50%, transparent 100%), linear-gradient(to top, black 50%, transparent 100%)
  // mask-position: center
  // mask-repeat:no-repeat
  // mask-composite: intersect
  @media only screen and (max-width: 480px)
    transform: scale(0.8) !important

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
  pointer-events: none
  display: flex
  flex-direction: column
  width: 400px!important
  margin-right: 80px
  align-self: flex-end
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

.step:last-child
  margin-bottom: 60vh
// .step.active

.step-child
  will-change: transform

.background
  height: 100vh
  width: calc(100vw - 440px)
  max-width: 1300px
  position: fixed
  padding-left: 70px
  padding-right: 180px
  left: 0px
  top: 0
  display: flex
  justify-content: center
  align-items: center
  @media only screen and (max-width: 480px)
    width: 100vw !important
    left: 0
    margin-top: calc(30vh)
    padding-left: 15px !important
    padding-right: 15px !important
.background_container
  display: flex
  justify-content: center
  align-items: center
  height: fit-content
  width: 100%
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

.infosquare
  position: fixed
  cursor: pointer
  color: white
  display: flex
  bottom: 30px
  border-radius: 4px
  background-color: black
  left: 32px
  // height: 100px
  width: 400px
  padding: 10px
  // backdrop-filter: blur(3px)
  // background-color: rgba(1,1,1,0.8)
  z-index: 120
  @media only screen and (max-width: 480px)
    width: 80%
    left: 14px
    bottom: 20px
    height: fit-content
  p
    font-size: 13px
    margin-bottom: 0px !important
    font-family: Space Mono
    @media only screen and (max-width: 480px)
      font-size: 11px
.infobutton
  position: fixed
  cursor: pointer
  bottom: 30px
  background-color: transparent
  left: 31px
  z-index: 15
  height: 40px
  width: 40px
  @media only screen and (max-width: 480px)
    left: 14px
    bottom: 20px
  :hover
    transform: rotateZ(360deg)
    transition: transform 1s
  img
    height: 40px
    width: 40px

.next
  width: 100vw
  left: 0
  bottom: 0px
  z-index: 99999
  height: 100px
  position: absolute
  pointer-events: all !important
  display: flex
  flex-direction: column
  justify-content: center
  margin-bottom: 40vh
  p
    width: fit-content
    z-index: 99999
    font-size: 32px
    font-weight: 500
    padding: 10px
    font-family: Space Mono
    pointer-events: all !important
    position: sticky
    align-self: center
    cursor: pointer
    color: black
  :hover
    font-style: italic

// mobile

.sausage_mobile
  min-width: 100vw !important
  width: 100vw
  max-width: 100vw !important
  position: relative
  display: flex
  flex-direction: column
  justify-content: center
.step_mobile
  height: fit-content
  margin-top: 15vh
  &:first-child
    margin-top: 25vh
    margin-bottom: 30vh
    @media only screen and (min-width: 480px)
      margin-top: 50vh !important

  &:last-child
    margin-bottom: 50vh
.step-child_mobile
  height: fit-content

.step-child-background_mobile
  height: fit-content
  margin-top: 45%
  padding-left: 10px
  padding-right: 10px
  max-width: 100vw !important
  @media only screen and (min-width: 480px)
    margin-top: 15%

.scrollama_mobile

.wordcloudhole
  height: 60vh
  pointer-events: none !important

.load-icon
  position: fixed
  z-index: 9999999999
  left: 50%
  top: 50%
  transform: translate(-50%, -50%)
</style>
