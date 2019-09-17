<template>
  <span>
    {{ urlstring }}
    (MyNSA: {{urlstring2}})
    {{  }}
    {{  }}
  </span>
</template>

<script>
export default {
  data () {
    return {
      urlstring: this.$nuxt.$route.params.urlized,
      urlstring2: '',
      name: '',
    }
  },
  methods: {
    getRelated(name) {
      let name__ = name.toLowerCase()
      let name_ = name__.split(' ')
      this.urlstring2 = name__
      // ask for stats && potential networks && all related networks in a graph
      // listar alias potenciais p nomes:
      // fabri fabbri, etc
    },
  },
  mounted () {
    window.__this = this
    // this.name_ = this.urlstring.replace(/([a-zA-Z]) ([a-zA-Z])/g, '$1 $2')
    if (this.urlstring)
      this.name = this.urlstring.replace(/([a-z])([A-Z])/g, '$1 $2')
    this.getRelated(this.name)
  },
}
</script>
