<template>
<span>
<v-layout align-center justify-center row fill-height>
  <v-flex text-xs-center>
    <v-menu offset-y title="select the network">
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
    <v-menu offset-y title="select the layout">
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
</v-layout>
<v-flex mt-1>
<v-card flat dark>
  <v-layout align-center justify-center>
    <v-flex>
      <table>
      <span
        v-for="index in nlayers" :key="index"
      >
      <tr class="row2"
      >
        <td class="tcolumn">
          layer {{ index }}
        </td>
        <td class="tcolumn">
          <v-text-field
            :label="'reduction'"
            :left="true"
            v-model="bi.reduction[index - 1]"
            type="number"
            step="0.1"
            max="1"
          ></v-text-field>
        </td>
        <td class="tcolumn">
          <v-text-field
            :label="'max levels'"
            :left="true"
            v-model="bi.max_levels[index - 1]"
            type="number"
            step="1"
            min="1"
          ></v-text-field>
        </td>
        <td class="tcolumn">
          <v-text-field
            :label="'min vertices'"
            :left="true"
            v-model="bi.global_min_vertices[index - 1]"
            type="number"
            step="1"
            min="1"
          ></v-text-field>
        </td>
        <td class="tcolumn">
          <v-menu>
            <template #activator="{ on: menu }">
              <v-tooltip bottom>
                <template #activator="{ on: tooltip }">
                  <v-btn class="btn22"
                    color="primary"
                    dark
                    v-on="{ ...tooltip, ...menu }"
                  > {{ bi.matching[index - 1] }}</v-btn>
                </template>
                <span>matching method</span>
              </v-tooltip>
            </template>
            <v-list>
              <v-list-tile
                v-for="(item, index_) in bi.valid_matching"
                :key="index_"
                @click="bi.matching[index - 1] = item"
              >
                <v-list-tile-title>{{ item }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </td>
        <td class="tcolumn">
          <v-menu>
            <template #activator="{ on: menu }">
              <v-tooltip bottom>
                <template #activator="{ on: tooltip }">
                  <v-btn class="btn22"
                    color="primary"
                    dark
                    v-on="{ ...tooltip, ...menu }"
                  > {{ bi.similarity[index - 1].slice(0,5) }}</v-btn>
                </template>
                <span>similarity criterion: {{ bi.similarity[index -1] }}</span>
              </v-tooltip>
            </template>
            <v-list>
              <v-list-tile
                v-for="(item, index_) in bi.valid_similarity"
                :key="index_"
                @click="bi.similarity[index - 1] = item"
              >
                <v-list-tile-title>{{ item }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </td>
        <td class="tcolumn">
          <v-text-field
            :label="'similarity'"
            :left="true"
            v-model="bi.similarity[index - 1]"
          ></v-text-field>
        </td>
        <td class="tcolumn">
          <v-text-field
            :label="'upper bound'"
            :left="true"
            v-model="bi.upper_bound[index - 1]"
            type="number"
            step="0.1"
            min="0"
          ></v-text-field>
        </td>
        <td class="tcolumn">
          <v-text-field
            :label="'iterations'"
            :left="true"
            v-model="bi.itr[index - 1]"
            type="number"
            step="1"
            min="1"
          ></v-text-field>
        </td>
        <td class="tcolumn">
          <v-text-field
            :label="'tolerance'"
            :left="true"
            v-model="bi.tolerance[index - 1]"
            type="number"
            step="0.0001"
            min="0"
          ></v-text-field>
        </td>
      </tr>
      </span>
      </table>
    </v-flex>
  </v-layout>
</v-card>
</v-flex>
<v-layout row ml-4>
  <v-btn
    slot="activator"
    color="green lighten-2"
    dark
    @click="renderNetwork()"
  >
    Render network
  </v-btn>
  <v-checkbox v-model="links" label="show links"> </v-checkbox>
  <v-text-field
    v-model="curlevelinfo"
    label="current level"
    outline
    readonly
  ></v-text-field>
</v-layout>
<v-system-bar id="toolbar" window dark>
  <v-icon class="tbtn" @click="focusLevel('+')" title="focus on coarser level">unfold_less</v-icon>
  <v-icon class="tbtn" @click="focusLevel('-')" title="focus less coarsed level">unfold_more</v-icon>
  <v-spacer></v-spacer>
  <v-icon class="tbtn" @click="randomColorize('n')" title="randomize node color">invert_colors</v-icon>
  <v-icon class="tbtn" @click="resizeNodes('+')" title="decrease node size">control_camera</v-icon>
  <v-icon class="tbtn" @click="resizeNodes('-')" title="increase node size">games</v-icon>
  <v-icon class="tbtn" @click="proportionalNodes('degrees')" title="make node size proportional to degree">insert_chart</v-icon>
  <v-icon class="tbtn" @click="proportionalNodes('children')" title="make node size proportional to number of children">insert_chart_outlined</v-icon>
  <v-icon class="tbtn" @click="restoreNodeSizes()" title="reinitializes node sizes">undo</v-icon>
  <v-icon class="tbtn" @click="nodeVisibility('+')" title="decrease node transparency">hdr_strong</v-icon>
  <v-icon class="tbtn" @click="nodeVisibility('-')" title="increase node transparency">hdr_weak</v-icon>
  <v-icon class="tbtn" @click="rotateNodes()" title="rotate nodes">rotate_left</v-icon>
  <v-spacer></v-spacer>
  <v-icon class="tbtn" @click="randomColorize('l')" title="randomize link color">invert_colors_off</v-icon>
  <v-icon class="tbtn" @click="linkVisibility('+')" title="decrease line transparency">drag_handle</v-icon>
  <v-icon class="tbtn" @click="linkVisibility('-')" title="increase line transparency">power_input</v-icon>
  <v-spacer></v-spacer>
  <v-icon class="tbtn ptbtn" id="infobtn" @click="setTool('info')" title="get info on specific nodes">info</v-icon>
  <v-icon class="tbtn ptbtn" id="dragbtn" @click="setTool('drag')" title="drag nodes to reposition them">gesture</v-icon>
  <v-icon class="tbtn ptbtn" id="regionexplorebtn" @click="setTool('regionexplore')" title="open regions of nodes into child nodes (click and drag)">explore</v-icon>
  <v-icon class="tbtn ptbtn" id="joinbtn" @click="setTool('join')" title="join opened metanodes">border_outer</v-icon>
  <v-icon class="tbtn ptbtn" id="resizebtn" @click="setTool('resize')" title="resize open nodes (click on node and drag)">tab_unselected</v-icon>
  <v-spacer></v-spacer>
  <v-icon class="tbtn" @click="randomColorize('bg')" title="randomize background color">format_color_fill</v-icon>
  <v-icon class="tbtn" @click="zoom('+')" title="zoom in">zoom_in</v-icon>
  <v-icon class="tbtn" @click="zoom('-')" title="zoom out">zoom_out</v-icon>
  <v-icon class="tbtn" @click="pan('l')" title="pan left">chevron_left</v-icon>
  <v-icon class="tbtn" @click="pan('r')" title="pan right">chevron_right</v-icon>
  <v-icon class="tbtn" @click="pan('u')" title="pan up">expand_less</v-icon>
  <v-icon class="tbtn" @click="pan('d')" title="pan down">expand_more</v-icon>
  <v-icon class="tbtn" @click="home()" title="toogle initial and current zoom and pan">home</v-icon>
</v-system-bar>
<div id="renderCanvas"></div>
    <v-snackbar
      v-model="snackbar"
      :multi-line="true"
      :timeout="6000"
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
import $ from 'jquery'
import * as d3 from 'd3'

function moveNode () {
  if (this.dragging) {
    const newposition = this.data.getLocalPosition(this.parent)
    this.x = newposition.x
    this.y = newposition.y
    __this.nps = newposition
    let px = this.x * 2/__this.cwidth - 1
    let py = this.y * 2/__this.cheight - 1
  }
}
function releaseNode () {
  if (this.dragging) {
    this.alpha *= 2
    this.dragging = false
    this.data = null
    __this.repositionChildren(this)
    __this.redrawLinks(this)
  } else if (__this.tool === 'resize') {
    __this.resizing = 'end'
    __this.resizeMetanode(this)
  }
}
function clickNode (event) {
  __this.mnode = this
  if (__this.tool === 'info') {
    __this.snacktext = __this.networks[this.level].ndata[this.id].mdata
    __this.snackbar = true
  } else if (__this.tool === 'explore'){
    __this.showChildren(this)
  } else if (__this.tool === 'join'){
    __this.joinMetanodes(this)
  } else if (__this.tool === 'resize'){
    __this.resizing = 'start'
    __this.resizeMetanode(this)
  } else if (__this.tool === 'drag'){
    this.data = event.data // because of multitouch
    this.alpha *= 0.5
    this.dragging = true
    this.oldx = this.x
    this.oldy = this.y
  } else {
    __this.snacktext = 'select a tool to interact with network'
    __this.snackbar = true
  }
}

const ColourValues = [
  "FF0000", "00FF00", "0000FF", "FFFF00", "FF00FF", "00FFFF", "000000",
  "800000", "008000", "000080", "808000", "800080", "008080", "808080",
  "C00000", "00C000", "0000C0", "C0C000", "C000C0", "00C0C0", "C0C0C0",
  "400000", "004000", "000040", "404000", "400040", "004040", "404040",
  "200000", "002000", "000020", "202000", "200020", "002020", "202020",
  "600000", "006000", "000060", "606000", "600060", "006060", "606060",
  "A00000", "00A000", "0000A0", "A0A000", "A000A0", "00A0A0", "A0A0A0",
  "E00000", "00E000", "0000E0", "E0E000", "E000E0", "00E0E0", "E0E0E0",
]

export default {
  head () {
    return {
      script: [
        // { src: '/libs/pixi4.8.7.js' },
        { src: '/libs/pixi5.0.2.js' },
      ]
    }
  },
  data () {
    return {
      links: true,
      nlayers: 2,
      networks_: [],
      network: '',
      bi: {
        reduction: ['0.1', '0.1'],
        max_levels: ['5', '5'],
        global_min_vertices: ['100', '100'],
        matching: ['gmb', 'gmb'],
        similarity: ['weighted_common_neighbors', 'weighted_common_neighbors'],
        upper_bound: ['0.1', '0.1'],
        itr: ['10', '10'],
        tolerance: ['0.0001', '0.0001'],
        valid_matching: ['rgmb', 'gmb', 'mlpb', 'hem', 'lem', 'rm'],
        valid_similarity: ['common_neighbors', 'weighted_common_neighbors',
        'salton', 'preferential_attachment', 'jaccard', 'weighted_jaccard',
        'adamic_adar', 'resource_allocation', 'sorensen', 'hub_promoted',
        'hub_depressed', 'leicht_holme_newman']
      },
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
      snackbar: false,
      snacktext: 'msnacktext',
      curlevel: 0,
    }
  },
  mounted () {
    window.__this = this
    this.initPixi()
    this.findNetworks()
  },
  methods: {
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
    zoom (direction) {
      let inc = 0.1
      if (direction !== '+')
        inc = -0.1
      this.curscale += inc
      this.app_.stage.scale.set(this.curscale)
      this.app_.stage.x -= this.cwidth_ * inc / 2
      this.app_.stage.y -= this.cheight_ * inc / 2
    },
    pan (direction) {
      if (direction === 'l') {
        this.app_.stage.x += -0.1 * this.cwidth_ / 2
      } else if (direction === 'r') {
        this.app_.stage.x += 0.1 * this.cwidth_ / 2
      } else if (direction === 'u') {
        this.app_.stage.y += -0.1 * this.cheight_ / 2
      } else if (direction === 'd') {
        this.app_.stage.y += 0.1 * this.cheight_ / 2
      }
    },
    home () {
      let s = this.app_.stage
      if ( (s.scale.x === s.scale.y == 1) && (s.x === 0) && (s.y === 0) ) {
        console.log('chieck ok')
        if (this.saved_view) {
          console.log('on saved_view ok')
          // if so, set again zoom and pan as was 
          s.scale.x = s.scale.y = this.saved_view.scale
          s.x = this.saved_view.x
          s.y = this.saved_view.y
        }
      } else {
        this.saved_view = {
          x: s.x,
          y: s.y,
          scale: s.scale.x
        }
        s.scale.x = s.scale.y = 1
        s.x = s.y = 0
      }
    },
    initPixi () {
      this.app_ = new PIXI.Application()
      document.getElementById('renderCanvas').appendChild(this.app_.view)
      this.cwidth_ = document.getElementsByTagName('canvas')[0].width
      this.cheight_ = document.getElementsByTagName('canvas')[0].height
      this.cwidth =  0.9 * document.getElementsByTagName('canvas')[0].width
      this.cheight = 0.9 * document.getElementsByTagName('canvas')[0].height
      document.getElementById('toolbar').style.width = this.cwidth_ + 'px'
      d3.select('canvas').on('mousedown', function () {
        if (__this.tool === 'regionexplore') {
          __this.regionexplorestart = d3.mouse(this)
          __this.eregion = new PIXI.Graphics()
          // __this.eregion.beginFill(0x0000FF, 0.1)
          // __this.eregion.drawPolygon(...__this.regionexplorestart, ...__this.regionexplorestart)
          // __this.eregion.drawRect(...__this.regionexplorestart, 0, 0)
          // __this.eregion.endFill()
          __this.app_.stage.addChild(__this.eregion)
        }
      })
      d3.select('canvas').on('mousemove', function () {
        if (__this.tool === 'regionexplore' && __this.eregion) {
          let p = d3.mouse(this)
          let e = __this.regionexplorestart
          __this.eregion.clear()
          __this.eregion.beginFill(0x0000FF, 0.3)
          __this.eregion.drawPolygon([e[0], e[1], e[0], p[1], p[0], p[1], p[0], e[1]])
          __this.eregion.endFill()
        }
      })
      d3.select('canvas').on('mouseup', function () {
        if (__this.tool === 'regionexplore') {
          __this.regionexploreend = d3.mouse(this)
          __this.eregion.clear()
          delete __this.eregion
          let r1 = __this.regionexplorestart
          let r2 = __this.regionexploreend
          let maxx = Math.max(r1[0], r2[0])
          let maxy = Math.max(r1[1], r2[1])
          let minx = Math.min(r1[0], r2[0])
          let miny = Math.min(r1[1], r2[1])
          let nodes = __this.nodes[__this.curlevel]
          let nodes_ = []
          nodes.forEach( n => {
            let b = n.getBounds()
            if ( b.x >= minx && b.x + b.width <= maxx && b.y >= miny && b.y + b.height <= maxy ) {
              // if (!__this.networks[n.level].ndata[n.id].isopen) {
              //   __this.showChildren(n)
              // }
              nodes_.push(n)
            }
          })
          if (nodes_.length > 0)
            __this.joinManyNodes(nodes_)
        }
      })
      this.curscale = 1
      this.app_.stage.interactive = true
    },
    findNetworks () {
      this.$store.dispatch('networks/find').then(() => {
        let networks_ = this.$store.getters['networks/list']
        this.networks_ = networks_.filter(i => {
          return (i.layer === 0) && (i.filename.split('.').pop() === 'ncol')
        })
        this.network = this.networks_[0]
      })
    },
    renderNetwork () {
      let turl = process.env.flaskURL + '/biMLDBtopdown/'
      $.post(
        turl,
        // {see: 'this', and: 'thisother', num: 5}
        {
          netid: this.network._id,
          bi: this.bi,
          layout: this.layout,
          dim: 2,
          method: this.method
        }
      ).done( networks => { 
        this.networks = networks
        this.curlevel = networks.length - 1
        this.mkAuxiliaryData()
        this.mapNetworkToScreen()
      })
    },
    mkAuxiliaryData () {
      this.mkPaths()
      this.nodescales = []
      this.nodecolors = []
      this.linkcolors = []
      this.ndata = []
      this.nodes = []
      this.opennodes = []
      this.childparent = [] // [level][childid] = parentid of node which 
      this.links_ = [] // for dict nid1-nid2 = link
      for (let level = 0; level <= this.curlevel; level++) {
        this.links_.push({})
        this.nodes.push([])
        this.opennodes.push({})
        this.childparent.push({})
        this.nodescales.push(1 - 0.9 * ((this.curlevel - level) / this.curlevel)**0.5)
        // this.nodecolors.push(0xFFFFFF*(1 - 0.9 * ((this.curlevel - level) / this.curlevel)**0.5))
        // this.linkcolors.push(0xFFFFFF*(0.9 * ((this.curlevel - level) / this.curlevel)**0.5))
        this.nodecolors.push(parseInt(ColourValues[level], 16))
        this.linkcolors.push(parseInt(ColourValues[ColourValues.length - 1 - level], 16))
        let links = this.networks[level].links
        let children = this.networks[level].children
        let parents = this.networks[level].parents
        let sources = this.networks[level].sources
        let nodelinks = sources.map( s => [] )
        for (let i = 0; i < links.length; i++) {
          let l = links[i]
          nodelinks[l[0]].push(i)
          nodelinks[l[1]].push(i)
        }
        let ndata = []
        for (let i = 0; i < sources.length; i++) {
          let neighbors = nodelinks[i]
            .map( l => links[l])
            .map( l => (l[0] === i ? l[1] : l[0]))
          let strength = nodelinks[i]
            .map( l => links[l])
            .map( l => l[2])
            .reduce( (a, e) => a+e, 0)
          let mdata = {
            children: children[i],
            degree: neighbors.length,
            strength: strength,
            parent_: parents[i],
            level: level,
            neighbors: neighbors,
            ID: i
          }
          let MLdata = {
            paths: [],
            children: [],
            ids: [],
          }
          let aux = {
            links: nodelinks[i],
            links_: nodelinks[i].map( l => links[l]),
            neighbors: neighbors,
            source: sources[i],
          }
          ndata.push({
            mdata: mdata,
            MLdata: MLdata,
            aux: aux
          })
        }
        this.networks[level].ndata = ndata
      }
      this.nodecolors.reverse()
    },
    mkPaths () {
      this.radius = 10
      this.dx = Math.cos(Math.PI/6) * this.radius
      this.dy = Math.sin(Math.PI/6) * this.radius
      let p1x = 0
      let p1y = - this.radius
      let p2x = + this.dx
      let p2y = + this.dy
      let p3x = - this.dx
      let p3y = + this.dy
      this.path = [p1x, p1y, p2x, p2y, p3x, p3y]
      let r = this.radius
      this.pathrect = [-r, -r, -r, r, r, r, r, -r]
    },
    mapNetworkToScreen () {
      let nodes = this.networks[this.curlevel].sources.map( (e,i) => i )
      let links = this.networks[this.curlevel].links
      let center = [0, 0]
      this.placeOnCanvas(nodes, links, this.curlevel, this.cwidth_, this.cheight_, center)
      this.loaded = true
    },
    placeOnCanvas (nodes, links, level, width, height, center) {
      let turl = process.env.flaskURL + '/layoutOnDemand/'
      $.ajax(
        turl,
        // {see: 'this', and: 'thisother', num: 5}
        {
          data: JSON.stringify({
            layout: this.layout,
            dim: 2,
            nodes: nodes,
            links: links
          }),
          contentType : 'application/json',
          type : 'POST',
        },
      ).done( layout => {
        this.xxlayout = layout
        this.mkLines(links, level, width, height, center, layout)
        this.mkNodes(nodes, level, width, height, center, layout)
      })
    },
    mkLines (links, level, width, height, center, layout) {
      for (let i = 0; i < links.length; i++) {
        let l = links[i]
        let p1x = (1 + layout[l[0]][0])*width/2 + center[0]
        let p1y = (1 + layout[l[0]][1])*height/2 + center[1]
        let p2x = (1 + layout[l[1]][0])*width/2 + center[0]
        let p2y = (1 + layout[l[1]][1])*height/2 + center[1]
        let lid = l[0]+'-'+l[1]
        if (this.links_[level][lid]) {
          let line = this.links_[level][lid]
          line.clear()
          line.moveTo(p1x, p1y)
          line.lineTo(p2x, p2y)
        } else {
          let line = this.mkLine([p1x, p1y], [p2x, p2y], level)
          this.links_[level][l[0]+'-'+l[1]] = line
        }
      }
    },
    mkLine (p1, p2, level) {
      let line = new PIXI.Graphics()
      line.lineStyle(1, 0xFFFFFF)
      line.tint = this.linkcolors[level]
      line.moveTo(...p1)
      line.lineTo(...p2)
      line.alpha = 0.4
      this.app_.stage.addChild(line)
      return line
    },
    repositionChildren (node) {
      if (!node.visible)
        return
      let ndata = this.networks[node.level].ndata[node.id]
      if (ndata.MLdata.isopen) {
        let dx = node.x - node.oldx
        let dy = node.y - node.oldy
        // get children
        ndata.MLdata.children[ndata.MLdata.children.length -1].forEach( c => {
          let c_ = this.nodes[node.level - 1][c]
          c_.oldx = c_.x
          c_.oldy = c_.y
          c_.x += dx
          c_.y += dy
          console.log('repositioned child', c_.id)
          this.redrawLinks(c_)
          this.repositionChildren(c_)
        })
      }
    },
    mkNodes (nodes, level, width, height, center, layout) {
      for (let i = 0; i < nodes.length; i++) {
        let nid = nodes[i]
        let p = layout[nid]
        let px = (1 + p[0]) * width/2 + center[0]
        let py = (1 + p[1]) * height/2 + center[1]
        let node_ = this.nodes[level][nodes[i]]
        if (!node_) { // node is not created still
          const node = new PIXI.Graphics()
          node.lineStyle(0)
          node.beginFill(0xFFFFFF)
          node.drawPolygon(this.path)
          node.endFill()
          node.tint = this.nodecolors[level]
          node.x = px
          node.y = py
          node.interactive = level === this.curlevel
          node.buttonMode = true
          node.alpha = 0.8
          node
            .on('pointerdown', clickNode)
            .on('pointerup', releaseNode)
            .on('pointerupoutside', releaseNode)
            .on('pointermove', moveNode)
          node.id = nid
          node.level = level
          node.scale.x *= this.nodescales[level]
          node.scale.y *= this.nodescales[level]
          this.app_.stage.addChild(node)
          this.nodes[level][nodes[i]] = node
        } else {
          node_.x = px
          node_.y = py
        }
      }
    },
    setTool (toolname) {
      let b = document.getElementById(toolname+'btn')
      if (this.tool === toolname) {
        this.tool = ''
        b.style.backgroundColor = "gray"
      } else {
        this.tool = toolname
        this.snacktext = {
          info: 'click on nodes for info',
          drag: 'click and hold on node to drag',
          explore: 'click on nodes to show their child nodes',
          join: 'click on two open metanodes to join them',
          regionexplore: 'click and drag to open all nodes in region',
        }[toolname]
        this.snackbar = true
        Array(...document.getElementsByClassName('ptbtn')).forEach( e => { e.style.backgroundColor = 'gray' })
        b.style.backgroundColor = "black"
      }
    },
    focusLevel (level) {
      if (level === '+')
        level = this.curlevel + 1
      if (level === '-')
        level = this.curlevel - 1
      if (level === this.networks.length) {
        level--
        this.snacktext = 'coarsest level reached'
        this.snackbar = true
      }
      if (level === -1) {
        level++
        this.snacktext = 'original network reached'
        this.snackbar = true
      }
      this.nodes.forEach( (nodes_, level_) => {
        nodes_.forEach( n => {
          n.interactive = level_ === level
        })
      })
      this.curlevel = level
    },
    randomColorize (item) {
      if (item === 'bg') {
        this.app_.renderer.backgroundColor = Math.random() * 0xFFFFFF
      }
      let things
      if (item === 'n')
        things = this.nodes[this.curlevel]
      else
        things = Object.values(this.links_[this.curlevel])
      let rcolor = Math.floor(Math.random() * 0xFFFFFF)
      things.forEach( t => {
        t.tint = rcolor
      })
    },
    resizeMetanode (node) {
      let MLdata = this.networks[node.level].ndata[node.id].MLdata
      if (!MLdata.isopen)
        return
      if (this.resizing === 'start') {
        console.log('still on start')
        let m = __this.app_.renderer.plugins.interaction.mouse.global
        this.rpos0 = [m.x, m.y]
        this.rnode = node
        return
      }
      this.rpos1 = __this.app_.renderer.plugins.interaction.mouse.global
      let dx = this.rpos1.x - this.rpos0[0]
      let dy = this.rpos1.y - this.rpos0[1]
      let n = this.rnode
      if (this.rpos0[0] < n.x)
        dx *= -1
      if (this.rpos0[1] < n.y)
        dy *= -1
      let MLdata_ = this.networks[n.level].ndata[n.id].MLdata
      let path = MLdata_.paths[MLdata.paths.length - 1]
      let sx = (2*dx + path[4] - path[0]) / (path[4] - path[0])
      let sy = (2*dy + path[5] - path[1])/ (path[5] - path[1])
      path[4] += dx
      path[6] += dx
      path[0] -= dx
      path[2] -= dx
      path[3] += dy
      path[5] += dy
      path[1] -= dy
      path[7] -= dy
      console.log('ok inside', dx, dy, this.rpos1, this.rpos0)
      n.clear()
      n.beginFill(0xFFFFFF, .1)
      n.drawPolygon(path)
      n.endFill()
      let b = n.getBounds()
      MLdata_.children[MLdata_.children.length - 1].forEach( c => {
        let c_ = this.nodes[n.level - 1][c]
        let ddx = (c_.x - b.x-dx) * sx
        let ddy = (c_.y - b.y-dy) * sy
        c_.x = b.x + ddx
        c_.y = b.y + ddy
        this.redrawLinks(c_)
      })
    },
    resizeNodes (direction) {
      let inc = 0.1
      if (direction !== '+')
        inc = -0.1
      this.nodes[this.curlevel].forEach( n => {
        n.scale.x += inc
        n.scale.y += inc
      })
    },
    proportionalNodes (criterion) {
      let info
      if (criterion === 'children')
        info = this.networks[this.curlevel].children.map( i => i.length )
      else
        info = this.networks[this.curlevel].ndata.map( i => i.mdata.degree )
      let imax = Math.max(...info)
      this.nodes[this.curlevel].forEach( (n, i) => {
        let factor = ( 0.3 + 0.7 * info[i] / imax )
        n.scale.x *= factor
        n.scale.y *= factor
      })
    },
    restoreNodeSizes () {
      let scale = this.nodescales[this.curlevel]
      this.nodes[this.curlevel].forEach( n => {
        n.scale.set(scale)
      })
    },
    nodeVisibility (direction) {
      let inc = 0.1
      if (direction !== '+')
        inc = -0.1
      this.nodes[this.curlevel].forEach( l => {
        l.alpha += inc
      })
    },
    rotateNodes () {
      this.nodes[this.curlevel].forEach( n => {
        n.rotation -= 0.1
      })
    },
    linkVisibility (direction) {
      let inc = 0.1
      if (direction !== '+')
        inc = -0.1
      Object.values(this.links_[this.curlevel]).forEach( l => {
        l.alpha += inc
      })
    },
    redrawLinks (node) {
      let links_ = this.networks[node.level].ndata[node.id].aux.links_
      let nodes = this.nodes[node.level]
      console.log('rlinks', node.id)
      links_.forEach( (l, i) => {
        let n1 = nodes[l[0]]
        let n2 = nodes[l[1]]
        if (!n1 || !n2) {
          console.log('node node', n1, n2)
          return
        }
        let p1x = n1.x
        let p1y = n1.y
        let p2x = n2.x
        let p2y = n2.y
        let linkid = l[0]+'-'+l[1]
        let line = this.links_[node.level][linkid]
        if (!line)
          return
        line.clear()
        line.moveTo(p1x, p1y)
        line.lineTo(p2x, p2y)
      })
      if (node.ids) {
        console.log('ok, ids found')
        node.ids.forEach( id => {
          if (id !== node.id) {
            console.log('ok, diff id found:', id, node.id)
            let node_ = this.nodes[node.level][id]
            node_.x = node.x
            node_.y = node.y
            this.redrawLinks(node_)
          }
        })
      }
    },
    showChildren (node) {
      node.clear()
      node.tint = 0xFFFFFF
      node.lineStyle(2, 0xFFFFFF, 0.7)
      node.beginFill(0xFFFFFF, .1)
      node.drawPolygon(this.pathrect)
      node.endFill()
      let MLdata = this.networks[node.level].ndata[node.id].MLdata
      MLdata.paths.push(this.pathrect)
      if (!MLdata.isopen)
        MLdata.children.push(
          this.networks[node.level].ndata[node.id].mdata.children
      )
      this.positionChildren(node)
      MLdata.isopen = true
    },
    positionChildren(node) {
      let level = node.level - 1
      let MLdata = this.networks[node.level].ndata[node.id].MLdata
      let children = MLdata.children[MLdata.children.length - 1]
      let dx = - 0.85 * MLdata.paths[MLdata.paths.length - 1][0]
      let dy = - 0.85 * MLdata.paths[MLdata.paths.length - 1][1]
      let c = [node.x - dx, node.y - dy]

      let ndata = this.networks[level].ndata
      let links = []
      children.forEach( c1 => {
        let neighbors = ndata[c1].mdata.neighbors
        children.forEach( c2 => {
          if (neighbors.includes(c2)) {
            let tlink = ndata[c1].aux.links_[neighbors.indexOf(c2)]
            links.push(tlink)
          }
        })
        this.childparent[level][c1] = node.id
      })

      this.placeOnCanvas(children, links, level, dx*2, dy*2, c)

      this.snacktext = 'shown children ' + children + ' at level ' + level
      this.snackbar = true
    },
    joinManyNodes (nodes) {
      // make the rect:
      // find max and min x and y of all the nodes
      // make the rect
      let bounds = nodes.map( n => n.getBounds() )
      let maxx = Math.max(...bounds.map( b => b.x + b.width ))
      let maxy = Math.max(...bounds.map( b => b.y + b.height ))
      let minx = Math.min(...bounds.map( b => b.x ))
      let miny = Math.min(...bounds.map( b => b.y ))
      let c = [(maxx + minx) / 2, (maxy + miny) / 2]
      let path_ = [
        minx-4 - c[0], miny-4 - c[1],
        minx-4 - c[0], maxy+4 - c[1],
        maxx+4 - c[0], maxy+4 - c[1],
        maxx+4 - c[0], miny-4 - c[1]
      ]
      this.mmc = c
      this.mmpath_ = path_
      this.mmbounds = bounds
      nodes.forEach( n => {
        n.clear()
        n.visible = false
      })
      let rect = nodes[0]
      rect.visible = true
      rect.lineStyle(2, 0xFFFFFF, 0.7)
      rect.beginFill(0xFFFFFF, .1)
      rect.drawPolygon(path_)
      rect.endFill()
      let ids = nodes.map( n => n.id )
      ids.sort( (a, b) => a - b )
      rect.ids = ids
      rect.scale.set(1)
      rect.x = c[0]
      rect.y = c[1]
      this.redrawLinks(rect)
      let tid = ids.join ('-')

      this.opennodes[tid] = rect

      // plot children:
      // get the children of all the nodes
      // check if they have links
      let children = []
      nodes.forEach( n => {
        let MLdata = this.networks[n.level].ndata[n.id].MLdata
        if (!MLdata.isopen) {
          children = children.concat( this.networks[this.curlevel].children[n.id] )
        } else
          children = children.concat( MLdata.children[MLdata.children.length - 1] )
      })
      let MLdata = this.networks[rect.level].ndata[rect.id].MLdata
      let children_ = [...new Set(children)]
      children_.sort( (a, b) => a - b )
      MLdata.children.push( children_ )
      MLdata.paths.push( path_ )
      
      this.positionChildren(rect)
      MLdata.isopen = true
    },
    joinMetanodes (node) {
      let MLdata = this.networks[node.level].ndata[node.id].MLdata
      if (!MLdata.isopen) {
        this.snacktext = 'please choose an opened metanode'
        this.snackbar = true
        return
      }
      if (!this.specified_metanode) {
        this.specified_metanode = node
        node.tint = 0x00FFFF
      } else {
        let n1 = this.specified_metanode
        let n2 = node
        this.n1 = n1
        this.n2 = n2
        let MLdata_ = this.networks[n1.level].ndata[n1.id].MLdata
        let path1 = MLdata_.paths[MLdata_.paths.length - 1]
        let path2 = MLdata.paths[MLdata.paths.length - 1]
        let maxx = Math.max(
          - path1[0] + n1.x,
          - path2[0] + n2.x,
        )
        let maxy = Math.max(
          - path1[1] + n1.y,
          - path2[1] + n2.y,
        )
        let minx = Math.min(
          path1[0] + n1.x,
          path2[0] + n2.x,
        )
        let miny = Math.min(
          path1[1] + n1.y,
          path2[1] + n2.y,
        )
        let ex = (maxx - minx) / 2
        let ey = (maxy - miny) / 2
        let path = [ -ex, -ey, -ex, ey, ex, ey, ex, -ey] // meta rectangle
        let cx = (maxx + minx) / 2
        let cy = (maxy + miny) / 2

        n1.clear()
        n2.clear()
        n1.beginFill(0xFFFFFF, .1)
        n1.drawPolygon(path)
        n1.endFill()
        n1.x = cx
        n1.y = cy
        MLdata_.paths.push(path)
        n1.tint = 0xFFFFFF
        let children1, children2
        if (!MLdata_.isopen) {
          children1 = this.networks[n1.level].ndata[n1.id].mdata.children
        } else {
          children1 = MLdata_.children[MLdata_.children.length - 1]
        }
        if (!MLdata.isopen) {
          children2 = this.networks[n2.level].ndata[n2.id].mdata.children
        } else {
          children2 = MLdata.children[MLdata.children.length - 1]
        }
        MLdata_.children.push(children1.concat(children2))
        this.positionChildren(n1)
        this.specified_metanode = 0
      }
    },
  },
  computed: {
    curlevelinfo: function () {
      let val = this.curlevel
      if (this.loaded) {
        let nvis = this.nodes[val].length
        let lvis = Object.keys(this.links_[val]).length
        return val + ', nodes: ' + nvis +'/'+ this.networks[val].sources.length + ', links: ' + lvis +'/'+ this.networks[val].links.length
      } else {
        return 'loading'
      }
    },
  }
}
</script>

<style>
.tcolumn {
  padding-left: 5px;
}
.btn22 {
  margin: 0;
  min-width: 60px;
  max-width: 60px;
  width: 60px;
}
.tbtn {
  background-color: gray;
}
.v-system-bar--window .v-icon {
  font-size: 20px;
  margin-right: 4px;
}
</style>
