import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    htmlAttrs: {
      lang: 'en'
    },
    title: 'Media Futures 2022',
    titleTemplate: 'Media Futures | %s',
    meta: [
      { charset: 'utf-8' },

      { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
      {
        hid: 'description',
        name: 'description',
        content: 'Description'
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content:
          'art, russia, propaganda'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
      /*
      {
        rel: 'preload',
        as: 'image',
        href: '/img/map.webp',
        type: "image/webp"
      },
      */
      {
        rel: 'preload',
        href: 'fonts/Golos-Text-Regular/Golos-Text_Regular.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: true
      },
      {
        rel: 'preload',
        href: 'fonts/space-mono-v12-latin/space-mono-v12-latin-700.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: true
      },
      {
        rel: 'preload',
        href: 'fonts/space-mono-v12-latin/space-mono-v12-latin-regular.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: true
      }
    ],
    script: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },

    ]
  },
  ssr: true,
  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['~/assets/sass/globals.sass', 'swiper/css/swiper.css'],
  target: 'static',

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/lazysizes.client.js',
    '~/plugins/vue-js-toggle-button.js',
    { src: '~/plugins/nuxt-swiper-plugin.js', mode: 'client' },
    '~/plugins/vue-scrollama.js',
    {
      src: '~plugins/vue-scrollmagic.js',
      ssr: false
    },
    '~/plugins/aframe-ignorelist.js'
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: ['@nuxt/image', '@nuxtjs/vuetify'],
  image: {
    // Generate images to `/_nuxt/image/file.png`
    staticFilename: '[publicPath]/images/[name]-[hash][ext]'
  },
  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/robots',
    '@nuxt/content',
    '@nuxtjs/style-resources',
    '@nuxtjs/sitemap',
    '@nuxtjs/i18n',
    '@blokwise/dynamic'
  ],
  i18n: {
    strategy: 'no_prefix',
    locales: [
      {
        code: 'en',
        iso: 'en-US'
      },
      {
        code: 'ru',
        iso: 'ru-RU'
      }
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'  // recommended
    },
    defaultLocale: 'en',
    vueI18n: {
      fallbackLocale: 'en',
      messages: {
        en: {
          about: 'ABOUT'
        },
        ru: {
          about: 'About Russo'
        }
      }
    }
  },
  hooks: {
    // Doc: https://content.nuxtjs.org/advanced#contentfilebeforeinsert
    'content:file:beforeInsert': async (document, database) => {
      // search for markdown containing 
      // only `specialNotice` property.
      if (document.extension === '.md' && 
          document['body_en']) { 
        // Replace Markdown string in database 
        // with the JSON ATS version
        document['body_en'] = await database 
          .markdown
          .toJSON(document['body_en']) 
      }
      if (document.extension === '.md' && 
          document['body_ru']) {
        // Replace Markdown string in database 
        // with the JSON ATS version
        document['body_ru'] = await database 
          .markdown
          .toJSON(document['body_ru']) 
       }
    }
  },
  styleResources: {
    sass: ['~/assets/sass/variables.sass']
  },
  content: {
    // Options
  },
  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/sass/variables.sass'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  generate: {
    fallback: true,
    routes: [

    ]
  },
  render: {
    bundleRenderer: {
      shouldPreload: (file, type) => {
        return ['script', 'style', 'font'].includes(type)
      }
    }
  },
  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    transpile: [
      "three"
    ],
    extend(config, ctx) {
      config.module.rules.push({
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      })
    },
  },
  sitemap: {
      hostname: "https://edit-wars.netlify.app/",
      routes: [
        '/about'
      ]
  }
}
