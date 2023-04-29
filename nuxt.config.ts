import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'

export default defineNuxtConfig({
  target: 'static',

  app: {
  baseURL: '/nuxt-color-palette/',
    head: {
      title: 'Color Palette Generator',
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    ['unplugin-icons/nuxt', { autoInstall: true }]
  ],

  pinia: {
    autoImports: [
      'defineStore', 
      ['defineStore', 'definePiniaStore'], 
    ],
  },

  vite: {
    plugins: [
        Components({
            resolvers: IconsResolver(),
        }),
        Icons(),
    ]
},

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // extends: [
  //   'github:michaelsynan/nuxt-base-layer#master'
  // ]
  css: ['@/assets/css/main.css'],

  devtools: {
    enabled: true
  }
});
