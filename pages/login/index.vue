<template>
  <v-container fluid class="home ma-0 pa-0">
    <div class='home_container'>
    </div>
  </v-container>
</template>

<script>

export default {
  head: {
    title: 'Login',
    script: [
      { src: "https://identity.netlify.com/v1/netlify-identity-widget.js" }
    ]
  },
  mounted () {
    netlifyIdentity.on('open', () => {
      process.nextTick(() => {
        const user = netlifyIdentity.currentUser();
        console.log(user)
        if (user) {
          // window.location = "https://editwars.org/admin/#"
        }
      })
    })
    netlifyIdentity.on('close', () => {
      process.nextTick(() => {
        const user = netlifyIdentity.currentUser();
        console.log(user)
        if (user) {
          // window.location = "https://editwars.org/admin/#"
        }
      })
    });

    netlifyIdentity.on('login', (user) => {
      netlifyIdentity.close()
    })

    if (netlifyIdentity) {
      netlifyIdentity.open()
    }
  },
  activated () {
  },
  updated () {
  },
  data () {
    return {
    }
  },
  scrollToTop: false,
  computed: {
   
  },
  components: {},
  async asyncData({ $content }) {
  },
  methods: {
  }
}
</script>

<style lang="sass" scoped>
.home
  position: absolute
  z-index: -1
  height: 100%
  // height: 200vh (scroll?)
  display: flex
  justify-content: center
  &_container
    z-index: -1
    height: 100vh
    width: 100%
    display: flex
    align-items: center
    justify-content: center

</style>
