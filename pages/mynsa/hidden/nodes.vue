<template>
  <span>
    <h1>
      Nodes (MyNSA)
    </h1>
    <h3>
    </h3>
    <ul>
      <li>
        List all nodes in current LOSD (maybe only FB for now). 
      </li>
      <li>
        Maybe stats and names of special sets of participants,
        about whole network.
      </li>
      <li>
        Link to MyNSA base URL, where the networks are nodes.
      </li>
    </ul>
  </span>
</template>

<script>
import $ from 'jquery'
export default {
  created () {
    return {
      mcreatedt: 1, // performance.now(),
    }
  },
  methods: {
    getAllNodes () {
      this.requestTime = performance.now()
        this.$store.dispatch('mynsa/patch', [this.mset._id, {
          mrequestt: this.requestTime / 1000,
        }])
      $.ajax(
        // `http://rfabbri.vicg.icmc.usp.br:5000/communicability/`,
        process.env.flaskURL + '/mynsa/',
        // `http://127.0.0.1:5000/communicability/`,
        // {see: 'this', and: 'thisother', num: 5}
        {
          data: JSON.stringify({
            name_: ['all', 'nodes']
          }),
          contentType : 'application/json',
          type : 'POST',
        }
      ).done( data => { 
        this.serverlog = data
        this.dataTime = performance.now()
        this.$store.dispatch('mynsa/patch', [this.mset._id, {
          mdatat: this.dataTime / 1000,
        }])
        this.mInfo()
        this.mVMap()
      })
    },
    startState () {
      this.startTime = performance.now()
      // before sending to the server for calculations
      // timestamp is given by the server
      this.$store.dispatch('mynsa/create', {
        mcreatedt: this.mcreatedt,
        mstartt: this.startTime / 1000,
        mtype: 'allnodes',
        mmount: false,
      }).then( res => {
        this.mset = res
        this.getAllNodes()
      })
    },
    mInfo () {
      this.infoTime = performance.now()
      this.$store.dispatch('mynsa/patch', [this.mset._id, {
        minfot: this.infoTime / 1000,
      }])
    },
    mVMap () {
      this.mvmapTime = performance.now()
      this.$store.dispatch('mynsa/patch', [this.mset._id, {
        mvmapt: this.mvmapTime / 1000
      }])
    },
  },
  mounted () {
    this.startState()
    window.__this = this
  },
}
</script>

