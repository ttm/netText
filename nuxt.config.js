export default {
  modules: [
    '@nuxtjs/vuetify'
  ],
  css: [
    '@/css/main.css'
  ],
  build: {
    extend (config, {isDev, isClient}) {
      config.externals = {
        oimo: true,
        cannon: true,
        earcut: true
      }
    }
  }
}
