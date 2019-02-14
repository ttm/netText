<template>
  <v-container justify-center
  <div>
    <h1>Analysis settings</h1>
<v-layout align-center justify-start row ma-1 pa-1>
    Select settings:
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
    <v-flex xs2 mr-2>
    <v-text-field
      :label="'first message'"
      :left="true"
      v-model="first_message"
      type="number"
      min="0"
    ></v-text-field>
    </v-flex>
    <v-flex xs2>
    <v-text-field
      :label="'last message'"
      :left="true"
      v-model="last_message"
      type="number"
      min="0"
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

<v-flex mt-1>
<v-card flat dark>
<v-layout align-center justify-start row>
    <v-flex xs1 ml-2>
      Rates: 
    </v-flex>
    <v-flex xs2 mr-2 ml-2>
    <v-text-field
      :label="'frames/second'"
      :left="true"
      v-model="frames_second"
      type="number"
      min="0"
      max="120"
    ></v-text-field>
    </v-flex>
    <v-flex xs2>
    <v-text-field
      :label="'messages/second'"
      :left="true"
      v-model="messages_second"
      type="number"
      min="0"
    ></v-text-field>
    </v-flex>
</v-layout>
</v-card>
</v-flex>
</div>
  </v-container>
</template>

<script>
// import enet from '~/static/here.json'
const enet = require('~/static/here.json')
// import fs from 'fs'
// const enet = JSON.parse(fs.readFileSync('~/static/here.json', 'utf8'))

export default {
  data () {
    return {
      networks: [{name: 'dummy', data: enet}, {name: 'other', data: []}],
      // network: ''
      network: {name: 'dummy', data: enet},
      settings: [{name: 'new'}, {name: 'other'}],
      sname: 'other',
      newname: '',
      first_message: 0,
      last_message: 0,
      sec_methods: ['Erdös', 'Percentages'],
      sec_method: 'Erdös',
      frames_second: 10,
      messages_second: 30,
      hubs_perc: 5,
      int_perc: 15,
      per_perc: 80,
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
      this.last_message = net.data.length
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
    }
  },
  mounted () {
    window.enet = enet
    this.loadNetwork(this.network)
  }
}
</script>
