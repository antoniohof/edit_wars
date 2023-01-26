<template>
  <v-app id="app">
    <div class="gradient" >
    </div>
    <client-only>
      <NarrativesGraph class='backgroundgraph' v-show="(isHomeRoute || (isNarrativesRoute) || isAboutRoute)">
      </NarrativesGraph>
        <!--
      <div class="mobile_menu"  v-show="isMobile && isNarrativesRoute">
        <div>
          <img src="../static/img/narratives.svg"/>
        </div>
        <v-list height="300" class="list">
          <v-list-item
            v-for="item in narrativeList"
            :key="item.name"
            class="menuitem"
            :to="getRoute(item)"
            nuxt
          >
            <v-list-item-icon>
              <span
                class="dot"
                :class="{
                  line: item.name !== '“Freezing Europe”'
                }"
              ></span>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{
                item.name
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
        -->
    </client-only>
    <Menu @onclose="onMenuClose" :isOpen="isMenuOpen"></Menu>
      <v-app-bar
        app
        flat
        elevation="0"
        class="topbar"
        color="transparent"
        justify-space-around
      >
      <transition name="fade">
        <div
          v-show="!this.isIntroFirstStep && delayOver"
          @click="onClickHome"
          class="title"
        >
          EDIT WARS
        </div>
      </transition>

        <!--
        <NuxtLink
          class="topbar_item justify-end about"
          to="/about"
        >
          {{ $t('about') }}
        </NuxtLink>
        -->
        <v-spacer></v-spacer>
        <transition name="fademenu">
          <div
            class="menu"
            v-if="!isIntroFirstStep && !isMenuOpen"
            @click="onClickMenu"
          >
            MENU
          </div>
        </transition>
      </v-app-bar>
    <v-main class="main">
      <transition name="fade">
        <nuxt class="content" :key="$route.params.id" />
      </transition>
    </v-main>
  </v-app>
</template>

<script>
import EventBus from '@/utils/event-bus'
import NarrativesGraph from '../components/NarrativesGraph.vue'
import { narratives } from '@/utils/constants.js'
import { getIsMobile } from '@/utils/index.js'

export default {
  head: {
    title: 'Home',
    data: {
      narrativeList: []
    },
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Deconstructing Russian Propaganda Narratives'
      }
    ],
    script: [
      { src: 'https://identity.netlify.com/v1/netlify-identity-widget.js' }
    ]
  },
  scrollToTop: false,
  components: { NarrativesGraph },
  computed: {
    isNarrativesRoute () {
      if (!process.browser) {
        return null
      }
      return $nuxt.$route.path === '/narratives'
    },
    isAboutRoute () {
      if (!process.browser) {
        return null
      }
      return $nuxt.$route.path === '/about'
    },
    isHomeRoute() {
      if (!process.browser) {
        return null
      }
      return $nuxt.$route.path === '/'
    },
    isEnglish() {
      return this.$i18n.locale === 'en'
    },
    languageToChange() {
      return this.isEnglish ? 'ru' : 'en'
    }
  },
  mounted() {
    if (process.client) {
      this.isMobile = getIsMobile();
    }
    this.narrativeList = narratives.filter((n) => !n.disabled);
    if ($nuxt.$route.path.slice(-1) === '/') {
      this.$router.push({ path: $nuxt.$route.path.substr(0, $nuxt.$route.path.length-1) })
    }
    setTimeout(() => {
      this.delayOver = true
    }, 250)
    if ($nuxt.$route.path !== '/') {
      this.isIntroFirstStep = false
    } else {
      this.isIntroFirstStep = true
    }
    EventBus.$on('introfirst', () => {
      this.isIntroFirstStep = true
    })
    EventBus.$on('introsecond', () => {
      this.isIntroFirstStep = false
    })
  },
  data() {
    return {
      isMenuOpen: false,
      isIntroFirstStep: true,
      delayOver: false,
      isMobile: false
    }
  },
  methods: {
    getRoute (item) {
      return 'narratives/' + item.slug
    },
    onClickHome() {
      if ($nuxt.$route.path === '/') {
        location.reload();
      } else {
        this.$router.push({ path: '/' })
      } 
    },
    onChangeLanguage() {
      if (this.isEnglish) {
        this.$i18n.locale = 'ru'
      } else {
        this.$i18n.locale = 'en'
      }
    },
    onMenuClose() {
      this.isMenuOpen = false
    },
    onClickMenu() {
      this.isMenuOpen = true
    }
  },
  watch: {}
}
</script>

<style lang="sass">
.v-toolbar__content
  z-index: 1000 !important
  padding: 0px 0px !important
</style>

<style lang="sass" scoped>
#app
  background-color: white
  -webkit-transition: background-color 1s ease-in
          transition: background-color 1s ease-in
  -webkit-transition-delay: 0.5s
          transition-delay: 0.5s
.main
  color: white
  padding: 74px 0px 0px
  &.blur
    backdrop-filter: blur(3px) !important

.backgroundgraph
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  z-index: 5
.title
  cursor: pointer
  user-select: none
  color: black !important
  font-size: 54px !important
  z-index: 100
  font-family: Space Mono !important
  font-weight: 700 !important
  margin-left: -2px
  margin-top: 40px
  @media only screen and (max-width: 480px)
    font-size: 26px !important
    margin-top: 0px
.topbar
  color: white
  z-index: 1000 !important
  width: 100vw
  padding: 0px 30px 0px 30px
  @media only screen and (max-width: 480px)
    padding: 0px 12px 0px 12px !important

.menu
  cursor: pointer
  font-family: Space Mono
  color: black
  font-weight: 400
  font-size: 32px
  user-select: none
  text-transform: uppercase
  margin-top: 30px
  padding-right: 4px
  margin-right: -4px
  @media only screen and (max-width: 480px)
    font-size: 26px !important
    margin-top: -1px
  &:hover
    font-style: italic

.gradient
  width: 100vw !important
  height: 100px
  pointer-events: none !important
  top: 0
  position: fixed
  z-index: 100
  background-image: linear-gradient(0deg,hsla(0,0%,100%,0),#fff)
  @media only screen and (max-width: 480px)
    height: 100px

.list
  text-align: left

.v-list-item
  cursor: pointer
  height: 70px
  color: black !important

.v-list-item__title
    font-family: Space Mono
    text-transform: uppercase
    font-size: 26px !important
    color: black
    &:hover
      font-style: italic


.menuitem
  background-color: transparent !important
  color: black
  pointer-events: all !important

.mobile_menu
  height: 100vh
  widht: 100vw
  display: flex
  justify-content: center
  align-items: center
  z-index: 100
  pointer-events: none

.dot
  height: 12px
  width: 12px
  background-color: black
  border-radius: 50%
  display: inline-block
  margin-left: 2px
.v-list-item__icon
  margin-right: 10px !important
  height: 50%
  align-items: center


.line:before
  content: ""
  display: block
  background-color: black
  width: 1px
  height: 100%
  position: absolute
  left: 23.5px
  top: -50%
  z-index: 1
  </style>
