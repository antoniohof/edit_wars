<template>
  <v-container fluid class="ma-0 pa-0">
    <div
      :class="{ blur: isBlurred, nopoint: isNoPoint }"
      class="narrative-graph-page"
    >
      .
    </div>
  </v-container>
</template>
  
<script>
import { narratives } from "@/utils/constants.js";
import { getIsMobile } from "@/utils/index.js";
import SpriteText from "three-spritetext";
import * as THREE from "three";
export default {
  data() {
    return {
      loading: false,
      g: null,
      currentRoute: "/",
      fonts: [],
      animation: null,
      angle: 0,
      interacted: false,
    };
  },
  scrollToTop: true,
  mounted() {
    document.addEventListener("mousedown", () => {
      this.interacted = true;
    });
    document.addEventListener("touchstart", () => {
      this.interacted = true;
    });

    console.log("mounted narratives");
    if (!process.browser) {
      return;
    }
    this.loading = false;
    this.currentRoute = this.$nuxt.$route.path;
    process.nextTick(() => {
      this.buildGraph();
      setTimeout(() => {
        this.calculateOpacities();
      }, 100);
    });
  },
  beforeUnmount() {
    document.removeEventListener("mousedown", () => {
      this.interacted = true;
    });
    document.removeEventListener("touchstart", () => {
      this.interacted = true;
    });
  },
  async asyncData({ $content }) {},
  computed: {
    isNoPoint() {
      if (!process.browser) {
        return false;
      }
      return $nuxt.$route.path === "/";
    },
    isBlurred() {
      if (!process.browser) {
        return false;
      }
      return $nuxt.$route.path === "/about";
    },
  },
  components: {},

  methods: {
    step() {
      // camera orbit
      if (this.interacted) {
        // stop animation
        return;
      }
      let distance = 400;
      if (getIsMobile()) {
        distance = 700;
      }

      this.g.cameraPosition({
        x: distance * Math.sin(this.angle),
        z: distance * Math.cos(this.angle),
      });
      let speed = 1000;
      if (this.currentRoute === "/narratives") {
        speed = 1200;
      }
      this.angle += Math.PI / speed;
      this.animation = requestAnimationFrame(this.step);
    },
    calculateOpacities() {
      process.nextTick(() => {
        this.fonts.forEach((ob) => {
          const sphereMat = ob.materials[1];
          let textMat = ob.materials[0];
          if (window.location.pathname == "/narratives") {
            textMat.opacity = ob.node?.disabled ? 0 : 1;
            sphereMat.opacity = ob.node?.disabled ? 0.3 : 1;
          } else {
            console.log("not narrative pages");
            textMat.opacity = 0;
            sphereMat.opacity = 1;
          }
        });
      });
    },
    buildGraph() {
      let ForceGraph3D;
      if (window) {
        ForceGraph3D = require("3d-force-graph").default;
      } else {
        return;
      }
      const el = document.querySelector(".narrative-graph-page");
      const g = ForceGraph3D()(el);
      const N = 3;
      let dimensions = 3;
      if (getIsMobile()) {
        dimensions = 2;
      }
      let n = [...narratives];
      const data = n.map((narrative) => ({
        id: narrative.id,
        label: narrative.name,
        path: narrative.slug,
        disabled: narrative.disabled,
      }));
      const ds = data.filter((d) => !!d);
      const nums = new Set();
      while (nums.size !== 2) {
        const num = Math.floor(Math.random() * ds.length - 1);
        if (num > 0) {
          nums.add(num);
        }
      }
      const arr = [...nums];

      var links = ds.map((n) => ({
        source: ds.filter((d) => d.id !== n.id)[arr[0]],
        target: n.id,
        color: "rgba(0,0,0,1)",
      }));

      var links2 = ds.map((n) => ({
        source: ds.filter((d) => d.id !== n.id)[arr[1]],
        target: n.id,
        color: "rgba(0,0,0,1)",
      }));
      const gData = {
        nodes: ds,
        links: links.concat(links2),
      };

      let fontSize = 6;
      let scale = 0.8;
      let position = 10;
      if (getIsMobile()) {
        fontSize = 18;
        scale = 2.5;
        position = 38;
      }
      g.graphData(gData)
        .backgroundColor("rgba(0,0,0,0)")
        .linkWidth(0.2)
        .showNavInfo(false)
        .numDimensions(dimensions)
        .linkOpacity(1.0)
        .onNodeClick(this.onNodeClick)
        .nodeThreeObject((node) => {
          const group = new THREE.Group();
          if (node.id > 0) {
            const geometry = new THREE.SphereGeometry(5, 64, 64);
            let op = 1;
            const matSphere = new THREE.MeshBasicMaterial({
              color: 0x000000,
              opacity: op,
              transparent: true,
            });
            const sphere = new THREE.Mesh(geometry, matSphere);
            sphere.scale.set(scale, scale, scale);
            const sprite = new SpriteText(node.label.toUpperCase());
            sprite.fontFace = "Space Mono Italic";
            sprite.material.depthWrite = false; // make sprite background transparent
            sprite.material.opacity = 0;

            this.fonts.push({
              node: node,
              materials: [sprite.material, matSphere],
            });

            sprite.color = node.color;
            sprite.textHeight = fontSize;
            group.add(sprite);

            sprite.position.set(0, position, 0);
            group.add(sphere);
          }
          return group;
        });
      this.g = g;
      process.nextTick(() => {
        if (getIsMobile()) {
          g.d3Force("charge").strength(-1500);
        } else {
          g.d3Force("charge").strength(-2200);
        }
        g.controls().noPan = true;
        g.controls().noZoom = true;
        setTimeout(() => {
          if (getIsMobile()) {
            g.cameraPosition(
              { x: 0, y: 0, z: 800 }, // new position
              0, // lookAt ({ x, y, z })
              500 // ms transition duration
            );
          }
        }, 10);
      });
      window.addEventListener("resize", this.onWindowResize, false);
      // if (!this.isMobile()) {
      this.animation = requestAnimationFrame(this.step);
      // }
    },
    onWindowResize() {
      console.log("on Window Resize");
      this.g.width(window.innerWidth);
      this.g.height(window.innerHeight);
    },
    onNodeClick(node) {
      if (!node.disabled && this.currentRoute === "/narratives") {
        this.loading = true;
        this.$router.push({ path: "/narratives/" + node.path });
      }
    },
  },
  watch: {
    "$nuxt.$route.path"(val) {
      console.log("NEW ROUTE", val);
      this.currentRoute = val;
      console.log("graph", this.g);
      this.calculateOpacities();
    },
  },
  beforeDestroy() {
    cancelAnimationFrame(this.animation);
  },
};
</script>
  
  <style lang="sass">
@font-face
  font-family: "Space Mono Italic"
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
    filter: blur(10px)
    opacity: 0.7
    transition: all 0.4s ease
  .nopoint
    pointer-events: none
</style>
  