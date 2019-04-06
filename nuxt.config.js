export default {
  // server : {
  //   port: 80
  // },
  server: {
    host: '0.0.0.0', // default: localhost
  },
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
