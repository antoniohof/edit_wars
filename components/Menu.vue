<template>
  <div>
    <v-navigation-drawer
      fixed
      app
      temporary
      right
      width="400"
      :hide-overlay="true"
      v-model="isOpenLocal"
      class="menu"
    >
      <div class="close" @click="onClickClose">CLOSE</div>
      <v-list height="300" class="list">
        <v-list-item
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
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      isOpenLocal: false,
      items: [
        { title: 'Intro', route: '/' },
        { title: 'Narratives', route: '/narratives' },
        { title: 'About', route: '/about' }
      ]
    }
  },
  computed: {
    selectedRoute() {
      return this.$nuxt.$route.path
    }
  },
  mounted() {},
  methods: {
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
        console.log('close')
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
    z-index: 10
    top: 20px !important
    background-color: $menu-bg
    border-radius: 4px 0px 0px 4px
    backdrop-filter: blur(3px)

.list
    margin-top: 147px
    margin-left: 60px

.close
    position: absolute
    top: 0
    font-family: Space Mono
    font-size: 32px
    margin-left: 27px
    margin-top: 6px
    cursor: pointer

.v-list-item
    cursor: pointer

.v-list-item__title
    font-family: Space Mono
    text-transform: uppercase
    font-size: 32px !important
    color: black
    &:hover
      font-style: italic

.selected
  // font-style: italic

.v-list-item__icon
  align-self: center
  margin-right: 10px !important

.dot
  height: 18px
  width: 18px
  background-color: black
  border-radius: 50%
  display: inline-block

.line:before
  content: ""
  display: block
  background-color: black
  width: 1px
  height: 100%
  position: absolute
  left: 25px
  top: -50%
  z-index: 1
</style>
