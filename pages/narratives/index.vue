<template>
    <v-container class="narratives-page ma-0 pa-0" fluid>

    </v-container>
  </template>
  
  <script>
import SpriteText from 'three-spritetext';
import * as THREE from 'three'
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
          const el = document.querySelector('.narratives-page')
          const g = window.ForceGraph3D()(el)
          const N = 5;
          const gData = {
          nodes: [...Array(N).keys()].map(i => ({ id: i, label: 'Narrative ' + i })),
          links: [...Array(N).keys()]
              .filter(id => id)
              .map(id => ({
              source: id,
              target: 0,
              color: 'rgba(0,0,0,1)'
              }))
          };
      g.graphData(gData)
      .backgroundColor('rgba(0,0,0,0)')
      .nodeLabel('id')
      .linkWidth(1)
      .linkOpacity(1.0)
      .onNodeClick(this.onNodeClick)
      .nodeThreeObject(node => {
        const group = new THREE.Group()
        if (node.id > 0) {
          console.log(group)
          const geometry = new THREE.SphereGeometry( 5, 32, 16 );
          const material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
          const sphere = new THREE.Mesh( geometry, material );
          const sprite = new SpriteText(node.label);
          sprite.material.depthWrite = false; // make sprite background transparent
          sprite.color = node.color;
          sprite.textHeight = 8;
          group.add(sprite)
          sprite.position.set(0,10,0)
          group.add(sphere)
        }

          return group;
        });
    },
    async asyncData({ $content }) {

    },
    computed: {

    },
    components: {},
  
    methods: {
      onNodeClick (node) {
        this.$router.push({path: 'narratives/' + node.id });
      }
    },
    watch: {
  
    },
    beforeDestroy() {
      console.log(window.ForceGraph3D)
    }
  }
  </script>

  <style lang="sass">
  
  .narratives-page
    display: flex
    background-color: white
    flex-direction: column
    align-content: flex-start
    width: 100%
    margin-bottom: 200px
    color: black
  
  </style>
  