<template>
  <v-container justify-center
      style="background:#FFFFFF">
    <div>
      <h1>Analysis settings</h1>
<v-container text-xs-center>
<v-card flat dark>
  <v-layout align-center justify-center row fill-height>
    <v-flex xs4 order-md2 order-xs2 center>
    <p>Select network</p>
    <v-menu offset-y>
      <v-btn
        slot="activator"
        color="primary"
        dark
      >
        {{ network ? network.filename : 'Select' }}
      </v-btn>
      <v-list>
        <v-list-tile
          v-for="(net, index) in networks"
          :key="index"
          @click="network = net"
        >
          <v-list-tile-title color="primary">{{ net.filename }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    </v-flex>
    <v-flex xs12 sm6 md3 order-md1 order-xs1>
    <p>Select settings</p>
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
</v-card>
</v-container>
<v-container text-xs-center>
<v-card flat dark>
  <v-layout align-center justify-center row fill-height>
    <v-flex xs4 order-md1 order-xs1 center>
    <p>Layout algorithm</p>
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
    <v-flex xs4 order-md2 order-xs2>
    <p>Dimensions of layout: {{ dimensions || 'null' }}</p>
    <v-radio-group v-model="dimensions">
      <v-radio :label="'2'" :value="2"></v-radio>
      <v-radio :label="'3'" :value="3"></v-radio>
    </v-radio-group>
    </v-flex>
    <v-flex xs4 order-md3 order-xs3>
    <p> Draw links: {{ links ? 'yes' : 'no' }}</p>
    <v-radio-group v-model="links">
      <v-radio :label="'Yes'" :value="true"></v-radio>
      <v-radio :label="'No'" :value="false"></v-radio>
    </v-radio-group>
    </v-flex>
  </v-layout>
</v-card>
</v-container>
<v-container text-xs-center>
<v-card flat dark>
  <v-layout align-center justify-center row fill-height>
    <v-flex xs4 order-md1 order-xs1 center>
      <p>Coarsening method</p>
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
</v-container>
<v-container text-xs-center>
<v-card flat dark>
  <v-layout align-center justify-center row fill-height>
    <v-flex xs4 order-md1 order-xs1 center>
      <p>Axis of coarsened networks</p>
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
</v-container>
<v-container text-xs-center>
<v-card flat dark>
  Histograms
  <v-layout>
    <v-container fluid>
      <v-layout row wrap class="light--text">
        <v-flex xs6>
          <v-checkbox v-model="hist.degree" label="degree" value></v-checkbox>
        </v-flex>
        <v-flex xs6>
          <v-checkbox v-model="hist.clust" label="clustering coefficient" value></v-checkbox>
        </v-flex>
      </v-layout>
    </v-container>
  </v-layout>
</v-card>
</v-container>
    </div>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
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
      dimensions: 2,
      links: true,
      layers: 5,
      methods: [
        'kclicks',
        'label propagation',
        'connected components'
      ],
      method: 'label propagation',
      separation: 0.3,
      axis: 'y',
      axis_: [
        'x',
        'y',
        'z'
      ],
      networks: [],
      network: '',
      name: '',
      newname: '',
      settings: [],
      hist: {
        degree: false,
        clust: false
      }
    }
    // method, sep, axis
  },
  methods: {
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
    }
  },
  watch: {
    name () {
      console.log('set is new')
    }
  },
  created () {
    this.findNetworks()
    this.findSettings()
  }

}
</script>

<style> *{ text-transform: none !important; } </style>

