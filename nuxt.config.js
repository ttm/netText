export default {
  // server : {
  //   port: 80
  // },
  env: {
    nuxtURL: process.env.nuxtURL || '127.0.0.1:3000',
    feathersURL: process.env.feathersURL || '127.0.0.1:3030',
    flaskURL: process.env.flaskURL || '127.0.0.1:5000',
  },
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
