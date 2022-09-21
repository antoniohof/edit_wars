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
      <div class="close" @click="onClickClose">
        CLOSE
      </div>
      <v-list height="300" class="list">
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.route"
          nuxt
        >
          <v-list-item-icon>
            <span class="dot" :class="{ 'line': item.title !== 'Intro'}"></span>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title :class="{'selected': isSelected(item) }" >{{ item.title }}</v-list-item-title>
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
      data () {
        return {
            isOpenLocal: false,
            items: [
                { title: 'Intro', route: '/' },
                { title: 'Narratives', route: '/narratives' },
                { title: 'About', route: '/about' },
            ],
        }
      },
      computed: {
        selectedRoute () {
            return this.$nuxt.$route.path
        }
      },
      mounted () {
       
      },
      methods: {
        onClickClose () {
            this.isOpenLocal = false
        },
        isSelected (item) {
          if (this.selectedRoute.indexOf('narratives') !== -1 && item.route === '/narratives') {
            return true
          }
          return this.selectedRoute === item.route
        }
      },
      watch: {
        isOpen (val) {
            this.isOpenLocal = val
        },
        isOpenLocal (val) {
            if (!val) {
                console.log('close')
                this.$emit('onclose')
            }
        }
      }
    }
</script>

<style lang="sass" scoped>
.menu
    z-index: 10
    top: 25px !important
    background-color: $menu-bg
    border-radius: 4px 0px 0px 4px

.list
    margin-top: 147px
    margin-left: 60px

.close
    position: absolute
    top: 0
    font-family: Space Mono
    font-size: 32px
    margin-left: 27px
    margin-top: 7px
    cursor: pointer
    
.v-list-item
    cursor: pointer

.v-list-item__title
    font-family: Space Mono
    text-transform: uppercase
    font-size: 32px !important
    color: black
    &:hover
      color: white !important

.selected
    color: white !important

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