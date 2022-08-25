export default {
  props: {
      step: {
          type: Object,
          required: true
      },
      currentStepIndex: {
          type: Number,
          default: 0
      },
      progress: {
          type: Number,
          default: 0
      }
    },
  data: () => ({
  }),
  methods: {

  },
  computed: {
      currentBody () {
        return 'body_' + this.$i18n.locale
      },
      hasTitle () {
        return !!(this.step['title_en'] || this.step['title_ru'])
      },
      currentTitle () {
        const title = 'title_' + this.$i18n.locale
        return this.step[title]
      }
    }
}