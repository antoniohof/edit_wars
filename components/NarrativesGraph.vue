<template>
  <div :class="{'blur': isBlurred, 'nopoint': isNoPoint }" class="narrative-graph-page">.</div>
</template>
  
<script>
  import { narratives } from '@/utils/constants.js'
  import SpriteText from 'three-spritetext'
  import * as THREE from 'three'
  export default {
    data() {
      return {
        g: null,
        currentRoute: '/',
        fonts: [],
        animation: null,
        angle: 0
      }
    },
    scrollToTop: true,
    mounted () {
      console.log('mounted narratives')
      if (!process.browser) {
        return
      }

      this.currentRoute = this.$nuxt.$route.path
      process.nextTick(() => {
        this.buildGraph()
        setTimeout(() => {
          this.calculateOpacities()
        }, 100)
      })
    },
    async asyncData({ $content }) {},
    computed: {
      isNoPoint () {
        if (!process.browser) {
          return false
        }
        return $nuxt.$route.path === '/'
      },
      isBlurred () {
        if (!process.browser) {
          return false
        }
        return $nuxt.$route.path === '/about'
      }
    },
    components: {},
  
    methods: {
      step () {
        // camera orbit
        let distance = 400
        if (this.isMobile()) {
          distance = 700
        }

          this.g.cameraPosition({
            x: distance * Math.sin(this.angle),
            z: distance * Math.cos(this.angle)
          })
          let speed = 1000
          if (this.currentRoute === '/narratives') {
            speed = 12000
          }
          this.angle += Math.PI / speed
          this.animation = requestAnimationFrame(this.step)
      },
      calculateOpacities () {
        process.nextTick(() => {
          this.fonts.forEach((ob) => {
            const mat = ob.material
            if (window.location.pathname == "/narratives") {
              if (this.isMobile()) {
                mat.opacity = ob.node?.disabled ? 0 : 1
              } else {
                mat.opacity = ob.node?.disabled ? 0.25 : 1
              }
            } else {
              console.log('not narrative pages')
              mat.opacity = 0
            }
          })
        })
      },
      buildGraph () {
        let ForceGraph3D
        if (window) {
          ForceGraph3D = require('3d-force-graph').default
        } else {
          return
        }
        const el = document.querySelector('.narrative-graph-page')
        const g = ForceGraph3D()(el)
        const N = 3
        let dimensions = 3
        if (this.isMobile()) {
          dimensions = 2
        }
        let n = [...narratives]
        const data = n.map((narrative) => ({
          id: narrative.id,
          label: narrative.name,
          path: narrative.slug,
          disabled: narrative.disabled
        }))
        const ds = data.filter((d) => !!d)

        
        /*
        // empty node to conect all
        ds.push({
          id: 0,
          label: '',
          path: ''
        })
        */

        const nums = new Set();
        while(nums.size !== 2) {
          const num = Math.floor(Math.random() * ds.length - 1)
          if (num > 0) {
            nums.add(num);
          }
        }
        const arr = [...nums]

        var links = ds.map((n) => ({
          source: ds.filter(d=> d.id !== n.id)[arr[0]],
          target: n.id,
          color: 'rgba(0,0,0,1)'
        }))
        
        var links2 = ds.map((n) => ({
          source: ds.filter(d=> d.id !== n.id)[arr[1]],
          target: n.id,
          color: 'rgba(0,0,0,1)'
        }))
        const gData = {
          nodes: ds,
          links: links.concat(links2)
        }

        let fontSize = 6
        let scale = 0.8
        let position = 10
        if (this.isMobile()) {
          fontSize = 15
          scale = 2
          position = 30
        }
        g.graphData(gData)
          .backgroundColor('rgba(0,0,0,0)')
          .linkWidth(0.2)
          .showNavInfo(false)
          .numDimensions(dimensions)
          .linkOpacity(1.0)
          .onNodeClick(this.onNodeClick)
          .nodeThreeObject((node) => {
            const group = new THREE.Group()
            if (node.id > 0) {
              const geometry = new THREE.SphereGeometry(5, 64, 64)
              const material = new THREE.MeshBasicMaterial({ color: 0x000000 })
              const sphere = new THREE.Mesh(geometry, material)
              sphere.scale.set(scale, scale, scale)
              const sprite = new SpriteText(node.label.toUpperCase())
              sprite.fontFace = 'Space Mono Italic'
              sprite.material.depthWrite = false // make sprite background transparent
              sprite.material.opacity = 0 
              
              this.fonts.push({
                node: node,
                material: sprite.material
              })  
              
              sprite.color = node.color
              sprite.textHeight = fontSize
              group.add(sprite)
    
              sprite.position.set(0, position, 0)
              group.add(sphere)
            }
            g.controls().noPan = true
            g.controls().noZoom = true
            setTimeout(() => {
              if (this.isMobile()) {

                g.cameraPosition(
                  { x: 0, y: 0, z: 1200 }, // new position
                  0, // lookAt ({ x, y, z })
                  500  // ms transition duration
                );
              }
            }, 10)
            return group
          })
        this.g = g
        process.nextTick(() => {
          if (this.isMobile()) {
            g.d3Force('charge').strength(-1000)
          } else {
            g.d3Force('charge').strength(-800)
          }
        })
        window.addEventListener( 'resize', this.onWindowResize, false )
        if (!this.isMobile()) {
          this.animation = requestAnimationFrame(this.step)
        }

      },
      isMobile() {
        let check = false
        ;(function (a) {
          if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
              a
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
              a.substr(0, 4)
            )
          )
            check = true
        })(navigator.userAgent || navigator.vendor || window.opera)
        return check
      },
      onWindowResize () {
        console.log('on Window Resize')
        this.g.width(window.innerWidth)
        this.g.height(window.innerHeight)
      },
      onNodeClick(node) {
        if (!node.disabled && this.currentRoute === '/narratives') {
          this.$router.push({ path: '/narratives/' + node.path })
        }
      }
    },
    watch: {
      "$nuxt.$route.path" (val) {
        console.log('NEW ROUTE', val)
        this.currentRoute = val
        console.log('graph', this.g)
        this.calculateOpacities()
      }
    },
    beforeDestroy() {
      cancelAnimationFrame(this.animation)
    }
  }
  </script>
  
  <style lang="sass">
  @font-face
    font-family: "Space Mono Italic"
    font-style: italic
    src: url(/fonts/space-mono-v12-latin/Space_Mono/SpaceMono-Italic.ttf) format("truetype")

  .narrative-graph-page
    position: fixed
    top: 0
    left: 0
    font-family: Space Mono Italic !important
    display: flex
    background-color: white
    flex-direction: column
    align-content: flex-start
    color: white
    width: 100vw
    height: 100vh
    color: black
    filter: blur(0px)
  .blur
    filter: blur(3px)
    transition: all 0.4s ease
  .nopoint
    pointer-events: none


  </style>
  