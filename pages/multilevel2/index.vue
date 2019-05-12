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
<div slot="header">settings</div>
<div style="border:2px solid black; padding: 4px">
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
</div>
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
  <v-checkbox v-model="links" label="draw links"> </v-checkbox>
  <v-text-field
    v-model="levels"
    label="levels"
    outline
    readonly
  ></v-text-field>
</v-layout>
      <canvas id="renderCanvas" touch-action="none"></canvas>
</span>
</template>

<script>
import $ from 'jquery'
import * as d3 from 'd3'
if (process.client) {
  console.log('quase')
  // require('pixi.js')
}

export default {
  data () {
    return {
      links: true,
      panel: [true],
      nlayers: 2,
      levels: '----',
      networks_: [],
      network: '',
      bi: {
        reduction: ['0.1', '0.1'],
        max_levels: ['5', '5'],
        global_min_vertices: ['100', '100'],
        matching: ['mlpb', 'mlpb'],
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
    }
  },
  mounted () {
    window.__this = this
    d3.select('canvas')
      .on('mouseenter', function () {
        d3.select('body').style('overflow', 'hidden')
      })
      .on('mouseout', function () {
        d3.select('body').style('overflow', 'scroll')
      })
    this.findNetworks()
  },
  methods: {
    upload () {
    },
    renderNetwork () {
      if (!this.pixi_initialized)
        this.initPixi()
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
        console.log('tnetssss', networks)
        this.networks = networks
        this.curlevel = networks.length - 1
        this.mapNetworkToScreen()
      })
    },
    mapNetworkToScreen () {
    },
    initPixi () {
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
</style>
