<template>
  <v-container class="footer" fluid ma-0 pa-0>
    <div class="footer_container">
      <span>©2023 edit wars project</span>
      <span class="terms" @click="goToTerms">Terms & CONDITIONS</span>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      loaded: false
    }
  },
  mounted() {
    setTimeout(()=> {
      this.loaded = true;
    }, 250)
  },
  computed: {},
  methods: {
    goToTerms() {
      this.$router.push('/terms')
    }
  },
  watch: {}
}
</script>
<style lang="sass">
.footer
  width: 100vw
  position: fixed
  bottom: 0
  font-family: Space Mono
  text-transform: uppercase
  vertical-align: bottom
  height: 80px
  z-index: 99
  left: 30px
  color: #8D8D8D
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 75%, rgba(255,255,255,1) 100%)
  &_container
    display: inline-block
    position: absolute
    bottom: 20px
  span
    margin-right: 60px
  @media only screen and (max-width: 480px)
    left: 12px
    height: 60px
    font-size: 12px  
    &_container
      bottom: 10px
    span
      margin-right: 24px
.terms
  cursor: pointer
  &:hover
    font-style: italic
  
</style>