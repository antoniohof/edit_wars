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
        }
      }
  }