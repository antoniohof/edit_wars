<template>
  <v-container class="terms-page" fluid>
    <div class="terms-page-title">
      <p>TERMS & CONDITIONS</p>
      <p>Research data, including datasets and methodology, provided on this site is licensed under the Creative Commons Attribution-NonCommercial (CC-BY-NC) license. This means that you are free to share and adapt the material, but you must give appropriate credit, provide a link to the license, and indicate if changes were made. You may not use the material for commercial purposes.</p>
      <p>Illustrations and text fragments from this site may be used with proper attribution. The source name (Edit Wars Project) and a hyperlink to the site (editwars.org) must be included when using any content from this site.</p>
      <p>By using the data, illustrations, and text fragments on this site, you agree to these terms of use.</p>
    </div>
  </v-container>
</template>

<script>
export default {
  head: {
    title: 'Terms of Service',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Terms of Service'
      }
    ]
  },
  scrollToTop: true,
  transition: ''
}
</script>
<style lang="sass" scoped>
.terms-page
  display: flex
  margin-top: 10px
  flex-direction: column
  width: 100%
  height: 90%
  margin-top: 40px
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
</style>