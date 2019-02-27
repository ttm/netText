<template>
  <v-container justify-center>
    <h1>Evolving networks</h1>
<v-expansion-panel>
  <v-expansion-panel-content>
    <div slot="header">Visualization settings. Name of the loaded settings: <b>{{ sname }}</b>,
    <span v-if="network_data.nodes">nodes: {{network_data.nodes.length}},
    edges: {{network_data.edges.length}},
    messages/transactions: {{network_data.transactions.length}}</span>
    </div>
  <div style="border:2px solid black; padding: 4px">
<v-layout align-center justify-start row ma-1 pa-1>
    Load settings:
    <v-menu offset-y>
      <v-btn
        slot="activator"
        color="primary"
        dark
      >
        {{ sname ? sname : 'Select' }}
      </v-btn>
      <v-list>
        <v-list-tile
          v-for="(set, index) in settings"
          :key="index"
          @click="loadSettings(set)"
          class="green--text"
        >
          <v-list-tile-title>{{ set.name }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    <v-flex xs4>
    <v-text-field
      label="Settings name"
      v-if="sname === 'new'"
      v-model="newname"
      counter
      maxlength="90"
      width="'90%'"
      pa-1 ma-1
    ></v-text-field>
    <v-btn v-if="sname && sname !== 'new'" color="success" @click="cloneSettings()"
    pa-1 ma-1
    >Clone settings</v-btn>
    </v-flex>
</v-layout>
<v-card flat dark>
<v-layout align-center justify-start pa-1 row>
  <v-flex xs2 ml-2>
    Network: 
    <v-menu offset-y>
      <v-btn
        slot="activator"
        color="primary"
        dark
      >
        {{ network ? network.name : 'Select' }}
      </v-btn>
      <v-list>
        <v-list-tile
          v-for="(net, index) in networks"
          :key="index"
          @click="loadNetwork(net)"
        >
          <v-list-tile-title color="primary">{{ net.name }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-flex>

  <v-layout align-center justify-start row v-if="network_data.transactions">
    messages:
        <v-flex
          shrink
          style="width: 60px"
          ml-3
        >
          <v-text-field
            v-model="message_range[0]"
            type="number"
            :label="'first'"
          ></v-text-field>
        </v-flex>
        <v-flex class="px-3">
          <v-range-slider
            v-model="message_range"
            :max="network_data.transactions.length"
            :min="0"
          ></v-range-slider>
        </v-flex>
        <v-flex
          shrink
          style="width: 60px"
        >
          <v-text-field
            :label="'last'"
            :left="true"
            v-model="message_range[1]"
            type="number"
          ></v-text-field>
        </v-flex>
  </v-layout>
</v-layout>
</v-card>

<v-flex mt-1>
<v-card flat dark>
<v-layout align-center justify-start row>
    <v-flex xs2 ml-2>
      Sectorialization method: 
    </v-flex>
    <v-flex xs2 mr-2 ml-2>
      <v-menu>
        <v-btn
          slot="activator"
          color="primary"
          dark
        >
          {{ sec_method ? sec_method : 'Select' }}
        </v-btn>
        <v-list>
          <v-list-tile
            v-for="(sec, index) in sec_methods"
            :key="index"
            @click="loadSecMethod(sec)"
          >
            <v-list-tile-title>{{ sec }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-flex>
    <v-flex xs6>
  <v-layout align-center justify-start row v-if="sec_method === 'Percentages'">
    <v-flex xs2 mr-2>
    <v-text-field
      :label="'hubs'"
      :left="true"
      v-model="hubs_perc"
      type="number"
      min="0"
      max="100"
      v-on:input="percChange()"
    ></v-text-field>
    </v-flex>
    <v-flex xs2>
    <v-text-field
      :label="'intermediary'"
      :left="true"
      v-model="int_perc"
      type="number"
      min="0"
      max="100"
      v-on:input="percChange()"
    ></v-text-field>
    </v-flex>
    <v-flex xs2 ml-2>
    <v-text-field
      :label="'periphery'"
      :left="true"
      v-model="per_perc"
      type="number"
      min="0"
      max="100"
      v-on:input="percChangePer()"
    ></v-text-field>
    </v-flex>
  </v-layout>
    </v-flex>
</v-layout>
</v-card>
</v-flex>
</div>
  </v-expansion-panel-content>
</v-expansion-panel>
<v-expansion-panel>
  <v-expansion-panel-content>
    <div slot="header">Controls (window size: {{ window_size }}, separation {{window_sep}}, messages/s: {{ messages_second }})</div>
    <div style="border:2px solid black; padding: 4px">
          <v-layout row ml-4>
            <v-flex class="pr-3">
              <v-slider
                v-model="window_size"
                :max="1000"
                :min="1"
                :label="'window size'"
                :step="1"
                ma-0
                pa-0
              ></v-slider>
            </v-flex>
            <v-flex shrink style="width: 60px">
              <v-text-field
                v-model="window_size"
                class="mt-0"
                hide-details
                single-line
                type="number"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row ml-4>
            <v-flex class="pr-3">
              <v-slider
                v-model="window_sep"
                :max="1000"
                :min="1"
                :label="'messages separation between snapshots'"
                :step="1"
                ma-0
                pa-0
              ></v-slider>
            </v-flex>
            <v-flex shrink style="width: 60px">
              <v-text-field
                v-model="window_sep"
                class="mt-0"
                hide-details
                single-line
                type="number"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row ml-4>
            <v-flex class="pr-3">
              <v-slider
                v-model="messages_second"
                :max="100"
                :min="0.1"
                :label="'messages per second'"
                :step="0.1"
                ma-0
                pa-0
              ></v-slider>
            </v-flex>
            <v-flex shrink style="width: 60px">
              <v-text-field
                v-model="messages_second"
                class="mt-0"
                hide-details
                single-line
                type="number"
              ></v-text-field>
            </v-flex>
          </v-layout>
      <v-btn
        color="primary"
        dark
      >
        save to settings
      </v-btn>
    </div>
  </v-expansion-panel-content>
</v-expansion-panel>
  <v-layout align-center justify-start row>
      <v-btn
        color="red"
        @click="loadCanvas()"
      >
        load canvas
      </v-btn>
    </v-layout>
  <canvas id="renderCanvas"></canvas>
  <v-btn outline icon @click="status.playing ? pause() : play_()" :disabled="!status.loaded">
    <v-icon v-if="!status.playing">play_arrow</v-icon>
    <v-icon v-else>pause</v-icon>
  </v-btn>
  </v-container>
</template>

<script>
// import enet from '~/static/here.json'
const enet = require('~/static/here.json')
// import fs from 'fs'
// const enet = JSON.parse(fs.readFileSync('~/static/here.json', 'utf8'))
import * as BABYLON from 'babylonjs'
import $ from 'jquery'

function mkArrow(v1, v2) {
  let theta = Math.PI * 5 / 6
  let a = v2.subtract(v1)
  let b = new BABYLON.Vector3(0,-100,0)
  let c = BABYLON.Vector3.Cross(a, b)
  c.normalize()
  let f = BABYLON.Vector3.Cross(c, a)

  let g = a.scale(Math.cos(theta)).add(f.scale(Math.sin(theta)))
  let g_ = g.normalize().scale(0.1)

  return v2.add(g_)
  // find c = a x b normalized
  // find f = c x a
  // make g = cos(theta) a + sin(theta) f
}

export default {
  data () {
    return {
      networks: [{name: 'dummy', data: enet}, {name: 'other', data: []}],
      // network: ''
      network: {name: 'dummy', data: enet},
      settings: [{name: 'new'}, {name: 'other'}],
      sname: 'other',
      newname: '',
      message_range: [0, 0],
      sec_methods: ['Erdös', 'Percentages'],
      sec_method: 'Erdös',
      window_sep: 10,
      messages_second: 30,
      hubs_perc: 5,
      int_perc: 15,
      per_perc: 80,
      window_size: 15,
      status: {
        render: 1,
        loaded: 1,
        playing: 0,
      },
      network_data: {}
    }
  },
  methods: {
    loadSettings (set) {
      this.setting = set
      this.sname = set.name
    },
    cloneSettings (set) {
      console.log('make settings clone')
      // use this.setting and make a new setting instance
    },
    loadNetwork (net) {
      this.network = net
      $.get(
        `http://127.0.0.1:5000/evolvingNet/someNetId/`,
        {},
        this.absorbNetworksData
      )
    },
    testPost () {
      $.post(
        `http://127.0.0.1:5000/postTest/`,
        {see: 'this', and: 'thisother', num: 5}
      ).done( data => { console.log('post returned', data) }
      )
    },
    absorbNetworksData (data) {
      // data.transactions = data.transactions.slice(0,100)
      window.mdata = data
      this.network_data = data
      this.message_range[1] = data.transactions.length
    },
    loadSecMethod (sec) {
      this.sec_method = sec
    },
    percChange () {
      let leftover = 100 - this.hubs_perc - this.int_perc
      if (leftover >= 0) {
        this.per_perc = leftover
      } else {
        this.per_perc = 0
        this.int_perc = 100 - this.hubs_perc
      }
    },
    percChangePer () {
      let leftover = 100 - this.hubs_perc - this.per_perc
      if (leftover >= 0) {
        this.int_perc = leftover
      } else {
        this.int_perc = 0
        this.hubs_perc = 100 - this.per_perc
      }
    },
    play_ () {
      this.status.playing = 1
    },
    pause () {
      this.status.playing = 0
    },
    updateNodes () {
      let num = Math.random()
      this.spheres[0][0].scaling = new BABYLON.Vector3(num, num, num)
      this.spheres[0][0].material.diffuseColor = new BABYLON.Color3(num, num, num)
      this.spheres[0][1].material.diffuseColor = new BABYLON.Color3(num, 0, 0)
      if (Math.random() < 0.04) {
        this.spheres[0][2].dispose()
        if (Math.random() < 0.5) {
          this.spheres[0][2] = new BABYLON.MeshBuilder.CreateBox('box'+2, {size: 0.04}, this.scene)
        } else {
          this.spheres[0][2] = new BABYLON.MeshBuilder.CreateSphere('sphere'+2, {diameter: 0.07}, this.scene)
        }
        this.spheres[0][2].position = this.nodepos[2]
        this.spheres[0][2].material = new BABYLON.StandardMaterial("hMaterial" + 2, this.scene)
        this.spheres[0][2].material.diffuseColor = new BABYLON.Color3(num, 1 - num, 0)
      }
    },
    positionNodes () {
      let zfreq = 2
      let zamp = 0.5
      let zfreq_per = 2
      let zamp_per = 0.1
      let zdisp_per = 0.2

      this.nodepos = {}
      let nhubs = Math.round(this.network_data.nodes.length * this.hubs_perc / 100)
      let nint = Math.round(this.network_data.nodes.length * this.int_perc / 100)
      let nper = this.network_data.nodes.length - nhubs - nint

      let sine_ampl = .3

      let step_hubsx = 1 / nhubs
      let step_hubsy = Math.PI / nhubs
      let hMaterial = new BABYLON.StandardMaterial("hMaterial", this.scene)
      hMaterial.diffuseColor = new BABYLON.Color3(1.0, 0.2, 0.7)
      let spheres = [ [], [], [] ] // for hubs, int and peripherals
      for (let n = 0; n < nhubs; n++) {
        let sphere = BABYLON.MeshBuilder.CreateSphere(
          'sphere_h'+n,
          {segments: 1, updatable: 1, diameter: 0.2},
          this.scene
        )
        let x = 1 - step_hubsx * n
        let y = sine_ampl * Math.sin(step_hubsy * n)
        this.nodepos[n] = new BABYLON.Vector3(
          x,
          y,
          zamp*Math.sin(2 * Math.PI * n / (nhubs + nint - 1))
        )
        sphere.position = this.nodepos[n]
        sphere.material = new BABYLON.StandardMaterial("hMaterial" + n, this.scene)
        spheres[0].push(sphere)
      }

      let step_intx = 1 / (nint - 1)
      let step_inty = Math.PI / (nint - 1)
      let iMaterial = new BABYLON.StandardMaterial("iMaterial", this.scene);
      iMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0.7)
      for (let n = 0; n < nint; n++) {
        let sphere = BABYLON.MeshBuilder.CreateSphere(
          'sphere_i'+n,
          {segments: 1, updatable: 1, diameter: 0.2},
          this.scene
        )
        let x = - step_intx * n
        let y = sine_ampl * Math.sin(step_inty * n + Math.PI)
        this.nodepos[n+nhubs] = new BABYLON.Vector3(
          x,
          y,
          zamp*Math.sin(2 * Math.PI * (n + nhubs) / (nhubs + nint - 1))
        )
        sphere.position = this.nodepos[n+nhubs]
        sphere.material = new BABYLON.StandardMaterial("iMaterial" + n, this.scene)
        spheres[1].push(sphere)
      }
      let step_perx = 1.3 / nper
      let step_pery = 0.3 / nper
      let pMaterial = new BABYLON.StandardMaterial("pMaterial", this.scene);
      pMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1)
      for (let n = 0; n < nper; n++) {
        let sphere = BABYLON.MeshBuilder.CreateSphere(
          'sphere_p'+n,
          {segments: 1, updatable: 1, diameter: 0.05},
          this.scene
        )
        let x = - 0.9 + step_perx * n
        let y = sine_ampl * 0.8  + step_pery * n + zamp_per * Math.cos( 2 * Math.PI * n / (nper -1) )
        this.nodepos[n+nhubs+nint] = new BABYLON.Vector3(
          x,
          y,
          zdisp_per + zamp_per * Math.sin( 2 * Math.PI * n / (nper -1) )
        )
        sphere.position = this.nodepos[n+nhubs+nint]
        sphere.material = new BABYLON.StandardMaterial("pMaterial" + n, this.scene)
        spheres[2].push(sphere)
        this.spheres = spheres
        window.sphere = sphere
      }
    },
    loadEdges (msgs_to_update) { // create and delete edges
      // edges creation
      let edges = this.network_data.transactions.slice(
        this.current_message,
        this.current_message + msgs_to_update
      )
      let mcolors = []
      for (let i = 0; i < 6; i++) {
        mcolors.push(new BABYLON.Color4(0, 0, i * 1/6, 1))
      }
      let mcolors2 = [
        new BABYLON.Color4(0, 0, 1, 1),
        new BABYLON.Color4(0, 1, 0, 1),
        new BABYLON.Color4(1, 0, 0, 1)
      ]
      window.mcolors = mcolors
      edges.forEach( e => {
        let name = 'line' + e[0] + '-' + e[1]
        if (this.current_edges[name]) {
          console.log('already exists', name)
          this.current_edges[name].edgesWidth += 10
        } else {
          console.log('new link', name)
          let xy1 = this.nodepos[e[0]]
          let xy2 = this.nodepos[e[1]]
          let arrowpoint = mkArrow(xy1, xy2)
          let control = new BABYLON.Vector3(
            xy1.x**2 + xy2.x**2,
            xy2.y**2 + xy2.y**2,
            0
          )
          let bez = BABYLON.Curve3.CreateQuadraticBezier(xy1, control, xy2, 5)
          let points_ = bez.getPoints()
          let points2_ = [xy1, xy2, arrowpoint]
          console.log('control', control, points_.length, mcolors, points_.length, mcolors.length)
          let line = BABYLON.MeshBuilder.CreateLines(
            name,
            {points: points2_, colors: mcolors2, updatable: 1},
            this.scene
          )
          // line.enableEdgesRendering()
          this.current_edges[name] = line
        }
      });
      // edges to delete
      let from = Math.max(0, this.current_message - this.window_size - msgs_to_update)
      let to = Math.max(0, this.current_message - this.window_size)
      this.current_message += msgs_to_update
      let edges_delete = this.network_data.transactions.slice(
        this.deleted_messages,
        to
      )
      edges_delete.forEach( e => {
        let name = 'line' + e[0] + '-' + e[1]
        console.log('dispose or make thinner', name)
        if (this.current_edges[name].edgesWidth > 1) {
          this.current_edges[name].edgesWidth -= 10
        } else {
          this.current_edges[name].dispose()
        }
      })
      this.deleted_messages += edges_delete.length
    },
    loadBabylon () {
      this.canvas = document.getElementById('renderCanvas') // Get the canvas element
      this.engine = new BABYLON.Engine(this.canvas, true) // Generate the BABYLON 3D engine
      this.engine.stopRenderLoop()
      // Create the scene space
      this.scene = new BABYLON.Scene(this.engine)

      // Add a camera to the scene and attach it to the canvas
      let camera = new BABYLON.ArcRotateCamera('Camera', Math.PI / 2, Math.PI / 2, 2, BABYLON.Vector3.Zero(), this.scene)
      // let camera = new BABYLON.ArcRotateCamera('Camera', 0, 0, 2, BABYLON.Vector3.Zero(), this.scene)
      camera.setTarget(BABYLON.Vector3.Zero())
      camera.attachControl(this.canvas, true)

      // Add lights to the scene
      new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 0), this.scene)
      this.positionNodes()
      this.current_edges = {}
      this.current_message = 0
      this.deleted_messages = 0
      this.loadEdges(this.window_size)
      let _this = this
      this.last_time = new Date()
      this.engine.runRenderLoop(function () {
        _this.current_time = new Date()
        let elapsed = _this.current_time - _this.last_time
        let msgs_to_update = _this.messages_second * elapsed / 1000
        if (msgs_to_update) {
          _this.last_time = new Date()
          _this.loadEdges(msgs_to_update)
          _this.updateNodes()
        }
        _this.scene.render()
      })
      window.addEventListener('resize', function () {
        _this.engine.resize()
      })
    },
    loadCanvas () {
      console.log('ok load canvas')
      this.fetchAnalysisData()
      this.loadBabylon()
    },
    fetchAnalysisData () {
      $.get(
        `http://127.0.0.1:5000/evolvingNet/someNetId/`,
        {},
        this.absorbAnalysisData
      )
    },
    absorbAnalysisData (data) {
      console.log(data)
    }
  },
  mounted () {
    window.enet = enet
    this.loadNetwork(this.network)
    //this.loadBabylon()
    window.__this = this
    window.mbab = BABYLON
    window.mkArrow = mkArrow
    window.tpost = this.testPost
  }
}
</script>
<style>
#renderCanvas {
    width   : 50%;
    height  : 50%;
    touch-action: none;
}
</style>
