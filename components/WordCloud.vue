<template>
  <div class="wordcloud-page ma-0 pa-0" :class="{ hide: fadeCloud }">
    <iframe ref="wordcloud" sandbox="allow-scripts" class="wordcloudiframe" :src="currentUrl"></iframe>
  </div>
</template>
  
<script>
import StepMixin from "@/mixins/StepMixin.js";
import { narratives } from "@/utils/constants.js";

import { escapeCode } from "../utils/DataProcessing";

export default {
  mixins: [StepMixin],
  props: {
    background: {
      type: Object,
    },
  },
  static() {
    return {};
  },
  data() {
    return {
      lastBackground: "",
      currentUrl: "",
      chartOptions: null,
    };
  },
  actiavated() {
    console.error("ACTIVATED WORDCLOUD");
  },
  mounted() {
    console.error("MOUNTED WORDCLOUD");
    if (this.background) {
      console.log("this.background", this.background);
      // let url = 'https://cdn.jsdelivr.net/gh/mneunomne/edit_wars_database/export/' + entity.name + '.json'
      let url =
        "https://mneunomne.github.io/edit_wars_database/force-graph/index.html?narrative=" +
        this.background.name;
      this.setData(this.background, url);
    }
  },
  async asyncData({ $content }) {},
  computed: {
    fadeCloud() {
      return !!this.background && this.background.component !== "WordCloud";
    },
  },
  components: {},

  methods: {
    setData(background, url) {
      console.log("bg", background);
      if (background.chartoptions) {
        this.chartOptions = JSON.parse(escapeCode(background.chartoptions));
        if (this.chartOptions["function"] !== undefined) {
          this.$refs.wordcloud.contentWindow.postMessage({
            function: this.chartOptions["function"],
            data: this.chartOptions["data"],
          }, "*");
        }
      }
      if (this.lastBackground === background?.name || !url) {
        return;
      }
      this.lastBackground = background?.name || "";
      this.currentUrl = url;
      // this.g.resumeAnimation()
    },
  },
  watch: {
    background(entity) {
      if (entity && entity.component === "WordCloud") {
        let url =
          "https://mneunomne.github.io/edit_wars_database/force-graph/index.html?narrative=" +
          entity.name;
        this.setData(entity, url);
      }
    },
  },
  beforeDestroy() {},
};
</script>
  
<style lang="sass">
.wordcloudiframe
  width: 100%
  height: 100%

.wordcloud-page
  display: flex
  background-color: white
  z-index: -1
  flex-direction: column
  align-content: flex-start
  width: 100%
  margin-bottom: 200px
  color: black
  opacity: 0.8
  transition: opacity 0.4s ease
  will-change: transform
  -webkit-transform: translateZ(0)
  -moz-transform: translateZ(0)
  -ms-transform: translateZ(0)
  -o-transform: translateZ(0)
  transform: translateZ(0)
.hide
  opacity: 0.2 !important
  pointer-events: none !important
</style>
  