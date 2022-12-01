<template>
  <v-container class="about-page" fluid>
    <div class="about-page-title">
      <nuxt-content class="about-page-title-content" :document="mainText" />
    </div>
    <v-row class="about-page-topics justify-start" width="100%">
      <v-list dense width="100%">
        <v-list-group
          v-for="(topic, index) in topics"
          :key="index"
          v-model="topic.isOpen"
          :append-icon="!topic.isOpen ? 'mdi-plus' : 'mdi-close'"
          dense
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-divider class="divider"></v-divider>
              <v-list-item-title class="title">{{
                topic.title
              }}</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item class="topic" dense>
            <nuxt-content
              class="topic-content"
              :document="getTopicContent(topic.content)"
            />
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-row>
  </v-container>
</template>

<script>
export default {
  head: {
    title: 'About',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'About Page'
      }
    ]
  },
  scrollToTop: true,
  transition: '',
  data() {
    return {
      topics: [
        {
          title: 'Context',
          content: 'context',
          isOpen: false
        },
        {
          title: 'Goals',
          content: 'goals',
          isOpen: false
        },
        {
          title: 'Team',
          content: 'team',
          isOpen: false
        },
        {
          title: 'Methodology',
          content: 'methodology',
          isOpen: false
        },
        {
          title: 'Datasets and Tools',
          content: 'tools',
          isOpen: false
        },
        {
          title: 'Funding',
          content: 'funding',
          isOpen: false
        },
        {
          title: 'Contacts',
          content: 'contact',
          isOpen: false
        }
      ]
    }
  },
  mounted() {
    window.scrollTo(0, 0)
  },
  async asyncData({ $content }) {
    const about = await $content('about').fetch()
    return {
      about
    }
  },
  computed: {
    mainText() {
      return this.about['aboutmain_' + this.$i18n.locale]
    },
    goals() {
      return this.about['aboutgoals_' + this.$i18n.locale]
    },
    methodology() {
      return this.about['aboutmethodology_' + this.$i18n.locale]
    },
    team() {
      return this.about['aboutteam_' + this.$i18n.locale]
    },
    tools() {
      return this.about['abouttools_' + this.$i18n.locale]
    },
    contact() {
      return this.about['aboutcontact_' + this.$i18n.locale]
    },
    funding() {
      return this.about['aboutfunding_' + this.$i18n.locale]
    },
    context() {
      return this.about['aboutcontext_' + this.$i18n.locale]
    }
  },
  components: {},

  methods: {
    setTopicOpen(topic) {
      topic.isOpen = !topic.isOpen
    },
    getTopicContent(content) {
      return this[content]
    }
  },
  watch: {}
}
</script>

<style lang="sass">
.v-list-group__header
  padding: 0px !important

.mdi-close
  color: black !important
  font-size: 32px !important
  align-self: center
  width: 26px !important
  height: 36px !important
  transform: scale(1.5,1.5)
  left: 3px
  font-weight: 1000 !important
.mdi-plus
  margin-top: 1px
  color: black !important
  font-weight: 1000 !important
  left: 3px
  transform: scale(1.5,1.5)

</style>

<style lang="sass" scoped>

.about-page
  display: flex
  margin-top: 10px
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
      margin-top: 8px
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
  font-family: Space Mono !important
  font-size: 1.6vw !important
  overflow: visible
  user-select: none
  text-transform: uppercase
  color: black
  width: 100%
  padding: 0px !important
  z-index: 10
  @media only screen and (max-width: 480px)
    font-size: 18px !important
    line-height: 23px !important
.topic
  font-family: Open Sans
  font-size: 1.5vw
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

.v-list-group:last-child
  border-bottom: 2px solid black
</style>
