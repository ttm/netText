<template>
<span>
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
</v-layout>
<v-expansion-panel expand v-model="panel">
  <v-expansion-panel-content>
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
  </v-expansion-panel-content>
</v-expansion-panel>
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
  <v-icon class="tbtn" @click="showLevel('+')" title="show coarser level">expand_less</v-icon>
  <v-icon class="tbtn" @click="showLevel('-')" title="show less coarser level">expand_more</v-icon>
  <v-icon class="tbtn" id="ibtn" @click="setInfoTool()" title="get info on specific nodes">info</v-icon>
  <v-icon class="tbtn" id="ebtn" @click="setExploreTool()" title="open nodes into child nodes">explore</v-icon>
</v-system-bar>
      <div id="renderCanvas"></div>
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
import $ from 'jquery'
import * as d3 from 'd3'

function clickNode () {
  if (__this.tool === 'info') {
    __this.snacktext = this.mdata
    __this.snackbar = true
  } else if (__this.tool === 'explore'){
    __this.showChildren(this)
  } else {
    __this.snacktext = 'select a tool to interact with network'
    __this.snackbar = true
  }
}
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
      panel: [true],
      nlayers: 2,
      curlevel: '----',
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
      curlevelinfo: '---',
    }
  },
  mounted () {
    window.__this = this
    this.initPixi()
    d3.select('canvas')
      .on('mouseenter', function () {
        d3.select('body').style('overflow', 'hidden')
      })
      .on('mouseout', function () {
        d3.select('body').style('overflow', 'scroll')
      })
    this.findNetworks()
    this.initButtons()
  },
  methods: {
    initButtons () {
      this.toolbuttons = [
        document.getElementById('ibtn'),
        document.getElementById('ebtn')
      ]
    },
    setExploreTool () {
      let b = document.getElementById('ebtn')
      if (this.tool === 'explore') {
        this.tool = ''
        b.style.backgroundColor = "gray"
      } else {
        this.tool = 'explore'
        this.snacktext = 'click on nodes to show their child nodes'
        this.snackbar = true
        this.toolbuttons.forEach( bt => bt.style.backgroundColor = 'gray')
        b.style.backgroundColor = "black"
      }
    },
    setInfoTool () {
      let b = document.getElementById('ibtn')
      if (this.tool === 'info') {
        this.tool = ''
        b.style.backgroundColor = "gray"
      } else {
        this.tool = 'info'
        this.snacktext = 'click on nodes for info'
        this.snackbar = true
        this.toolbuttons.forEach( bt => bt.style.backgroundColor = 'gray')
        b.style.backgroundColor = "black"
      }
    },
    showChildren (node) {
      node.alpha = 0.5
      node.tint = 0xFF00FF
      let level = node.mdata.level - 1
      let children = node.mdata.children
      let nodes = this.nodes[level]
      for (let i = 0; i < children.length; i++) {
        let child = children[i]
        nodes[child].visible = true
        nodes[child].tint = 0x0000FF
      }
      this.snacktext = 'shown children ' + children + ' of level ' + level
      this.snackbar = true
    },
    initPixi () {
      this.app_ = new PIXI.Application()
      document.getElementById('renderCanvas').appendChild(this.app_.view)
      this.cwidth =  0.9 * document.getElementsByTagName('canvas')[0].width
      this.cheight = 0.9 * document.getElementsByTagName('canvas')[0].height
      document.getElementById('toolbar').style.width = this.cwidth/0.9 + 'px'
    },
    mkNode(p, level) {
      let px = (1 + p[0]) * this.cwidth/2
      let py = (1 + p[1]) * this.cheight/2
      const node = new PIXI.Graphics()
      node.lineStyle(0)
      node.beginFill(0xFFFFFF)
      node.drawPolygon(this.path)
      node.endFill()
      node.tint = 0xFF0000
      node.x = px
      node.y = py
      node.visible = this.curlevel == level
      node.interactive = true
      node.buttonMode = true
      node.on('pointerdown', clickNode)
      this.app_.stage.addChild(node)
      this.nodes[level].push(node)
      return node
    },
    mkNodes(level) {
      let net = this.networks[level]
      let ps = net.nodes
      for (let i = 0; i < ps.length; i++) {
        let node = this.mkNode(ps[i], level)
        node.mdata = {
          children: net.children[i],
          clust: net.clust[i],
          degree: net.degrees[i],
          parent: net.parents[i],
          source: net.sources[i],
          level: level,
          ID: i
        }
      }
    },
    mkLine (p1, p2, level) {
      let line = new PIXI.Graphics()
      line.lineStyle(0.1, 0xffff00)
      line.moveTo(...p1)
      line.lineTo(...p2)
      line.visible = this.curlevel == level
      this.app_.stage.addChild(line)
      this.lines[level].push(line)
    },
    mkLines(level) {
      let links = this.networks[level].edges
      let nodes = this.networks[level].nodes
      let self = this
      for (let i = 0; i < links.length; i++) {
        let l = links[i]
        let p1x =  (1 + nodes[l[0]][0])*self.cwidth/2
        let p1y =  (1 + nodes[l[0]][1])*self.cheight/2
        let p2x =  (1 + nodes[l[1]][0])*self.cwidth/2
        let p2y =  (1 + nodes[l[1]][1])*self.cheight/2
        this.mkLine([p1x, p1y], [p2x, p2y], level)
      }
    },
    upload () {
    },
    renderNetwork () {
      let turl = process.env.flaskURL + '/biMLDBAll/'
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
        this.mapNetworksToScreen()
      })
    },
    mapNetworksToScreen () {
      this.lines = []
      this.nodes = []
      this.mkPath()
      for (let i = 0; i <= this.curlevel; i++) {
        this.lines.push([])
        this.nodes.push([])
        this.mkLines(i)
        this.mkNodes(i)
      }
      this.loaded = true
    },
    mkPath () {
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
    },
    showLevel (level) {
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
      for (let i = 0; i < this.networks.length; i++) {
        let lines = this.lines[i]
        let nodes = this.nodes[i]
        lines.forEach( l => {
          l.visible = level === i
        })
        nodes.forEach( t => {
          t.visible = level === i
        })
      }
      this.curlevel = level
    },
    findNetworks () {
      this.$store.dispatch('networks/find').then(() => {
        let networks_ = this.$store.getters['networks/list']
        this.networks_ = networks_.filter(i => {
          return (i.layer === 0) && (i.filename.split('.').pop() === 'ncol')
        })
        this.network = this.networks_[0]
        this.renderNetwork()
      })
    },
  },
  watch: {
    curlevel: function(val) {
      if (this.loaded) {
        this.curlevelinfo = val + ', nodes: ' + this.networks[val].nodes.length + ', links: ' + this.networks[val].edges.length
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
  cursor: pointer;
  background-color: gray;
}
</style>
