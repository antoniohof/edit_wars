<template>
  <div>
    <v-navigation-drawer
      fixed
      app
      temporary
      right
      :width="getWidth"
      :hide-overlay="true"
      v-model="isOpenLocal"
      class="menu"
    >
      <div class="close" @click="onClickClose">CLOSE</div>
      <v-list height="300" class="list">
        <v-list-item
          @click="onClickItem"
          v-for="item in items"
          :key="item.title"
          class="menuitem"
          :to="item.route"
          nuxt
        >
          <v-list-item-icon>
            <span
              class="dot"
              :class="{
                line: item.title !== 'Intro',
                selected: isSelected(item)
              }"
            ></span>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title :class="{ selected: isSelected(item) }">{{
              item.title
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <div class="contact" @click="onClick">CONTACT
        <div class="email">editwarsproject@proton.me</div>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { getIsMobile } from '@/utils/index.js'

export default {
  props: {
    isOpen: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      isMobile: false,
      isOpenLocal: false,
      items: [
        { title: 'Intro', route: '/' },
        { title: 'Narratives', route: '/narratives' },
        { title: 'NEWS', route: '/news' },
        { title: 'About', route: '/about' },
      ]
    }
  },
  computed: {
    getWidth() {
      return this.isMobile ? '100%' : '350'
    },
    selectedRoute() {
      return this.$nuxt.$route.path
    }
  },
  mounted() {
    this.isMobile = getIsMobile()
  },
  methods: {
    onClickItem () {
      this.onClickClose()
    },
    onClick (e) {
      e.preventDefault()
    },
    onClickClose() {
      this.isOpenLocal = false
    },
    isSelected(item) {
      return this.selectedRoute === item.route
    }
  },
  watch: {
    isOpen(val) {
      this.isOpenLocal = val
    },
    isOpenLocal(val) {
      if (!val) {
        this.$emit('onclose')
      }
    }
  }
}
</script>

<style lang="sass">
.v-list-item--active::before
  opacity: 0 !important
.v-list-item:hover::before
  opacity: 0 !important
</style>

<style lang="sass" scoped>
.menuitem
  background-color: transparent !important
.menu
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1)
    z-index: 120
    top: 20px !important
    background-color: $menu-bg
    user-select: none
    border-radius: 4px 0px 0px 4px
    backdrop-filter: blur(3px)
    @media only screen and (max-width: 480px)
      top: 0px !important

.list
    margin-top: 147px
    margin-left: 60px
    @media only screen and (max-width: 480px)
      margin-top: 35%
      margin-left: 22%

.close
    position: absolute
    top: 0
    font-family: Space Mono
    font-size: 32px
    margin-left: 27px
    margin-top: 6px
    cursor: pointer
    @media only screen and (max-width: 480px)
      right: 12px
      font-size: 26px
      margin-top: 8px
    &:hover
      font-style: italic

.v-list-item
    cursor: pointer
    height: 70px

.v-list-item__title
    font-family: Space Mono
    text-transform: uppercase
    font-size: 26px !important
    color: black
    &:hover
      font-style: italic

.selected
  // font-style: italic

.v-list-item__icon
  align-self: center
  margin-right: 5px !important

.dot
  height: 12px
  width: 12px
  background-color: black
  border-radius: 50%
  display: inline-block
  margin-left: 2px
  &.selected
    height: 16px
    width: 16px
    margin-left: 0px !important
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

.contact
  pointer-events: all !important
  z-index: 9999 !important
  font-family: Space Mono
  position: absolute
  bottom: -2px
  font-size: 20px
  color: grey
  left: 27px
  height: 100px

.email
  margin-top: -2px
  font-size: 16px
  user-select: all
  pointer-events: all !important
  z-index: 9999 !important
  font-family: Open Sans !important
  color: black !important

</style>
