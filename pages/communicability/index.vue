<template>
<span>
<v-menu offset-y>
  <v-btn
    slot="activator"
    color="primary"
    dark
  >
    {{ network ? network.filename : 'Select network' }}
  </v-btn>
  <v-list>
    <v-list-tile
      v-for="(net, index) in networks_"
      :key="index"
      @click="network = net"
    >
      <v-list-tile-title color="primary">{{ net.filename }}</v-list-tile-title>
    </v-list-tile>
    <v-list-tile>
<input type="file" @change="upload">
    </v-list-tile>
  </v-list>
</v-menu>
<div style="border:1px;border-style:solid;padding:5px">Communicability calculation settings
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
<div style="border:1px;border-style:solid;padding:5px">Community detection settings
  <v-slider
    v-model="ncluin"
    thumb-label="always"
    :max="10"
    :min="1"
    :label="'min number of communities'"
    :step="1"
  ></v-slider>
  <v-slider
    v-model="nclu"
    thumb-label="always"
    :max="100"
    :min="2"
    :label="'max number of communities'"
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
    node sizes
    <v-btn fab dark small color="primary" @click="updateSize(-0.1)">
      <v-icon dark>remove</v-icon>
    </v-btn>
    <v-btn fab dark small color="primary" @click="updateSize(0.1)">
      <v-icon dark>add</v-icon>
    </v-btn>
  </div>
  <v-slider
    v-model="lopacity"
    thumb-label="always"
    :max="1"
    :min="0"
    :label="'line opacity'"
    :step="0.01"
    v-if="loaded"
    @change="cgLineTrans"
  ></v-slider>
  <v-slider
    v-model="nclusters"
    thumb-label="always"
    :max="nclu"
    :min="ncluin"
    :label="'number of clusters'"
    :step="1"
    v-if="loaded"
    @change="cgNClu"
    always-dirty
  ></v-slider>
</div>
<v-layout row ml-4>
<v-btn
  slot="activator"
  color="green lighten-2"
  dark
  @click="renderNetwork()"
>
  Render network
</v-btn>
  <v-checkbox v-model="scentroid" label="show centroid"> </v-checkbox>
  <v-checkbox v-model="ssphere" label="show sphere centre"> </v-checkbox>
  <v-checkbox v-model="sspheres" label="show sphere surface"> </v-checkbox>
</v-layout>
<canvas id="renderCanvas" touch-action="none"></canvas>
<v-layout row ml-4>
<textarea id="statsbox">
</textarea>
<textarea id="statsbox2">
</textarea>
<textarea id="statsbox3">
</textarea>
</v-layout>
</span>
</template>

<script>
import * as BABYLON from 'babylonjs'
import $ from 'jquery'
import * as d3 from 'd3'

const ColourValues = [
  "0000FF", "FFFF00", "FF00FF", "00FFFF",
  "800000", "008000", "000080", "808000", "800080", "008080", "808080",
  "C00000", "00C000", "0000C0", "C0C000", "C000C0", "00C0C0", "C0C0C0",
  "400000", "004000", "000040", "404000", "400040", "004040", "404040",
  "200000", "002000", "000020", "202000", "200020", "002020", "202020",
  "600000", "006000", "000060", "606000", "600060", "006060", "606060",
  "A00000", "00A000", "0000A0", "A0A000", "A000A0", "00A0A0", "A0A0A0",
  "E00000", "00E000", "0000FF", "E000E0", "00E0E0"
]

export default {
  head () {
    return {
      script: [
        { src: '/libs/math5.10.3.js' },
      ]
    }
  },
  data () {
    return {
      networks: ['dolphins', 'zackar'],
      networks_: [],
      network: '',
      draw_net: false,
      temp: 1,
      mangle: 10,
      dimensions: 3,
      inits: 3,
      iters: 100,
      nsize:1,
      diameter: 0.03,
      dimredtype: 'MDS',
      lrate: 12,
      perplexity: 5,
      minIters: 1,
      scentroid: false,
      ssphere: false,
      sspheres: false,
      nclu: 6,
      ncluin: 2,
      lopacity: 1,
      loaded: false,
      nclusters: 1
    }
  },
  watch: {
    dimredtype: function (val) {
      if (val === 't-SNE') {
        this.minIters = 250
      } else {
        this.minIters = 1
      }
    },
    scentroid: function (val) {
      if (!this.network_data)
        return
      if (val)
        this.csphere.isVisible = true
      else
        this.csphere.isVisible = false
    },
    ssphere: function (val) {
      if (!this.network_data)
        return
      if (val)
        this.sspherec.isVisible = true
      else
        this.sspherec.isVisible = false
    },
    sspheres: function (val) {
      if (!this.network_data)
        return
      if (val)
        this.ssurface.isVisible = true
      else
        this.ssurface.isVisible = false
    },
  },
  methods: {
    cgLineTrans () {
       this.lines.forEach( l => l.alpha = this.lopacity )
    },
    findNetworks () {
      this.$store.dispatch('networks/find').then(() => {
        let networks_ = this.$store.getters['networks/list']
        this.networks_ = networks_.filter(i => {
          return (i.layer === 0) && (i.filename.split('.').pop() === 'txt')
        })
        this.network = this.networks_[0]
      })
    },
    upload (e) {
      console.log('yey man', e)
      this.loading = true
      let reader = new FileReader()
      let file = e.target.files[0]
      reader.readAsText(file)
      console.log('yey manooo', file)
      let path = e.path || (e.composedPath && e.composedPath())
      let self = this
      reader.addEventListener('load', () => {
        console.log('yeyow man')
        this.$store.dispatch('networks/create', {
          data: reader.result,
          layer: 0,
          coarsen_method: 'none',
          uncoarsened_network: null,
          title: 'a title',
          description: 'a description',
          filename: path[0].files[0].name,
          // user: this.user._id
          user: '5c51162561e2414b1f85ac0b'
        }).then((res) => {
          console.log('yeyowha man')
          this.loading = false
          this.text = 'file ' + path[0].files[0].name + 'loaded. Reload page to load more files'
          this.findNetworks()
        })
      })
    },
    cgNClu () {
      console.log(this.nclusters)
      for (let i = 0; i < this.network_data.nodes.length; i++) {
        let s = this.spheres[i]
        s.material = this.materials[
          this.network_data.clusts[this.nclusters - this.ncluin][i]
        ]
      }
    },
    renderNetwork () {
      $.post(
        // `http://rfabbri.vicg.icmc.usp.br:5000/communicability/`,
        process.env.flaskURL + '/communicability/',
        // `http://127.0.0.1:5000/communicability/`,
        // {see: 'this', and: 'thisother', num: 5}
        {
          netid: this.network._id,
          temp: this.temp,
          mangle: this.mangle,

          dim: this.dimensions,
          inits: this.inits,
          iters: this.iters,
          dimredtype: this.dimredtype,
          lrate: this.lrate,
          perplexity: this.perplexity,
          nclu: this.nclu,
          ncluin: this.ncluin,
        }
      ).done( network => { 
        console.log(network)
        if (this.draw_net) {
          console.log('destroy stuff here')
        }
        this.draw_net = true
        this.network_data = network
        let ev = network.ev
        this.nclusters = this.ncluin + ev.indexOf(Math.max(...ev))
        this.plotData()
      })
    },
    plotData () {
      if (!this.babylon_initialized) {
        this.initBabylon()
        this.mkMaterials()
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
        sphere.material = this.materials[this.network_data.clusts[this.nclusters - this.ncluin][i]]
        // console.log(this.materials[this.network_data.clusts[0][i]], this.network_data.clusts[0][i])
        spheres.push(sphere)
      }
      for (let i = 0; i < links.length; i++) {
        let pos1 = nodes[links[i][0]]
        let pos2 = nodes[links[i][1]]
        let pos1_ = new BABYLON.Vector3(pos1[0], pos1[1], pos1[2])
        let pos2_ = new BABYLON.Vector3(pos2[0], pos2[1], pos2[2])
        var line = BABYLON.MeshBuilder.CreateLines('line' + i, {points: [pos1_, pos2_], updatable: 1}, this.scene)
        line.color = BABYLON.Color3.Black()
        lines.push(line)
      }
      this.spheres = spheres
      this.lines = lines
      this.mkCentroid()
      this.mkBestSphere()
      this.loaded = true
    },
    mkCentroid () {
      let c = this.network_data.nodes.reduce( (c, i) => c = [c[0]+i[0], c[1]+i[1], c[2]+i[2]], [0,0,0])
      let dists = this.network_data.nodes.map( n => ( (n[0] - c[0])**2 + (n[1] - c[1])**2 + (n[2] - c[2])**2 )**0.5 )
      let mean = math.mean(dists)
      let std = math.std(dists)
      this.centroid = [
        c, dists,
        mean, std
      ]
      let sphere = BABYLON.MeshBuilder.CreateSphere('centroid', {diameter: 0.03 + this.diameter, updatable: 1}, this.scene)
      sphere.position = new BABYLON.Vector3(...c)
      sphere.isVisible = false
      let material = new BABYLON.StandardMaterial("mMaterial", this.scene)
      material.diffuseColor = new BABYLON.Color3(1, 0, 0)
      sphere.material = material
      this.csphere = sphere
    },
    mkBestSphere () {
      let sphere = BABYLON.MeshBuilder.CreateSphere('bspherec', {diameter: 0.03 + this.diameter, updatable: 1}, this.scene)
      sphere.position = new BABYLON.Vector3(...this.network_data.sdata.c)
      sphere.isVisible = false
      let material = new BABYLON.StandardMaterial("mMaterial2", this.scene)
      material.diffuseColor = new BABYLON.Color3(0, 1, 0)
      sphere.material = material
      this.sspherec = sphere
      this.mkBestSphereSurface()
    },
    mkBestSphereSurface () {
      let sphere = BABYLON.MeshBuilder.CreateSphere('bsurface', {diameter: this.network_data.sdata.r*2, updatable: 1}, this.scene)
      sphere.position = new BABYLON.Vector3(...this.network_data.sdata.c)
      sphere.isVisible = false
      let material = new BABYLON.StandardMaterial("mMaterial3", this.scene)
      material.diffuseColor = new BABYLON.Color3(0, 0, 1)
      material.alpha = 0.3
      sphere.material = material
      this.ssurface = sphere
      this.placeStats()
    },
    placeStats () {
      let a = document.getElementById('statsbox')
      a.style.width = '30%'
      a.style.height = '100px'
      // a.innerHTML = JSON.stringify(this.network_data.sdata)
      let s = this.network_data.sdata
      a.innerHTML = '~~ best sphere stats ~~'
      a.innerHTML += '\ncenter: ' + s.c.reduce( (st, i) => st += i.toFixed(3) + ', ', '' )
      a.innerHTML += '\nradius: ' + s.r.toFixed(3)
      a.innerHTML += '\ndistance mean: ' + s.mean.toFixed(3)
      a.innerHTML += '\ndistance std: ' + s.std.toFixed(3)
      a = document.getElementById('statsbox2')
      a.style.width = '30%'
      a.style.height = '100px'
      a.innerHTML += '~~ centroid stats ~~'
      let c = this.centroid
      a.innerHTML += '\nposition: ' + c[0].reduce( (st, i) => st += i.toFixed(3) + ', ', '' )
      a.innerHTML += '\ndistance mean: ' + c[2].toFixed(3)
      a.innerHTML += '\ndistance std: ' + c[3].toFixed(3)
      let d = (
          (c[0][0] - s.c[0])**2
        + (c[0][1] - s.c[1])**2
        + (c[0][1] - s.c[1])**2
      ) ** 0.5
      a.innerHTML += '\ndistance to best sphere centre: ' + d.toFixed(3)
      a = document.getElementById('statsbox3')
      a.style.width = '30%'
      a.style.height = '100px'
      a.innerHTML += '~~ community stats ~~'
      this.network_data.ev.forEach( (e, i) => {
        a.innerHTML += '\nclust ' + (i + this.ncluin) + ': ' + e.toFixed(3)
      })
    },
    initBabylon () {
      this.canvas = document.getElementById('renderCanvas') // Get the canvas element
      this.engine = new BABYLON.Engine(this.canvas, true) // Generate the BABYLON 3D engine

      this.scene = new BABYLON.Scene(this.engine)
      this.scene.clearColor = BABYLON.Color3.White();
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
    mkMaterials () {
      let materials = []
      for (let i = 0; i < this.nclu; i++) {
        let material = new BABYLON.StandardMaterial("cMaterial"+i, this.scene)
        material.diffuseColor = new BABYLON.Color3(...this.parseColor(i))
        // ok
        console.log(this.parseColor(i), 'tcolor man')
        materials.push(material)
      }
      this.materials = materials
    },
    parseColor(i) {
      let c = ColourValues[i]
      let r = parseInt(c.slice(0, 2), 16) / 255
      let g = parseInt(c.slice(2, 4), 16) / 255
      let b = parseInt(c.slice(4), 16) / 255
      return [r, g, b]
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
    this.colors = ColourValues
    this.prev_size = 1
    d3.select('canvas')
      .on('mouseenter', function () {
        d3.select('body').style('overflow', 'hidden')
      })
      .on('mouseout', function () {
        d3.select('body').style('overflow', 'scroll')
      })
    console.log(process.env.flaskURL)
    this.findNetworks()
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
