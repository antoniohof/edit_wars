<template>
  <div class="wordcloud-page ma-0 pa-0" :class="{ hide: fadeCloud }">
    <iframe
      ref="wordcloud"
      sandbox="allow-scripts allow-same-origin"
      class="wordcloudiframe"
      :src="currentUrl"
    ></iframe>
  </div>
</template>
  
<script>
import StepMixin from "@/mixins/StepMixin.js";
import { getIsMobile } from '@/utils/index.js'
import throttle from 'lodash/throttle'

//"https://editwarsteam.github.io/edit_wars_api/force-graph/index.html?narrative=" +
//"https://mneunomne.github.io/edit_wars_database/force-graph/index.html?narrative=" +
//"http://127.0.0.1:5500/force-graph/index.html?narrative=" +

const WORD_GRAPH_PATH = "https://editwarsteam.github.io/edit_wars_api/force-graph/index.html?narrative="

export default {
  mixins: [StepMixin],
  props: {
    background: {
      type: Object,
    },
    forceFadeOut: {
      type: Boolean,
      default: false
    },
  },
  static() {
    return {};
  },
  data() {
    return {
      isMobile: false,
      lastBackground: "",
      currentUrl: "",
      chartOptions: null,
      wordCloudLoaded: false
    };
  },
  actiavated() {
    console.error("ACTIVATED WORDCLOUD");
  },
  mounted() {
    if (!process.browser) {
      return;
    }
    this.isMobile = getIsMobile()
    if (this.background) {
      let url = WORD_GRAPH_PATH + this.background.name;
      this.setData(this.background, url);
    }
  },
  async asyncData({ $content }) {},
  computed: {
    fadeCloud() {
      return (!!this.background && this.background.component !== "WordCloud") || this.forceFadeOut;
    },
  },
  components: {},

  methods: {
    sendAutoRotate() { (throttle(this.autoRotate, 10))() },
    sendInitialPosition() {
      this.$refs.wordcloud.contentWindow.postMessage({function: "focusOnNode", data: '',},"*");
    },
    autoRotate () {
      console.log('auto rotate')
      //this.$refs.wordcloud.contentWindow.postMessage({ function: "autoRotate",},"*")
    },
    setData(background, url) {
      if (background.keywords) {
        var word = background.keywords;

        if (word) {
          word = word.toLowerCase();
          let node_ids;
          if (word.includes(",")) {
            node_ids = word.split(",");
          } else {
            node_ids = [word];
          }
          node_ids = node_ids.map(id => id.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,""))
          this.$refs.wordcloud.contentWindow.postMessage(
            {
              function: "focusOnNodes",
              data: node_ids,
            },
            "*"
          );
        }
      }
      if (this.lastBackground === background?.name || !url) {
        return;
      }
      this.lastBackground = background?.name || "";
      this.currentUrl = url;
    },
  },
  watch: {
    background(entity) {
      if (entity && entity.component === "WordCloud") {
        let url = WORD_GRAPH_PATH + entity.narrativeName;
        this.setData(entity, url);
      } else {
        if (!this.isMobile) {
          //this.sendAutoRotate()
          this.sendInitialPosition()
        }
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
  transition: opacity 0.4s ease
  will-change: transform
  -webkit-transform: translateZ(0)
  -moz-transform: translateZ(0)
  -ms-transform: translateZ(0)
  -o-transform: translateZ(0)
  transform: translateZ(0)
.hide
  opacity: 0.1 !important
  pointer-events: none !important
</style>
  