<template>
    <v-container class="mariupol-component" fluid>
        <client-only>
            <a-scene class='scene' embedded vr-mode-ui="enabled: false">
                <a-entity position="39 30 10" rotation="-50 75 0" wasd-controls="acceleration:100; fly: true;" camera="zoom: 0.9"></a-entity>
                <a-sky color="white"></a-sky>
                <a-entity position="0 0 0" :rotation="getRotation" gltf-model="url(models/mariupol_drama_theatre_after_bombing.glb)"></a-entity>
            </a-scene>
        </client-only>
     </v-container>
   </template>
   
   <script>   
   import StepMixin from "@/mixins/StepMixin.js";
   
   export default {
     mixins: [
           StepMixin
         ],
     data () {
       return {
        totalProgress: 0
       }
     },
     computed: {
        getRotation () {
            const p = this.totalProgress
            const y = p * 80
            return `0 ${y} 0`
        }
     },
     mounted () {
     },
     methods: {
     },
     watch: {
        progress: function(newVal, oldVal) {
            this.totalProgress = this.currentStepIndex + newVal
        }
     }
   }
   </script>
   
   <style lang="sass" scoped>
.mariupol-component
    width: 100% !important
    height: 100% !important
.scene
    position: absolute
    width: 100%
    height: 70%
    margin: 0 auto
    left: 0
    display: flex
    align-content: center
    justify-content: center
    align-items: center
    align-self: center
</style>
