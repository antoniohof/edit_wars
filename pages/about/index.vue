<template>
  <v-container class="about-page" fluid>
    <div class="about-page-title">
      Edit Wars project is the data based art research, studying special aspects of Russian propaganda and media situation in Russia regarding the invasion in Ukraine 2022 and current war. 
    </div>
    <v-row
      class="about-page-topics justify-start"
      width="72%"
    >
      <v-list dense width="72%">
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
                <v-list-item-title class='title'>{{ topic.title }}</v-list-item-title>
              </v-list-item-content>
            
            </template>
  
            <v-list-item class='topic-content' dense>
              {{ topic.content }}
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
          title: 'Project Goals',
          content: 'Topic Example',
          isOpen: false
        },
        {
          title: 'Project Funding',
          content: 'Topic Example',
          isOpen: false
        },
        {
          title: 'Team',
          content: 'Topic Example',
          isOpen: false
        },
        {
          title: 'Research Methodology',
          content: 'Topic Example',
          isOpen: false
        },
        {
          title: 'Research Tools',
          content: 'Topic Example',
          isOpen: false
        },
        {
          title: 'Contacts',
          content: 'Topic Example',
          isOpen: false
        }
      ]
    }
  },
  mounted () {
  },
  async asyncData({ $content }) {
    const about = await $content('about').fetch()
    return {
      about
    }
  },
  computed: {
    currentBody () {
      return 'body_' + this.$i18n.locale
    }
  },
  components: {},

  methods: {
    setTopicOpen(topic) {
      topic.isOpen = !topic.isOpen
    }
  },
  watch: {

  }
}
</script>

<style lang="sass">
.v-list-group__header
  padding: 0px !important

.mdi-close
  color: black !important
  font-size: 21px !important
  align-self: center
  width: 24px !important
  height: 24px !important

.mdi-plus
  color: black !important
</style>

<style lang="sass" scoped>

.about-page
  display: flex
  flex-direction: column
  align-content: flex-start
  width: 100%
  padding: 0px 85px 0px 85px
  color: black
  &-title
    font-family: Golos-Text-Regular
    font-size: 32px
    margin-bottom: 100px 
    width: 72%
    margin-top: 30px
  &-topics
    margin: 0px !important

.title
  font-family: Space Mono !important
  font-size: 32px !important
  overflow: visible
  text-transform: uppercase
  color: black
  padding: 0px !important
.topic-content
  font-family: Golos-Text-Regular
  font-size: 25px
  margin-bottom: 25px

.divider
  border-color: rgba(0, 0, 0, 1) !important
  border: 1px solid black
  position: absolute
  top: 0px
  left: 0px
  width: 100%

.v-list-item__content
  height: 66px
  padding: 0px 0px 0px 0px !important
  align-content: center

</style>
