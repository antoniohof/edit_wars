<template>
    <v-container class="mariupol-component" fluid ma-0 pa-0>
        <client-only>
        <a-scene class='scene' embedded>
            <a-entity position="39 24 10" rotation="-50 75 0" wasd-controls="acceleration:100; fly: true;" camera></a-entity>
            <a-sky color="white"></a-sky>
            <a-entity position="0 0 0" :rotation="`0 ${300*progress} 0`" gltf-model="url(models/mariupol_drama_theatre_after_bombing.glb)"></a-entity>
        </a-scene>
        </client-only>
     </v-container>
   </template>
   
   <script>   
   import StepMixin from "@/mixins/StepMixin.js";
   
   export default {
     head () {
       return {
         script: [
               {src: 'https://unpkg.com/aframe/dist/aframe-master.min.js'}
           ]
       }
     },
     mixins: [
           StepMixin
         ],
     data () {
       return {
       }
     },
     computed: {
     },
     mounted () {
     },
     methods: {
     },
     watch: {
     }
   }
   </script>
   
   <style lang="sass" scoped>
.mariupol-component
  display: flex
  flex-direction: column
  align-content: center
  justify-content: center
  width: 100vw
  height: 100vh
.scene
    position: absolute
    width: 100vw
    height: fit-content
    margin: 0 auto
    left: 0
    display: flex
    height: 100vh
    align-content: center
    justify-content: center
    align-items: center
    align-self: center
    padding: 0px 20px 0px 20px !important
</style>
