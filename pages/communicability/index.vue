<template>
<span>
<v-menu offset-y>
  <v-btn
    slot="activator"
    color="primary"
    dark
  >
    {{ network ? network : 'Select network' }}
  </v-btn>
  <v-list>
    <v-list-tile
      v-for="(net, index) in networks"
      :key="index"
      @click="network = net"
    >
      <v-list-tile-title color="primary">{{ net }}</v-list-tile-title>
    </v-list-tile>
    <v-list-tile>
<input type="file" @change="upload">
    </v-list-tile>
  </v-list>
</v-menu>
<div style="border:1px;border-style:solid;padding:5px">Communicability settings
  <v-slider
    v-model="temp"
    thumb-label="always"
    :max="10"
    :min="0"
    :label="'temperature'"
    :step="0.01"
  ></v-slider>
  <v-slider
    v-model="mangle"
    thumb-label="always"
    :max="1000"
    :min="1"
    :label="'minimum angle x 10e-6'"
    :step="1"
  ></v-slider>
</div><br/>
<div style="border:1px;border-style:solid;padding:5px">Dimensionality Reduction settings
  <v-radio-group v-model="dimensions" :label="'dimensions of layout'">
    <v-radio :label="'2'" :value="2"></v-radio>
    <v-radio :label="'3'" :value="3"></v-radio>
  </v-radio-group>
  <v-radio-group v-model="dimredtype" :label="'type of dim reduction'">
    <v-radio :label="'MDS'" :value="'MDS'"></v-radio>
    <v-radio :label="'t-SNE'" :value="'t-SNE'"></v-radio>
  </v-radio-group>
  <v-slider
    v-model="iters"
    thumb-label="always"
    :max="10000"
    :min="minIters"
    :label="'iterations'"
    :step="1"
  ></v-slider>
  <v-slider
    v-model="inits"
    thumb-label="always"
    :max="1000"
    :min="1"
    :label="'initializations'"
    :step="1"
    v-if="dimredtype === 'MDS'"
  ></v-slider>
  <v-slider
    v-model="perplexity"
    thumb-label="always"
    :max="1000"
    :min="1"
    :label="'perplexity'"
    :step="1"
    v-if="dimredtype === 't-SNE'"
  ></v-slider>
  <v-slider
    v-model="lrate"
    thumb-label="always"
    :max="1000"
    :min="1"
    :label="'learning rate'"
    :step="1"
    v-if="dimredtype === 't-SNE'"
  ></v-slider>
</div><br/>
<div style="border:1px;border-style:solid;padding:5px">Visualization controls
  <div>
    node sizes (just mouse over them)
    <v-btn fab dark small color="primary" @click="updateSize(-0.1)">
      <v-icon dark>remove</v-icon>
    </v-btn>
    <v-btn fab dark small color="primary" @click="updateSize(0.1)">
      <v-icon dark>add</v-icon>
    </v-btn>
  </div>
</div>
<v-btn
  slot="activator"
  color="green lighten-2"
  dark
  @click="renderNetwork()"
>
  Render network
</v-btn>
<canvas id="renderCanvas" touch-action="none"></canvas>
</span>
</template>

<script>
import * as BABYLON from 'babylonjs'
import $ from 'jquery'
import * as d3 from 'd3'

export default {
  data () {
    return {
      networks: ['dolphins', 'zackar'],
      network: 'dolphins',
      draw_net: false,
      temp: 1,
      mangle: 10,
      dimensions: 3,
      inits: 3,
      iters: 1000,
      nsize:1,
      diameter: 0.03,
      dimredtype: 'MDS',
      lrate: 12,
      perplexity: 5,
      minIters: 1
    }
  },
  watch: {
    dimredtype: function (val) {
      if (val === 't-SNE') {
        this.minIters = 250
      } else {
        this.minIters = 1
      }
    }
  },
  methods: {
    upload (e) {
      console.log('uploading to be implemented')
    },
    renderNetwork () {
      $.post(
        // `http://rfabbri.vicg.icmc.usp.br:5000/communicability/`,
        process.env.flaskURL + '/communicability/',
        // `http://127.0.0.1:5000/communicability/`,
        // {see: 'this', and: 'thisother', num: 5}
        {
          net: this.network,

          temp: this.temp,
          mangle: this.mangle,

          dim: this.dimensions,
          inits: this.inits,
          iters: this.iters,
          dimredtype: this.dimredtype,
          lrate: this.lrate,
          perplexity: this.perplexity
        }
      ).done( network => { 
        console.log(network)
        if (this.draw_net) {
          console.log('destroy stuff here')
        }
        this.draw_net = true
        this.network_data = network
        this.plotData()
      })
    },
    plotData () {
      if (!this.babylon_initialized) {
        this.initBabylon()
      }
      let spheres = []
      let lines = []
      let nodes = this.network_data.nodes
      let links = this.network_data.links
      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i]
        if (node.length == 2)
          node.push(0)
        let sphere = BABYLON.MeshBuilder.CreateSphere('sphere' + i, {diameter: 0.03 + this.diameter, updatable: 1}, this.scene)
        sphere.position = new BABYLON.Vector3(node[0], node[1], node[2])
        spheres.push(sphere)
      }
      for (let i = 0; i < links.length; i++) {
        let pos1 = nodes[links[i][0]]
        let pos2 = nodes[links[i][1]]
        let pos1_ = new BABYLON.Vector3(pos1[0], pos1[1], pos1[2])
        let pos2_ = new BABYLON.Vector3(pos2[0], pos2[1], pos2[2])
        var line = BABYLON.MeshBuilder.CreateLines('line' + i, {points: [pos1_, pos2_], updatable: 1}, this.scene)
        lines.push(line)
      }
      this.spheres = spheres
      this.lines = lines
    },
    initBabylon () {
      this.canvas = document.getElementById('renderCanvas') // Get the canvas element
      this.engine = new BABYLON.Engine(this.canvas, true) // Generate the BABYLON 3D engine

      this.scene = new BABYLON.Scene(this.engine)
      var camera = new BABYLON.ArcRotateCamera('Camera', Math.PI / 2, Math.PI / 2, 2, BABYLON.Vector3.Zero(), this.scene)
      camera.attachControl(this.canvas, true)
      camera.wheelPrecision = 100
      new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene)
      let selff = this
      this.engine.runRenderLoop(function () {
        selff.scene.render()
      })
      window.addEventListener('resize', function () {
        selff.engine.resize()
      })
    },
    updateSize (val) {
      this.spheres.forEach(e => {
        e.scaling.x *= 1 + val
        e.scaling.y *= 1 + val
        e.scaling.z *= 1 + val
      })
    }
  },
  mounted () {
    window.__this = this
    this.prev_size = 1
    d3.select('canvas')
      .on('mouseenter', function () {
        d3.select('body').style('overflow', 'hidden')
      })
      .on('mouseout', function () {
        d3.select('body').style('overflow', 'scroll')
      })
    console.log(process.env.flaskURL)
  }
}
</script>
<style>
#renderCanvas {
  /* width: 100%; */
  /* height: 100%; */
  width:  100%;
  height: 100%;
  touch-action: none;
}
html, body {
  overflow: scroll;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
