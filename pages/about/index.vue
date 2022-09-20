<template>
  <v-container class="about-page" fluid>
    <nuxt-content class='about-description' :document="about[currentBody]" />
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
  },
  watch: {

  }
}
</script>
<style lang="sass" scoped>
  .nuxt-content-container
    justify-content: flex-start !important
</style>
<style lang="sass">

.about-page
  display: flex
  flex-direction: column
  align-content: flex-start
  width: 100%
  margin-bottom: 200px
  color: black
.about-description
  font-family: Space Mono !important
  font-size: 32px !important
  line-height: 40px !important
  width: 100%
  align-self: flex-start
  max-width: 900px
  color: black

</style>
