export default {
    props: {
        step: {
            type: Object,
            required: true
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