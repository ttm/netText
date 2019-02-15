<template>
  <v-container justify-center>
    <h1>Evolving networks</h1>
<v-expansion-panel>
  <v-expansion-panel-content>
    <div slot="header">Visualization settings. Name of the loaded settings: <b>{{ sname }}</b>,
    <span v-if="network_data.ntransactions">nodes: {{network_data.nodes.length}},
    edges: {{network_data.edges.length}},
    messages/transactions: {{network_data.ntransactions}}</span>
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

  <v-layout align-center justify-start row>
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
            :max="message_max"
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
      <div slot="header">Controls (FPS: {{ frames_second }}, messages/s: {{ messages_second }}, window size: {{ window_size }})</div>
    <div style="border:2px solid black; padding: 4px">
          <v-layout row ml-4>
            <v-flex class="pr-3">
              <v-slider
                v-model="frames_second"
                :max="100"
                :min="0.1"
                :label="'frames per second'"
                :step="0.1"
                ma-0
                pa-0
              ></v-slider>
            </v-flex>
            <v-flex shrink style="width: 60px">
              <v-text-field
                v-model="frames_second"
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
      frames_second: 10,
      messages_second: 30,
      hubs_perc: 5,
      int_perc: 15,
      per_perc: 80,
      window_size: 5,
      message_max: 0,
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
      this.message_max = net.data.length
      this.message_range[1] = net.data.length
      $.get(
        `http://127.0.0.1:5000/evolvingNet/someNetId/`,
        {},
        this.absorbNetworksData
      )
    },
    absorbNetworksData (data) {
      window.mdata = data
      this.network_data = data
    },
    loadSecMethod (sec) {
      this.sec_method = sec
    },
    percChange () {
      console.log('calculou')
      let leftover = 100 - this.hubs_perc - this.int_perc
      window.selff = this
      if (leftover >= 0) {
        this.per_perc = leftover
      } else {
        this.per_perc = 0
        this.int_perc = 100 - this.hubs_perc
      }
    },
    percChangePer () {
      console.log('calculou')
      let leftover = 100 - this.hubs_perc - this.per_perc
      window.selff = this
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
    loadBabylon () {
      this.canvas = document.getElementById('renderCanvas') // Get the canvas element
      this.engine = new BABYLON.Engine(this.canvas, true) // Generate the BABYLON 3D engine
      // Create the scene space
      this.scene = new BABYLON.Scene(this.engine)

      // Add a camera to the scene and attach it to the canvas
      let camera = new BABYLON.ArcRotateCamera('Camera', Math.PI / 2, Math.PI / 2, 2, BABYLON.Vector3.Zero(), this.scene)
      camera.setTarget(BABYLON.Vector3.Zero())
      camera.attachControl(this.canvas, true)

      // Add lights to the scene
      new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 0), this.scene)
      let sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {segments: 1}, this.scene)
      // sphere.position = new BABYLON.Vector3(0.5, 0.5, 0.5)
      let selff = this
      this.engine.runRenderLoop(function () {
        selff.scene.render()
      })
      window.addEventListener('resize', function () {
        selff.engine.resize()
      })
    },
    loadCanvas () {
      console.log('ok load canvas')
      this.fetchAnalysisData()
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
    this.loadBabylon()
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
