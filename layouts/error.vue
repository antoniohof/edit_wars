<template>
  <v-container light class='error-page'>
    <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <NuxtLink to="/">
      go back
    </NuxtLink>
  </v-container>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      pageNotFound: 'Oops where am I?',
      otherError: 'An error occurred'
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style lang="sass" scoped>
.error-page
  display: flex
  flex-direction: column
  justify-content: center
  width: 100%
  height: 100%
  align-items: center
  justify-content: center
  justify-items: center
  align-content: center
  text-align: center
h1
  font-size: 20px
</style>
