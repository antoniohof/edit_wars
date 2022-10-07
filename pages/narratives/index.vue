<template>
  <v-container class="narratives-page ma-0 pa-0" fluid> </v-container>
</template>

<script>
import { narratives } from '@/utils/constants.js'
import SpriteText from 'three-spritetext'
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
  data() {
    return {
      g: null
    }
  },
  scrollToTop: true,
  mounted () {
    let ForceGraph3D
    if (window) {
      ForceGraph3D = require('3d-force-graph').default
    } else {
      return
    }
    const el = document.querySelector('.narratives-page')
    const g = ForceGraph3D()(el)
    const N = 3
    const data = narratives.map((narrative) => ({
      id: narrative.id,
      label: narrative.name,
      path: narrative.slug
    }))
    const ds = data.filter((d) => !!d)
    // empty node to conect all
    ds.push({
      id: 0,
      label: '',
      path: ''
    })
    var links = ds.map((n) => ({
      source: 0,
      target: n.id,
      color: 'rgba(0,0,0,1)'
    }))

    const gData = {
      nodes: ds,
      links: links
    }
    let fontSize = 8
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
      .numDimensions(2)
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
            g.zoomToFit(150)
          }
        }, 10)
        return group
      })
    this.g = g
    if (this.isMobile()) {
      g.d3Force('charge').strength(-1000)
    } else {
      g.d3Force('charge').strength(-1800)
    }
    window.addEventListener( 'resize', this.onWindowResize, false );

  },
  async asyncData({ $content }) {},
  computed: {},
  components: {},

  methods: {
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
      this.g.width(window.innerWidth)
      this.g.height(window.innerHeight)
    },
    onNodeClick(node) {
      this.$router.push({ path: '/narratives/' + node.path })
    }
  },
  watch: {},
  beforeDestroy() {}
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
