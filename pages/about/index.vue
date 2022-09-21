<template>
  <v-container class="about-page" fluid>
    <v-row
      class="justify-start"
      width="70%"
    >
      <v-list dense width="70%">
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
  
            <v-list-item dense>
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
          content: 'Bla',
          isOpen: false
        },
        {
          title: 'Project Funding',
          content: 'Bla',
          isOpen: false
        },
        {
          title: 'Team',
          content: 'Bla',
          isOpen: false
        },
        {
          title: 'Research Methodology',
          content: 'Bla',
          isOpen: false
        },
        {
          title: 'Research Tools',
          content: 'Bla',
          isOpen: false
        },
        {
          title: 'Contacts',
          content: 'Bla',
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

.title
  font-family: Space Mono !important
  font-size: 32px !important
  overflow: visible
  text-transform: uppercase
  color: black
  padding: 0px !important
  
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
