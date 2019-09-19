<template>
<span>
<h1>MyNSA</h1>
<p>Widgets para: escrever alguma coisa, lista as redes que possuem a string (nome de participante ou da rede)</p>
<p>Um vértice para da rede, se clicar na rede, abre ela.</p>
<div id="info">
  {{ minfo }}
</div>
</span>
</template>

<script>
import $ from 'jquery'

export default {
  data () {
    return {
      minfo: '',
    }
  },
  methods: {
    getSnapshots () {
      this.requestTime = performance.now()
      $.ajax(
        // `http://rfabbri.vicg.icmc.usp.br:5000/communicability/`,
        process.env.flaskURL + '/mynsa/',
        // `http://127.0.0.1:5000/communicability/`,
        // {see: 'this', and: 'thisother', num: 5}
        {
          data: JSON.stringify({
            name_: ['all', 'snaps']
          }),
          contentType : 'application/json',
          type : 'POST',
        }
      ).done( data => { 
        this.serverlog = data
        this.alldata = data.all.more_
        this.snaps = data.all.more_
        let a = this.alldata

        this.dataTime = performance.now()
        this.$store.dispatch('mynsa/patch', [this.mset._id, {
          mdatat: this.dataTime / 1000,
        }])
        this.mInfo()
        this.mVMap()
      })

    },
    mInfo () {
      this.infoTime = performance.now()
      // get n of each type of snapshots
      let snames = [...new Set(this.snaps.map(i => i[0]))]
      let snames_ = snames.reduce( (t, i) => {
        t[i] = 0
        return t
      }, {})
      this.snaps.forEach( i => {
        snames_[i[0]]++
      })
      this.snames = [snames, snames_]
      this.minfo = snames.map( i => {
        return i + ': ' + snames_[i]
      }).join(', ')

      this.$store.dispatch('mynsa/patch', [this.mset._id, {
        minfot: this.infoTime / 1000,
      }])
    },
    mVMap () {
      this.mvmapTime = performance.now()
      this.$store.dispatch('mynsa/patch', [this.mset._id, {
        mvmapt: this.mvmapTime / 1000,
        mmount: true,
      }])
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
        this.getSnapshots()
      })
    },
  },
  mounted () {
    window.__this = this
    this.startState()
  },
}
</script>
