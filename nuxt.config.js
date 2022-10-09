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

      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, shrink-to-fit=no'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'Description'
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content: 'art, russia, propaganda'
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
        href: '/fonts/space-mono-v12-latin/Space_Mono/SpaceMono-Italic.ttf',
        as: 'font',
        type: 'font/ttf',
        crossorigin: true
      },
      {
        rel: 'preload',
        href: '/fonts/Golos-Text-Regular/Golos-Text_Regular.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: true
      },
      {
        rel: 'preload',
        href: '/fonts/space-mono-v12-latin/space-mono-v12-latin-700.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: true
      },
      {
        rel: 'preload',
        href: '/fonts/space-mono-v12-latin/space-mono-v12-latin-regular.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: true
      }
    ],
    script: []
  },
  ssr: true,
  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['~/assets/sass/globals.sass'],
  target: 'static',

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/lazysizes.client.js',
    '~/plugins/vue-js-toggle-button.js',
    '~/plugins/vue-scrollama.js',
    '~/plugins/aframe-ignorelist.js',
    {
      src: '~/plugins/vue-static.js',
      mode: 'client'
    },
    {
      src: '~/plugins/vue-typewriter.js',
      mode: 'client',
      ssr: false
    }
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
      }
      /*,
      {
        code: 'ru',
        iso: 'ru-RU'
      }
      */
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root' // recommended
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
      if (document['body_en']) {
        // Replace Markdown string in database
        // with the JSON ATS version
        document['body_en'] = await database.markdown.toJSON(
          document['body_en']
        )
      }
      if (document['body_ru']) {
        // Replace Markdown string in database
        // with the JSON ATS version
        document['body_ru'] = await database.markdown.toJSON(
          document['body_ru']
        )
      }

      if (document['aboutmain_en']) {
        // Replace Markdown string in database
        // with the JSON ATS version
        document['aboutmain_en'] = await database.markdown.toJSON(
          document['aboutmain_en']
        )
      }

      if (document['aboutmain_ru']) {
        // Replace Markdown string in database
        // with the JSON ATS version
        document['aboutmain_ru'] = await database.markdown.toJSON(
          document['aboutmain_ru']
        )
      }

      if (document['aboutgoals_en']) {
        // Replace Markdown string in database
        // with the JSON ATS version
        document['aboutgoals_en'] = await database.markdown.toJSON(
          document['aboutgoals_en']
        )
      }
      if (document['aboutgoals_ru']) {
        // Replace Markdown string in database
        // with the JSON ATS version
        document['aboutgoals_ru'] = await database.markdown.toJSON(
          document['aboutgoals_ru']
        )
      }
      if (document['aboutmethodology_en']) {
        // Replace Markdown string in database
        // with the JSON ATS version
        document['aboutmethodology_en'] = await database.markdown.toJSON(
          document['aboutmethodology_en']
        )
      }
      if (document['aboutmethodology_ru']) {
        // Replace Markdown string in database
        // with the JSON ATS version
        document['aboutmethodology_ru'] = await database.markdown.toJSON(
          document['aboutmethodology_ru']
        )
      }
      if (document['aboutteam_en']) {
        // Replace Markdown string in database
        // with the JSON ATS version
        document['aboutteam_en'] = await database.markdown.toJSON(
          document['aboutteam_en']
        )
      }
      if (document['aboutteam_ru']) {
        // Replace Markdown string in database
        // with the JSON ATS version
        document['aboutteam_ru'] = await database.markdown.toJSON(
          document['aboutteam_ru']
        )
      }
      if (document['aboutcontact_en']) {
        // Replace Markdown string in database
        // with the JSON ATS version
        document['aboutcontact_en'] = await database.markdown.toJSON(
          document['aboutcontact_en']
        )
      }
      if (document['aboutcontact_ru']) {
        // Replace Markdown string in database
        // with the JSON ATS version
        document['aboutcontact_ru'] = await database.markdown.toJSON(
          document['aboutcontact_ru']
        )
      }
      if (document['abouttools_en']) {
        // Replace Markdown string in database
        // with the JSON ATS version
        document['abouttools_en'] = await database.markdown.toJSON(
          document['abouttools_en']
        )
      }
      if (document['abouttools_ru']) {
        // Replace Markdown string in database
        // with the JSON ATS version
        document['abouttools_ru'] = await database.markdown.toJSON(
          document['abouttools_ru']
        )
      }
      if (document['aboutfunding_en']) {
        // Replace Markdown string in database
        // with the JSON ATS version
        document['aboutfunding_en'] = await database.markdown.toJSON(
          document['aboutfunding_en']
        )
      }
      if (document['aboutfunding_ru']) {
        // Replace Markdown string in database
        // with the JSON ATS version
        document['aboutfunding_ru'] = await database.markdown.toJSON(
          document['aboutfunding_ru']
        )
      }
      if (document['aboutcontext_en']) {
        // Replace Markdown string in database
        // with the JSON ATS version
        document['aboutcontext_en'] = await database.markdown.toJSON(
          document['aboutcontext_en']
        )
      }
      if (document['aboutcontext_ru']) {
        // Replace Markdown string in database
        // with the JSON ATS version
        document['aboutcontext_ru'] = await database.markdown.toJSON(
          document['aboutcontext_ru']
        )
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
        light: {
          primary: colors.grey.darken1, // #E53935
          secondary: colors.grey.lighten4, // #FFCDD2
          accent: colors.grey.base // #3F51B5
        },
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
    routes: []
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
      'three'
      /*
      'd3-force-3d',
      'd3-dispatch',
      'd3-timer',
      'd3-array',
      'internmap',
      'd3-scale',
      'd3-time',
      'd3-interpolate',
      'three-spritetext',
      'd3-color',
      'd3-format',
      'd3-quadtree'
      */
    ],
    extend(config, ctx) {
      config.module.rules.push({
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      })
    }
  },
  sitemap: {
    hostname: 'https://edit-wars.netlify.app/',
    routes: ['/about']
  }
}
