<template>
  <v-container class="news-page" fluid>
    <v-row class="news-page-topics justify-start" width="100%">
      <v-list dense width="100%">
        <v-list-group
          v-for="(news, index) in news_collection"
          :key="index"
          dense
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-divider class="divider"></v-divider>
              <v-list-item-title class="title" @click="onClickNews(news)">
                <span :class="{'long': getIsLong(news)}" class="title_news">{{ news['title_' + $i18n.locale]}}</span>
                <span v-show="!isMobile" class="type">{{ news['type_' + $i18n.locale]}}</span>
                <span v-show="!isMobile" class="year">{{ news['year']}}</span>
              </v-list-item-title>
            </v-list-item-content>
          </template>
        </v-list-group>
      </v-list>
    </v-row>
  </v-container>
</template>

<script>
import { getIsMobile } from '@/utils/index.js'

export default {
  head: {
    title: 'news',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'news Page'
      }
    ]
  },
  scrollToTop: true,
  transition: '',
  data() {
    return {
      isMobile: false
    }
  },
  mounted() {
    this.isMobile = getIsMobile() || window.innerWidth < 800
    window.scrollTo(0, 0)
    window.addEventListener('resize', this.handleResize)
  },
  // update isMobile on window resize
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  async asyncData({ $content }) {
    const news = await $content('news').fetch()
    return {
      "news_collection": news.sort((a, b) => {
        return b.order - a.order
      })
    }
  },
  computed: {},
  methods: {
    handleResize () {
      this.isMobile = getIsMobile() || window.innerWidth < 800
    },
    setTopicOpen(topic) {
      topic.isOpen = !topic.isOpen
    },
    getNewsContent(news) {
      return news['body_' + this.$i18n.locale]
    },
    onClickNews (news) {
      // open news url on new window
      window && window.open(news.url, '_blank')
    },
    getIsLong (news) {
      return news['title_' + this.$i18n.locale].length > 22
    }
  },
  watch: {}
}
</script>

<style lang="sass">
.v-list-group__header
  padding: 0px !important
.news-page
  .v-list-item__icon.v-list-group__header__append-icon
    margin-left: 0px !important
    display: none !important
  .v-list-group__header.v-list-item.v-list-item--link.theme--light
    //display: none !important
</style>

<style lang="sass" scoped>

.news-page
  display: flex
  margin-top: 0px
  flex-direction: column
  width: 100%
  height: 90%
  justify-content: space-evenly
  padding: 0px 85px 0px 85px !important
  color: black
  @media only screen and (max-width: 480px)
    padding: 0px 26px 0px 26px !important
  &-title
    z-index: 10
    font-family: Space Mono
    font-size: max(1.6vw, 22px)
    margin-bottom: 10px
    width: 100%  
    margin-top: 0px
    max-height: 100%
    @media only screen and (max-width: 480px)
      font-size: 14px !important
      margin-top: 20px
      width: 100%
  &-topics
    margin: 0px !important
    height: fit-content
    max-height: 400px
    z-index: 10
    @media only screen and (max-width: 480px)
      font-size: 16px !important
      width: 100% !important
.title
  position: relative
  font-family: Space Mono !important
  font-size: max(1.2vw, 12px) !important
  overflow: visible
  user-select: none
  text-transform: uppercase
  color: black
  width: 100%
  padding: 0px !important
  z-index: 10
  @media only screen and (max-width: 480px)
    font-size: 14px !important
    line-height: 23px !important
  .type
    position: absolute
    right: 100px
    color: #797878
  .arrow-icon img
    margin-bottom: -6px
    margin-left: -4px
  .year
    position: absolute
    right: 1px
    color: #797878
  &:hover
    cursor: pointer
    font-style: italic
.topic
  font-family: Open Sans
  font-size: 14px
  margin-bottom: 25px
  line-height: 2.1vw !important
  @media only screen and (max-width: 480px)
    font-size: 16px !important
    line-height: 23px !important
  :deep(img)
    width: 40%
    margin-top: 15px
    margin-bottom: -5px !important
  :deep(p)
    margin-bottom: 5px !important
.divider
  border-color: rgba(0, 0, 0, 1) !important
  border: 1px solid black
  position: absolute
  top: 0px
  left: 0px
  width: 100%

.v-list
  height: fit-content
  background: transparent
  @media only screen and (max-width: 480px)
    width: 100% !important
.v-list-item
  padding: 0 0
.v-list-item__content
  height: 3.5vw
  padding: 0px 0px 0px 0px !important
  align-content: center
  @media only screen and (max-width: 480px)
    height: 45px

@keyframes animate
  0%
    transform: translateX(100%)
  100%
    transform: translateX(-100%)

.v-list-group:last-child
  border-bottom: 2px solid black
</style>
