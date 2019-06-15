<template>
<span>
  <h1>Soundscape analysis -- minimal</h1>
  <div id="waveform"></div>
    <div>
      <v-btn color="success" @click="wavesurfer.skipBackward()">
        <i class="fa fa-step-backward sspace"></i>
        Backward
      </v-btn>
      <v-btn color="success" @click="wavesurfer.skipForward()">
        <i class="fa fa-step-forward sspace"></i>
        Forward
      </v-btn>
      <v-btn color="success" @click="play()">
        <i class="fa fa-play sspace"></i>
        Play
        /
        <i class="fa fa-pause ssspace"></i>
        Pause
      </v-btn>
      <v-btn color="success" @click="wavesurfer.regions.clear()">
        <i class="fas fa-broom sspace"></i>
        Clear
      </v-btn>
  </div>
      <v-btn color="warning" @click="analyze()">
        <i class="fas fa-microchip sspace"></i>
        Analyze
      </v-btn>
  <v-footer class="pa-3">
    <v-spacer></v-spacer>
    <div>&copy;{{ new Date().getFullYear() }} - VICG-ICMC/USP, FAPESP 2017/05838-3</div>
  </v-footer>
</span>
</template>

<script>
import $ from 'jquery'

export default {
  head () {
    return {
      script: [
        { src: 'https://unpkg.com/wavesurfer.js' },
        { src: 'https://unpkg.com/wavesurfer.js/dist/plugin/wavesurfer.regions.js' },
      ],
      link: [
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.2/css/all.min.css' }
      ],
    }
  },
  methods: {
    play () {
      let regs = Object.keys(this.ws.regions.list)
      if (regs.length === 0) {
        this.ws.playPause()
      } else {
        let i = this.rcounter % regs.length
        let reg = this.ws.regions.list[regs[i]]
        reg.play()
        this.rcounter++
      }
    },
    analyze () {
      let regs = Object.keys(this.ws.regions.list)
      let i = (this.rcounter - 1) % regs.length
      let reg = this.ws.regions.list[regs[i]]
      let [s, e] = [reg.start, reg.end]
      console.log(s, e)
    }
  },
  mounted () {
    this.rcounter = 0
    window.__this = this
    var wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'violet',
      progressColor: 'purple',
      scrollParent: true,
      normalize: true,
      plugins: [
        WaveSurfer.regions.create({
          dragSelection: {
              slop: 5
          }
        })
      ]
    })
    wavesurfer.load('audio/birds.wav')
    this.ws = wavesurfer
    this.wavesurfer = wavesurfer
  },
}

</script>

<style>
.tbtn {
  background-color: gray;
}
#renderCanvas {
  border: 1px solid;
}
.sspace {
  margin-right: 5px;
}
.ssspace {
  margin-right: 5px;
  margin-left: 5px;
}
</style>

