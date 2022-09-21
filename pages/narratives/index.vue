<template>
    <v-container class="narratives-page" fluid>
      NARRATIVES
    </v-container>
  </template>
  
  <script>
  
  export default {
    head: {
      title: 'Narratives',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Narratives Page'
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

    },
    computed: {

    },
    components: {},
  
    methods: {
    },
    watch: {
  
    }
  }
  </script>

  <style lang="sass">
  
  .narratives-page
    display: flex
    flex-direction: column
    align-content: flex-start
    width: 100%
    margin-bottom: 200px
    color: black
  
  </style>
  