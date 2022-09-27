<template>
  <v-container class="about-page pa-0" fluid>
    <div class="about-page-title">
      Edit Wars is a project using the analysis of media publications accompanying the growing militarization and manipulation of mass consciousness in Russia for a better understanding of the mechanics of state propaganda and ways to build resilience towards it. The project focus on the use of aggressive narratives in the government-controlled media that isolate public perception from the real state of affairs
The project consists of two parts. The research combines the use of quantitative and qualitative methods of working with data from large datasets to draw meaningful conclusions for the presentation. The artistic part of the project aims to put the findings into a multimedia interactive medium. 
The project is aimed at an internationally wide audience interested in the specifics and potential threats of Russian propaganda, its mechanisms of persuasion and methods of influencing audiences within the country. The project may be of interest to researchers of media freedom in authoritarian regimes and the consequences of the monopolisation of the information space. The results of the study may be of practical interest as a tool for debunking propaganda myths.
We are open to partnerships with publishers, media and fact-checking organizations.
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
          content: '',
          isOpen: false
        },
        {
          title: 'Project Funding',
          content: '--',
          isOpen: false
        },
        {
          title: 'Team',
          content: '--',
          isOpen: false
        },
        {
          title: 'Research Methodology',
          content: '--',
          isOpen: false
        },
        {
          title: 'Research Tools',
          content: '--',
          isOpen: false
        },
        {
          title: 'Contacts',
          content: '--',
          isOpen: false
        }
      ]
    }
  },
  mounted () {
    console.log('about', this.about)
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
  margin: 0px 85px 0px 85px
  color: black
  &-title
    font-family: Space Mono
    font-size: 15px
    margin-bottom: 70px 
    width: 72%
    margin-top: 65px
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
