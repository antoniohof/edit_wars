<template>
  <v-container fluid class="home ma-0 pa-0">
    <v-container fluid class="intro pa-0">
      <div class="intro-background"></div>
      <transition name="fadelongo">
        <div v-show="showName" class="intro-title">EDIT WARS</div>
      </transition>
    </v-container>
    <client-only>
      <vue-typer
        :type-delay="10"
        :repeat="0"
        :text="getTextToShow"
        :erase-on-complete="false"
        class="intro-text"
        v-if="isScrolled"
      >
      </vue-typer>
    </client-only>
    <transition name="fade">
      <div class="arrow" v-show="!isScrolled || endScroll" @click="onClickArrow">
        <div class="adjuster">
          <img src="~/assets/icons/arrow.svg" />
        </div>
      </div>
    </transition>
  </v-container>
</template>

<script>
import throttle from 'lodash/throttle'
import SpriteText from 'three-spritetext'
import * as THREE from 'three'
import { request } from 'http'
import EventBus from '@/utils/event-bus'

export default {
  scrollToTop: true,
  head() {
    return {
      // script: [{ src: 'https://unpkg.com/aframe/dist/aframe-master.min.js' }]
    }
  },
  components: {},
  beforeMount() {},
  mounted() {
    window.scrollTo(0, 0)
    setTimeout(() => {
      this.showName = true
    }, 700)
    window.addEventListener('scroll', this.handleScroll)
    /*
    let ForceGraph3D
    if (window) {
      ForceGraph3D = require('3d-force-graph').default
    } else {
      return
    }
    const el = document.querySelector('.intro-background')
    const g = ForceGraph3D()(el)

    const N = 30
    const gData = {
      nodes: [...Array(N).keys()].map((i) => ({ id: i })),
      links: [...Array(N).keys()]
        .filter((id) => id)
        .map((id) => ({
          source: id,
          target: Math.round(Math.random() * (id - 1))
        }))
    }
    this.g = g
    g.graphData(gData)
      .backgroundColor('rgba(0,0,0,0)')
      .nodeLabel('id')
      .linkWidth(0.5)
      .showNavInfo(false)
      .numDimensions(3)
      .linkOpacity(1.0)
      .onNodeClick(this.onNodeClick)
      .nodeThreeObject((node) => {
        const group = new THREE.Group()
        if (node.id > 0) {
          const geometry = new THREE.SphereGeometry(5, 64, 64)
          const material = new THREE.MeshBasicMaterial({ color: 0x000000 })
          const sphere = new THREE.Mesh(geometry, material)
          const sprite = new SpriteText(node.label)
          sprite.fontFace = 'Space Mono'
          sprite.material.depthWrite = false // make sprite background transparent
          sprite.color = node.color
          sprite.textHeight = 8
          group.add(sprite)
          sprite.position.set(0, 10, 0)
          group.add(sphere)
        }
        return group
      })
    let distance = 500
    g.d3Force('charge').strength(-85)

    // camera orbit
    let angle = 0
    const step = () => {
      g.cameraPosition({
        x: distance * Math.sin(angle),
        z: distance * Math.cos(angle)
      })
      angle += Math.PI / 1000
      this.animation = requestAnimationFrame(step)
    }

    this.animation = requestAnimationFrame(step)

    // window.addEventListener( 'resize', this.onWindowResize, false );
    */
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
    // window.removeEventListener( 'resize', this.onWindowResize );

    cancelAnimationFrame(this.animation)
  },
  activated() {},
  updated() {},
  data() {
    return {
      g: null,
      animation: null,
      isScrolled: false,
      endScroll: false,
      showName: false
    }
  },
  computed: {
    getTextToShow () {
      return this.isMobile() ? this.getTextMobile : this.getText
    },
    getText() {
      return 'The monopoly on information is a key propaganda tool. \nUsing it, a state is able to shape a non-alternative \npicture of the world.\n \nNowadays, not only does the Russian government wage a war \nin Ukraine, but it also works hard on shaping the \ninformation reality using propaganda narratives. \n \nThis is an data and art research project showing how propaganda \nnarratives are reproduced in the Russian-language digital \nmedia in the closed space of destroyed media freedom.'
    },
    getTextMobile() {
      return 'The monopoly on \ninformation is a key \npropaganda tool. Using it, \na state is able to shape a \nnon-alternative picture of \nthe world. \n\nNowadays, not only does \nthe Russian government \nwage a war in Ukraine, but \nit also works hard on \nshaping the information \nreality using propaganda \nnarratives. \n \nThis is an data and art \nresearch project showing how \npropaganda narratives are \nreproduced in the Russian-\nlanguage digital media in \nthe closed space of \ndestroyed media freedom.'
    }
  },
  components: {},
  async asyncData({ $content, params, error }) {},
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
    handleScroll() {
      if (window.scrollY > 100) {
        if (!this.isScrolled) {
          EventBus.$emit('introsecond')
        }
        this.isScrolled = true
      } else {
        if (this.isScrolled) {
          EventBus.$emit('introfirst')
        }
        this.isScrolled = false
      }
      if (window.scrollY > (window.innerHeight - 200)) {
        this.endScroll = true
      } else {
        this.endScroll = false
      }
      const text = document.querySelector('.intro-title')
      const percentage = window.scrollY / window.innerHeight
      const x = percentage * window.innerWidth
      text.style.transform = `translateX(${-x}px)`
    },
    onClickArrow() {
      if (this.endScroll) {
        this.$router.push({ path: '/narratives'})
      } else {
        window.scrollTo({
          top: window.innerHeight,
          left: 0,
          behavior: 'smooth'
        })
      }
    }
  }
}
</script>

<style lang="sass" scoped>

.home
  height: 175vh
  display: flex
  flex-direction: column
  width: 100vw
  color: black
  position: relative
  align-content: flex-start
  justify-content: flex-start
  align-items: flex-start
  overflow-y: hidden !important
  @media only screen and (max-width: 480px)
    height: 188vh

.intro
  height: calc(100vh - 64px)
  margin: 0px
  display: flex
  flex-direction: column
  justify-content: center

.intro-background
  position: fixed
  pointer-events: none
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  z-index: 0
  opacity: 1.0
  transition: opacity 0.4s ease
.intro-title
  z-index: 20
  width: 100%
  pointer-events: none
  margin-top: -64px
  position: relative
  font-size: 16vw
  font-weight: 700
  user-select: none
  white-space: nowrap
  font-family: Space Mono
  text-align: center
  display: flex
  justify-content: center
  align-content: center
  transition: transform 0.5s ease
  align-items: center
  &:after
    content: none !important

.intro-text
  height: 75vh
  font-family: Space Mono !important
  font-size: 35px
  padding: 0px 64px 0px 64px
  z-index: 5
  color: black
  @media only screen and (max-width: 480px)
    padding: 0px 15px 0px 15px
    font-size: 20px

</style>
