<template>
  <div>
    Hello
  </div>
</template>

<script>
// global.fetch = require("node-fetch")
// // window.fetch = require("node-fetch")
// import * as d3 from 'd3'
// import fetch from 'node-fetch'
// global.fetch = fetch
import $ from 'jquery'

// const enet = require('~/static/E-MTAB-2706-query-results.tpms.tsv')
export default {
  data () {
    return {
    }
  },
  mounted () {
    // d3.tsv('E-MTAB-2706-query-results.tpms.tsv', function(data) {
    //     // use data here
    //     window.adata = data
    //     console.log('tsv loaded')
    // });
    $.get('E-MTAB-2706-query-results.tpms.tsv', data => {
      console.log('before split')
      window.mdata = data.split(/\r?\n/)
      console.log('after split')
    })
  }
}
</script>
