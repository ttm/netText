<template v-scroll:#scroll-target="onScroll" class="scroll-y">
<span>
<v-container justify-center>
      <h1>Analysis settings</h1>
<v-layout align-center justify-center row fill-height>
    <v-flex xs4 order-md2 order-xs2 center>
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
          v-for="(net, index) in networks"
          :key="index"
          @click="network = net"
        >
          <v-list-tile-title color="primary">{{ net.filename }}</v-list-tile-title>
        </v-list-tile>
        <v-list-tile>
    <input id="selectFotos" type="file" @change="upload">
        </v-list-tile>
      </v-list>
    </v-menu>
    </v-flex>
    <v-flex xs12 sm6 md3 order-md1 order-xs1>
    Load settings:
    <v-menu offset-y>
      <v-btn
        slot="activator"
        color="primary"
        dark
      >
        {{ name ? name : 'Select' }}
      </v-btn>
      <v-list>
        <v-list-tile
          v-for="(set, index) in settings"
          :key="index"
          @click="loadSettings(set)"
        >
          <v-list-tile-title color="primary">{{ set.name }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    </v-flex>
    <v-flex xs12 sm6 md3 order-md1 order-xs1>
      <v-text-field
        label="Settings name"
        v-if="name === 'new'"
        v-model="newname"
      ></v-text-field>
      <v-btn v-if="name && name !== 'new'" color="success" @click="cloneSettings(set)">Clone settings</v-btn>
    </v-flex>
</v-layout>
<v-expansion-panel>
  <v-expansion-panel-content>
    <div slot="header">settings in general
    <span v-if="analysis_set">nodes: {{network_data.nodes.length}},
    edges: {{network_data.edges.length}},
    messages/transactions: {{network_data.transactions.length}}</span>
    </div>
<div style="border:2px solid black; padding: 4px">
<v-card flat dark>
  <v-layout align-center justify-center row fill-height>
    <v-flex xs2 order-md1 order-xs1 center>
    Layout algorithm:
    <v-menu offset-y>
      <v-btn
        slot="activator"
        color="primary"
        dark
      >
        {{ layout ? layout : 'Select' }}
      </v-btn>
      <v-list>
        <v-list-tile
          v-for="(lay, index) in layouts"
          :key="index"
          @click="layout = lay"
        >
          <v-list-tile-title color="primary">{{ lay }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    </v-flex>
    <v-flex xs3 order-md2 order-xs2>
    Dimensions of layout: {{ dimensions || 'null' }}
    <v-radio-group v-model="dimensions">
      <v-radio :label="'2'" :value="2"></v-radio>
      <v-radio :label="'3'" :value="3"></v-radio>
    </v-radio-group>
    </v-flex>
    <v-flex xs2 order-md3 order-xs3>
    Draw links: {{ links ? 'yes' : 'no' }}
    <v-radio-group v-model="links">
      <v-radio :label="'Yes'" :value="true"></v-radio>
      <v-radio :label="'No'" :value="false"></v-radio>
    </v-radio-group>
    </v-flex>
  </v-layout>
</v-card>
<v-flex mt-1>
<v-card flat dark>
  <v-layout align-center justify-center row fill-height pa-1>
    <v-flex xs4 order-md1 order-xs1 center>
      Coarsening method:
      <v-menu offset-y>
        <v-btn
          slot="activator"
          color="primary"
          dark
        >
          {{ method ? method : 'Select' }}
        </v-btn>
        <v-list>
          <v-list-tile
            v-for="(met, index) in methods"
            :key="index"
            @click="method = met"
          >
            <v-list-tile-title color="primary">{{ met }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-flex>
    <v-flex xs4 order-md2 order-xs2 center>
      <v-text-field
        :label="'Layers'"
        :left="true"
        v-model="layers"
        type="number"
        style="width:80px"
        min="0"
      ></v-text-field>
    </v-flex>
  </v-layout>
</v-card>
</v-flex>
</div>
  </v-expansion-panel-content>
</v-expansion-panel>
<v-expansion-panel>
  <v-expansion-panel-content>
    <div slot="header">control
    <span v-if="analysis_set">nodes: {{network_data.nodes.length}},
    edges: {{network_data.edges.length}},
    messages/transactions: {{network_data.transactions.length}}</span>
    </div>
<div style="border:2px solid black; padding: 4px">
<v-card flat dark>
  <v-layout align-center justify-center row pa-1>
    <v-flex xs5 order-md1 order-xs1 center>
      Axis of coarsened networks:
        <v-menu offset-y>
          <v-btn
            slot="activator"
            color="primary"
            dark
          >
          {{ axis ? axis : 'Select' }}
          </v-btn>
          <v-list>
            <v-list-tile
              v-for="(ax, index) in axis_"
              :key="index"
              @click="axis = ax"
            >
              <v-list-tile-title color="primary">{{ ax }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
    </v-flex>
    <v-flex xs4 order-md2 order-xs2 center>
      <v-text-field
        :label="'Separation'"
        :left="true"
        v-model="separation"
        type="number"
        step="0.1"
        style="width:80px"
      ></v-text-field>
    </v-flex>
  </v-layout>
</v-card>
</div>
  </v-expansion-panel-content>
</v-expansion-panel>
</v-container>
  <div class="text-xs-left">
      <v-layout row ml-4>
        <v-btn
          slot="activator"
          color="green lighten-2"
          dark
          @click="renderNetwork()"
        >
          Render network
        </v-btn>
        <v-btn
          slot="activator"
          color="green lighten-2"
          dark
          @click="renderHistograms()"
        >
          Render histograms
        </v-btn>
        <v-flex class="pr-3">
          <v-slider
            v-model="separation"
            :max="4"
            :min="0"
            :label="'separation'"
            :step="0.01"
            ma-0
            pa-0
            @change="sepLayers"
          ></v-slider>
        </v-flex>
        <v-flex shrink style="width: 60px">
          <v-text-field
            v-model="separation"
            class="mt-0"
            hide-details
            single-line
            type="number"
          ></v-text-field>
        </v-flex>
      </v-layout>
      <canvas id="renderCanvas" touch-action="none" v-if="draw_net"></canvas>
      <DrawHistograms v-if="draw_hist"
        :degree="$refs.netsettings.hist.degree"
        :clust="$refs.netsettings.hist.clust"
      />
<div style="border:1px solid black; padding: 4px">
  Histograms
  <v-layout>
      <v-layout row wrap class="light--text">
        <v-flex xs6>
          <v-checkbox v-model="hist.degree" label="degree" value></v-checkbox>
        </v-flex>
        <v-flex xs6>
          <v-checkbox v-model="hist.clust" label="clustering coefficient" value></v-checkbox>
        </v-flex>
      </v-layout>
  </v-layout>
</div>
  </div>
    <v-snackbar
      v-model="snackbar"
      :multi-line="true"
      :timeout="6000"
      :top="true"
    >
      {{ snacktext }}
      <v-btn
        color="pink"
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
</span>
</template>

<script>
import * as BABYLON from 'babylonjs'
import $ from 'jquery'

import NetSettings from '~/components/network/NetSettings'
import DrawHistograms from '~/components/network/DrawHistograms'

const methods = {
  'kclicks': 'kclick',
  'label propagation': 'lab',
  'connected components': 'cp'
}
const axis_ = {
  'x': '0',
  'y': '1',
  'z': '2'
}

export default {
  components: {
    NetSettings,
    DrawHistograms
  },
  data () {
    return {
      snackbar: false,
      snacktext: 'msnacktext',
      dialog: false,
      draw_net: false,
      draw_hist: false,
      separation: 0.3,
      hist: {
        degree: 0,
        clust: 0
      },
      analysis_set: 0,
      layouts: [
        'circular',
        'fruch',
        'kamada',
        'random',
        'shell',
        'spectral',
        'spring'
      ],
      layout: 'kamada',
      dimensions: 3,
      links: true,
      layers: 2,
      methods: [
        'kclicks',
        'label propagation',
        'connected components'
      ],
      method: 'label propagation',
      axis: 'y',
      axis_: [
        'x',
        'y',
        'z'
      ],
      networks: [],
      network: '',
      name: 'new',
      newname: '',
      settings: [],
      hist: {
        degree: false,
        clust: false
      }
    }
  },
  methods: {
    renderHistograms () {
      console.log('rendering histograms')
      if (this.draw_hist) {
        this.draw_hist = false
      } else {
        this.draw_hist = true
      }
    },
    renderNetwork () {
      if (this.draw_net) {
        this.draw_net = false
      } else {
        this.draw_net = true
        $.get(
          `http://127.0.0.1:5000/netlevelsDB/${this.network._id}/${this.layout}/${this.dimensions}/${this.layers}/${methods[this.method]}/${axis_[this.axis]}/`,
          {},
          this.stablishScene
        )
      }
    },
    stablishScene (network) {
      this.canvas = document.getElementById('renderCanvas') // Get the canvas element
      this.engine = new BABYLON.Engine(this.canvas, true) // Generate the BABYLON 3D engine

      this.scene = new BABYLON.Scene(this.engine)
      this.standard_material = new BABYLON.StandardMaterial("sMaterial", this.scene)
      // this.standardMaterial.diffuseColor = new BABYLON.Color3(1, 1 - clust, 1 - clust)
      this.highlight_material = new BABYLON.StandardMaterial("hMaterial", this.scene)
      this.highlight_material.diffuseColor = new BABYLON.Color3(1, 0, 0)
      this.phighlight_material = new BABYLON.StandardMaterial("pMaterial", this.scene)
      this.phighlight_material.diffuseColor = new BABYLON.Color3(0, 1, 0)

      var camera = new BABYLON.ArcRotateCamera('Camera', Math.PI / 2, Math.PI / 2, 2, BABYLON.Vector3.Zero(), this.scene)
      camera.attachControl(this.canvas, true)
      camera.wheelPrecision = 100
      new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene)

      let spheres = []
      let lines = []
      let networks = network
      for (let j = 0; j < networks.length; j++) {
        let nodes = networks[j].nodes
        let edges = networks[j].edges
        spheres.push([])
        lines.push([])

        for (let i = 0; i < nodes.length; i++) {
          let node = nodes[i]
          let sphere = BABYLON.MeshBuilder.CreateSphere('sphere' + i, {diameter: 0.02, updatable: 1}, this.scene)
          sphere.position = new BABYLON.Vector3(node[0], node[1], node[2] + j * this.separation)
          sphere.material = this.standard_material
          sphere.mdata = {
            id: i,
            layer: j,
            degree: networks[j].degrees[i],
            clust: networks[j].clust[i],
            children: networks[j].children[i],
            neighbors: []
          }
          spheres[spheres.length - 1].push(sphere)
          if (spheres.length > 1) {
            sphere.mdata.children.forEach( child => {
              spheres[spheres.length - 2][child].mdata.tparent = i
            })
          }
        }
        let links = 1
        for (let i = 0; i < edges.length; i++) {
          let pos1 = nodes[edges[i][0]]
          let pos2 = nodes[edges[i][1]]
          spheres[spheres.length - 1][edges[i][0]].mdata.neighbors.push(edges[i][1])
          spheres[spheres.length - 1][edges[i][1]].mdata.neighbors.push(edges[i][0])
          if (links === 1) {
            let pos1_ = new BABYLON.Vector3(pos1[0], pos1[1], pos1[2] + j * this.separation)
            let pos2_ = new BABYLON.Vector3(pos2[0], pos2[1], pos2[2] + j * this.separation)
            var line = BABYLON.MeshBuilder.CreateLines('line' + i, {points: [pos1_, pos2_], updatable: 1}, this.scene)
            line.isPickable = false
            lines[lines.length - 1].push(line)
          }
        }
      }

      this.networks = networks
      this.spheres = spheres
      this.lines = lines

      let selff = this
      this.engine.runRenderLoop(function () {
        selff.scene.render()
      })
      window.addEventListener('resize', function () {
        selff.engine.resize()
      })
      this.mkKeyShortcuts()
    },
    mkKeyShortcuts () {
      let self = this
      window.addEventListener('keypress', function (e) {
        console.log(e, e.code)
        if (e.key == 'i') {
          self.pickResult = self.scene.pick(self.scene.pointerX, self.scene.pointerY)
          let mmesh = self.pickResult.pickedMesh
          window.mmesh = mmesh
          self.snacktext = mmesh.mdata
          self.snackbar = 1
        } else if (e.code == 'KeyS') {
        } else if (e.key == 'c') {
          self.pickResult = self.scene.pick(self.scene.pointerX, self.scene.pointerY)
          let mmesh = self.pickResult.pickedMesh
          window.mmesh = mmesh
          // color the neighbors
          if (self.colored) {
            // restore usual colors on vertices
            self.colored_nodes.ids.forEach( i => {
              self.spheres[self.colored_nodes.layer][i].material = self.standard_material
            })
            self.colored = false
            self.snackbar = 0
          } else {
            // make funny colors for neighbors
            self.snacktext = mmesh.mdata.neighbors
            self.snackbar = 1
            mmesh.mdata.neighbors.forEach( i => {
              self.spheres[mmesh.mdata.layer][i].material = self.highlight_material
            })
            self.colored_nodes = {ids: mmesh.mdata.neighbors, layer: mmesh.mdata.layer}
            self.colored = true
          }
        } else if (e.key == 'C') {
          // color parents and children
          self.pickResult = self.scene.pick(self.scene.pointerX, self.scene.pointerY)
          let mmesh = self.pickResult.pickedMesh
          window.mmesh = mmesh
          // color the neighbors
          if (self.pcolored) {
            // restore usual colors on vertices
            self.pcolored_nodes.ids.forEach( i => {
              self.spheres[self.pcolored_nodes.layer - 1][i].material = self.standard_material
            })
            if (!(typeof self.pcolored_nodes.tparent === 'undefined')) {
              self.spheres[self.pcolored_nodes.layer + 1][self.pcolored_nodes.tparent].material = self.standard_material
            }
            self.pcolored = false
            self.snackbar = 0
          } else {
            // make funny colors for neighbors
            self.snacktext = mmesh.mdata.children
            self.snackbar = 1
            mmesh.mdata.children.forEach( i => {
              self.spheres[mmesh.mdata.layer - 1][i].material = self.phighlight_material
            })
            self.pcolored_nodes = {ids: mmesh.mdata.children, layer: mmesh.mdata.layer}
            if (!(typeof mmesh.mdata.tparent === 'undefined')) {
              self.spheres[mmesh.mdata.layer + 1][mmesh.mdata.tparent].material = self.phighlight_material
              self.pcolored_nodes.tparent = mmesh.mdata.tparent
            }
            self.pcolored = true
          }
        }
      })
    },
    saveAnalysis () {
      this.dialog = false
      let set = this.$refs.netsettings
      let aname = set.newname ? set.newname : set.name
      let tobj = {
        layout: set.layout,
        dimensions: set.dimensions,
        links: set.links,
        layers: set.layers,
        method: set.method,
        separation: set.separation,
        network: set.network._id,
        name: aname,
        axis: set.axis
      }
      if (set.newname) {
        this.$store.dispatch('ansettings/create', tobj)
      } else {
        this.$store.dispatch('ansettings/update', [set._id, tobj])
      }
    },
    upload (e) {
      this.loading = true
      let reader = new FileReader()
      let file = e.target.files[0]
      console.log('raw', e, e.path[0].files[0].name)
      reader.readAsText(file)
      let self = this
      reader.addEventListener('load', () => {
        console.log(reader)
        this.$store.dispatch('networks/create', {
          data: reader.result,
          layer: 0,
          coarsen_method: 'none',
          uncoarsened_network: null,
          title: 'a title',
          description: 'a description',
          filename: e.path[0].files[0].name,
          // user: this.user._id
          user: '5c51162561e2414b1f85ac0b'
        }).then((res) => {
          this.loading = false
          this.text = 'file ' + e.path[0].files[0].name + 'loaded. Reload page to load more files'
          this.findNetworks()
        })
      })
    },
    findNetworks () {
      this.$store.dispatch('networks/find').then(() => {
        let networks_ = this.$store.getters['networks/list']
        this.networks = networks_.filter(i => i.layer === 0)
      })
    },
    findSettings () {
      this.$store.dispatch('ansettings/find').then(() => {
        this.settings = this.$store.getters['ansettings/list']
        this.settings.push({name: 'new'})
        this.loadSettings(this.settings[0])
        this.renderNetwork()
      })
    },
    loadSettings (set) {
      this.asetting = set
      this.name = set.name
      this.layout = set.layout
      this.dimensions = set.dimensions
      this.links = set.links
      this.layers = set.layers
      this.method = set.method
      this.separations = set.separation
      this.axis = set.axis
      this.network = set.networkObj
      this._id = set._id
    },
    cloneSettings (set) {
      this.newname = this.name + '_'
      this.name = 'new'
    },
    sepLayers (val) {
      for (let j = 1; j < this.spheres.length; j++) {
        let nodes = this.networks[j].nodes
        let edges = this.networks[j].edges
        for (let i = 0; i < this.spheres[j].length; i++) {
          this.spheres[j][i].position.z = nodes[i][2] + j * val
        }
        for (let i = 0; i < this.lines[j].length; i++) {
          // this.lines[j][i].position.z = this.networks[j].nodes[i][2] + j * val
          let pos1 = nodes[edges[i][0]]
          let pos2 = nodes[edges[i][1]]
          let line = this.lines[j][i]
          let mpos = line.getVerticesData(BABYLON.VertexBuffer.PositionKind)

          mpos[2] = pos1[2] + j * this.separation
          mpos[5] = pos2[2] + j * this.separation

          line.updateVerticesData(BABYLON.VertexBuffer.PositionKind, mpos)
        }
      }
    }
  },
  mounted () {
    window.__this = this
  },
  created () {
    this.findNetworks()
    this.findSettings()
  }
}
// vim: ft=vue
</script>

<style>
html, body {
  overflow: scroll;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

#renderCanvas {
  width: 100%;
  height: 100%;
  touch-action: none;
}
.v-input--selection-controls {
    margin-top: 0px;
  }
.v-input--selection-controls:not(.v-input--hide-details) .v-input__slot {
    margin-bottom: 0px;
}
.v-messages {
    min-height: 2px;
}
*{ text-transform: none !important; }
/* vim: set ft=vue: */
</style>
