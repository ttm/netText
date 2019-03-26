<template>
  <v-container justify-center>
    <h1>Evolving networks</h1>
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
<v-expansion-panel>
  <v-expansion-panel-content>
    <div slot="header">Visualization settings. Name of the loaded settings: <b>{{ sname }}</b>,
    <span v-if="network_data.nodes">nodes: {{network_data.nodes.length}},
    edges: {{network_data.edges.length}},
    messages/transactions: {{network_data.transactions.length}}</span>
    </div>
  <div style="border:2px solid black; padding: 4px">
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
    <textarea
      name="infoareaname"
      width="100%"
      style="width:100%;height:80px;border:solid 1px black"
      id="netinfoarea"
      box
      label="information about the network (editable)"
    >statistics:</textarea>
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
  theta = Math.PI
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

function mkPoints(p1, p2, mesh) {
  // make p2_ with p2 - size of polyhedron
  // let dir = new BABYLON.Vector3(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z)
  let dir = p2.subtract(p1)
  console.log(p2, p1, dir, mesh.position)
  let ray = new BABYLON.Ray(p1, dir)
  let inter = ray.intersectsMesh(mesh)
  window.minter.push([ray, mesh, inter, p1, p2])
  let p2_ = inter.pickedPoint
  // let arrowpoint = mkArrow(p1, p2_)
  return [p1, p2_] //, arrowpoint]
}

const mcolors2 = [
  new BABYLON.Color4(0, 0, 1, 1),
  new BABYLON.Color4(0, 1, 0, 1),
  new BABYLON.Color4(1, 0, 0, 1)
]

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
      window_size: 150,
      window_sep: 10,
      messages_second: 30,
      hubs_perc: 5,
      int_perc: 15,
      per_perc: 80,
      min_size: 0.01,
      size_inc: 0.003,
      status: {
        render: 1,
        loaded: 1,
        playing: 0,
      },
      hub_markers: {
        ysep: 0.2,
        alpha: 0.4
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
        // {see: 'this', and: 'thisother', num: 5}
        {
          network: this.network.name,
          sec_method: this.sec_method,
          message_range: this.message_range,
          window_size: this.window_size,
          window_sep: this.window_sep
        }
      ).done( data => { 
        this.net_snapshots = data 
        this.textinfo.value += '\n~ total stats ~\n'
        this.textinfo.value += 'frames: ' + (data.networks.length - 1)
        this.textinfo.value += ', nodes: ' + data.networks[0].nodes.length
        this.textinfo.value += ', edges: ' + data.networks[0].edges.length

        let st = data.stats[0]
        this.textinfo.value += '\ndegree mean, std: ' + st.degree_mean + ', ' + st.degree_std
        this.textinfo.value += '\nclustering mean, std: ' + st.clust_mean + ', ' + st.clust_std

        this.textinfo.value += '\ndegree mean (mean, std): ' + st.degree_mean_mean + ', ' + st.degree_mean_std
        this.textinfo.value += '\ndegree std (mean, std): ' + st.degree_std_mean + ', ' + st.degree_std_std

        this.textinfo.value += '\nclust mean (mean std): ' + st.clust_mean_mean + ', ' + st.clust_mean_std
        this.textinfo.value += '\nclust std (mean, std): ' + st.clust_std_mean + ', ' + st.clust_std_std

        this.textinfo.value += '\n~ picked stats ~'
        console.log('post returned', data) 
        this.loadBabylon()
      })
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
    setSizeColor(sec) {
      let stats = this.net_snapshots.stats[this.cur_net]
      let hip = stats.hip[sec]
      let nodes = this.net_snapshots.networks[this.cur_net].nodes
      let pre = ['h', 'i', 'p'][sec]
      let mtype = [3, 6, 0][sec]
      hip.forEach( n => {
        let poly = this.spheres[n]
        let name = poly.name
        poly.dispose()
        let nn = nodes.indexOf(n)
        let deg = stats.degree[nn]
        let clust = stats.clust[nn]
        let msize = this.min_size + this.size_inc * deg
        // console.log('msize', msize, deg)
        poly = BABYLON.MeshBuilder.CreatePolyhedron(
          pre+'sphere'+n,
          // {type: 3, updatable: 1, size: 0.01 + 0.001*deg},
          {type: mtype, updatable: 1, size: msize},
          this.scene
        )
        poly.position = this.nodepos[n]
        poly.material = new BABYLON.StandardMaterial(pre + "Material" + n, this.scene)
        poly.material.diffuseColor = new BABYLON.Color3(1, 1 - clust, 1 - clust)
        poly.actionManager = new BABYLON.ActionManager(this.scene)
        poly.mdata = {
          clust: clust,
          degree: deg
        }
        poly.actionManager.registerAction(
          new BABYLON.ExecuteCodeAction(
            // BABYLON.ActionManager.OnPointerOverTrigger,
            BABYLON.ActionManager.OnRightPickTrigger,
            this.onOver
          )
        )
        poly.actionManager.registerAction(
          new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPointerOutTrigger,
            this.onOut
          )
        )
        this.spheres[n] = poly
        // poly.type = 3
        // poly.options.size = 1
        
      })
    },
    updateNodes2 () {
      // delete meshes made before
      if (this.cur_net >= this.net_snapshots.networks.length) {
        return
      }
      this.setSizeColor(0)
      this.setSizeColor(1)
      this.setSizeColor(2)
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
    onOut (meshEvent) {
      while (document.getElementById("mybut")) {
        document.getElementById("mybut").parentNode.removeChild(document.getElementById("mybut"));
      }
    },
    onOver (meshEvent) {
        var but = document.createElement("span");
        // but.textContent = " ";
        but.setAttribute("id", "mybut");
        // but.zIndex = 0;
        var sty = but.style;
        sty.position = "absolute";
        sty.lineHeight = "1.2em";
        sty.paddingLeft = "10px";
        sty.paddingRight = "10px";
        sty.color = "#ffff00";
        sty.border = "5pt ridge blue";
        sty.borderRadius = "12px";
        sty.backgroundColor = "none";
        sty.fontSize = "24pt";
        sty.top = this.scene.pointerY + "px";
        sty.top = this.canvas.offsetTop + this.scene.pointerY + "px";
        sty.left = this.canvas.width + this.scene.pointerX + "px";
        sty.left = this.scene.pointerX + "px";
        sty.cursor = "pointer";
        but.setAttribute("onclick", "alert('ouch!')");
        document.body.appendChild(but);
        but.textContent = meshEvent.meshUnderPointer.name;
        but.textContent = meshEvent.meshUnderPointer.mdata.clust;
        // console.log(meshEvent);
        // console.log(wsc);
    },
    positionNodes () {
      let zfreq = 2
      let zamp = 0.5
      let zfreq_per = 2
      let zamp_per = 0.1
      let zdisp_per = 0.2

      this.nodepos = {}
      // let nnodes = this.net_snapshots.networks[0].nodes.length
      // let nhubs = Math.round(nnodes * this.hubs_perc / 100)
      // let nint = Math.round(nnodes * this.int_perc / 100)
      // let nper = nnodes - nhubs - nint
      let nhubs = this.net_snapshots.stats[0].hip[0].length
      let nint = this.net_snapshots.stats[0].hip[1].length
      let nper = this.net_snapshots.stats[0].hip[2].length

      let sine_ampl = .3

      let step_hubsx = 1 / nhubs
      let step_hubsy = Math.PI / nhubs
      let hMaterial = new BABYLON.StandardMaterial("hMaterial", this.scene)
      hMaterial.diffuseColor = new BABYLON.Color3(1.0, 0.2, 0.7)
      let spheres = {}  // for hubs, int and peripherals
      for (let n = 0; n < nhubs; n++) {
        let hid = this.net_snapshots.stats[0].hip[0][n]
        let sphere = BABYLON.MeshBuilder.CreatePolyhedron(
          'sphere_h'+hid,
          {type: 3, updatable: 1, size: this.min_size},
          this.scene
        )
        let x = 1 - step_hubsx * n
        let y = sine_ampl * Math.sin(step_hubsy * n)
        let z = zamp*Math.sin(2 * Math.PI * n / (nhubs + nint - 1))
        this.nodepos[hid] = new BABYLON.Vector3(
          x,
          y,
          z
        )
        sphere.position = this.nodepos[hid]
        sphere.material = new BABYLON.StandardMaterial("hMaterial" + n, this.scene)
        spheres[hid] = sphere
        // create boxes
        let box = BABYLON.MeshBuilder.CreateBox('box' + n,
          {size: 0.1, height: 0.01},
          this.scene
        )
        box.position = new BABYLON.Vector3(
          x,
          y - this.hub_markers.ysep,
          z
        )
        box.material = new BABYLON.StandardMaterial("mMaterial" + n, this.scene)
        box.material.diffuseColor = new BABYLON.Color3(0, 1, 0)
        box.material.alpha = this.hub_markers.alpha

      }

      let step_intx = 1 / (nint - 1)
      let step_inty = Math.PI / (nint - 1)
      let iMaterial = new BABYLON.StandardMaterial("iMaterial", this.scene);
      iMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0.7)
      for (let n = 0; n < nint; n++) {
        let iid = this.net_snapshots.stats[0].hip[1][n]
        let sphere = BABYLON.MeshBuilder.CreatePolyhedron(
          'sphere_i'+iid,
          {type: 6, updatable: 1, size: this.min_size},
          this.scene
        )
        let x = - step_intx * n
        let y = sine_ampl * Math.sin(step_inty * n + Math.PI)
        this.nodepos[iid] = new BABYLON.Vector3(
          x,
          y,
          zamp*Math.sin(2 * Math.PI * (n + nhubs) / (nhubs + nint - 1))
        )
        sphere.position = this.nodepos[iid]
        sphere.material = new BABYLON.StandardMaterial("iMaterial" + n, this.scene)
        spheres[iid] = sphere
      }

      let step_perx = 1.3 / nper
      let step_pery = 0.3 / nper
      let pMaterial = new BABYLON.StandardMaterial("pMaterial", this.scene);
      pMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1)
      for (let n = 0; n < nper; n++) {
        let pid = this.net_snapshots.stats[0].hip[2][n]
        let sphere = BABYLON.MeshBuilder.CreatePolyhedron(
          'sphere_p'+pid,
          {type: 0, updatable: true, size: this.min_size},
          this.scene
        )
        let x = - 0.9 + step_perx * n
        let y = sine_ampl * 0.8  + step_pery * n + zamp_per * Math.cos( 2 * Math.PI * n / (nper -1) )
        this.nodepos[pid] = new BABYLON.Vector3(
          x,
          y,
          zdisp_per + zamp_per * Math.sin( 2 * Math.PI * n / (nper -1) )
        )
        sphere.position = this.nodepos[pid]
        sphere.material = new BABYLON.StandardMaterial("pMaterial" + n, this.scene)
        spheres[pid] = sphere
      }
      this.spheres = spheres
    },
    loadEdges2 () {
      if (this.cur_net >= this.net_snapshots.networks.length) {
        return
      }
      let edges = this.net_snapshots.networks[this.cur_net].edges
      this.old_edges.forEach( e => {
        e.dispose()
      })
      this.old_edges = []
      edges.forEach( e => {
        let name = 'line' + e[0] + '-' + e[1]
        let xy1 = this.nodepos[e[0]]
        let xy2 = this.nodepos[e[1]]
        let arrowpoint = mkArrow(xy1, xy2)
        let points2_ = [xy1, xy2, arrowpoint]
        // let points__ = mkPoints(xy1, xy2, this.spheres[e[1]])  // for edge to only tough the surface of mesh
        let line = BABYLON.MeshBuilder.CreateLines(
          name,
          // {points: points__, colors: mcolors2, updatable: 1},
          {points: points2_, colors: mcolors2, updatable: 1},
          this.scene
        )
        // line.enableEdgesRendering()
        line.enableEdgesRendering()
        line.edgesWidth = (e[2].weight-1)*2
        line.edgesColor = new BABYLON.Color4(0,1,1,.3)
        // this.old_edges.push(e)
        // this.current_edges[name] = line
        this.old_edges.push(line)
      });
      this.cur_net++
    },
    loadEdges (msgs_to_update) { // create and delete edges
      // edges creation
      // used for the dummy network (for tests)
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
      this.engine = new BABYLON.Engine(this.canvas, true) // Generate the BABYLON 3D engine
      this.engine.stopRenderLoop()
      // Create the scene space
      this.scene = new BABYLON.Scene(this.engine)
      this.scene.onDispose = function() {
        while (document.getElementById("mybut")) {
          document.getElementById("mybut").parentNode.removeChild(document.getElementById("mybut"))
        }
      }

      // Add a camera to the scene and attach it to the canvas
      let camera = new BABYLON.ArcRotateCamera('Camera', Math.PI / 2, Math.PI / 2, 2, BABYLON.Vector3.Zero(), this.scene)
      // let camera = new BABYLON.ArcRotateCamera('Camera', 0, 0, 2, BABYLON.Vector3.Zero(), this.scene)
      camera.setTarget(BABYLON.Vector3.Zero())
      camera.attachControl(this.canvas, false)
      camera.wheelPrecision = 100
      this.camera = camera

      // Add lights to the scene
      new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 0), this.scene)
      this.positionNodes()
      this.current_edges = {}
      this.current_message = 0
      this.deleted_messages = 0
      // this.loadEdges(this.window_size)
      this.cur_net = 1
      this.old_edges = []
      this.updateNodes2()
      this.loadEdges2()
      let _this = this
      this.last_time = new Date()
      this.init_time = new Date()
      this.engine.runRenderLoop(function () {
        _this.current_time = new Date()
        let elapsed = _this.current_time - _this.last_time
        let elapsed_ = _this.current_time - _this.init_time
        // calculation with elapsed_, message_sep,
        // messages_sec and cur_net
        // let msgs_to_update = _this.messages_second * elapsed / 1000
        let msgs_to_update = _this.messages_second * elapsed_ / 1000
        let msgs_to_update_ = msgs_to_update - (_this.cur_net -1) * _this.window_sep
        if (msgs_to_update_ > 0) {
          _this.last_time = new Date()
          // _this.loadEdges(msgs_to_update)
          _this.loadEdges2()
          // _this.updateNodes()
          _this.updateNodes2()
        }
        _this.scene.render()
      })
      window.addEventListener('resize', function () {
        _this.engine.resize()
      })
    },
    loadCanvas () {
      // this.fetchAnalysisData()
      this.testPost()
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
    this.loadNetwork(this.network)
    //this.loadBabylon()
    window.__this = this
    this.canvas = document.getElementById('renderCanvas') // Get the canvas element
    this.textinfo = document.getElementById('netinfoarea')
    var self = this
    window.addEventListener('keypress', function (e) {
      console.log(e, e.code)
      if (e.code == 'KeyI') {
        self.pickResult = self.scene.pick(self.scene.pointerX, self.scene.pointerY)
        let mmesh = self.pickResult.pickedMesh
        if (mmesh && mmesh.mdata) {
          let mdata = mmesh.mdata
          self.textinfo.value += '\n'
          self.textinfo.value += 'frame: ' + self.cur_net
          self.textinfo.value += ', node: ' + mmesh.name
          self.textinfo.value += ', degree: ' + mdata.degree + ', clust: ' + mdata.clust
          self.textinfo.scrollTop = self.textinfo.scrollHeight
        }
      } else if (e.code == 'KeyS') {
          let st = self.net_snapshots.stats[self.cur_net]
          self.textinfo.value += '\n'
          self.textinfo.value += 'frame: ' + self.cur_net
          self.textinfo.value += ', degree mean, std: ' + st.degree_mean + ', ' + st.degree_std
          self.textinfo.value += ', clust mean, std: ' + st.clust_mean + ', ' + st.clust_std
          self.textinfo.value += ', hip: ' + st.hip.map( s => s.length )
          self.textinfo.scrollTop = self.textinfo.scrollHeight
      }
    })
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
