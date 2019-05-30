<template>
<div>
  <v-menu offset-y title="select seed gene">
    <v-btn
      slot="activator"
      color="primary"
    >
      {{ gene ? gene : 'Select gene' }}
    </v-btn>
    <v-list>
      <v-list-tile
        v-for="(gene_, index) in genes"
        :key="index"
        @click="gene = gene_"
      >
        <v-list-tile-title color="primary">{{ gene_ }}</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
  <v-btn
    slot="activator"
    color="green lighten-2"
    @click="renderNetwork()"
    title="click to plot seed to canvas"
  >
    Render network
  </v-btn>
  <div @contextmenu="mhandler($event)" id="renderCanvas"></div>
</div>
</template>

<script>
// global.fetch = require("node-fetch")
// // window.fetch = require("node-fetch")
// import * as d3 from 'd3'
// import fetch from 'node-fetch'
// global.fetch = fetch
import $ from 'jquery'
function hoverNode () {
  console.log(this.gene)
  __this.genedata[this.gene].forEach( (g, i) => {
    let gene = __this.genes[i]
    if (g > __this.limiar && gene !== this.gene && __this.genenodes[gene]) {
      __this.genenodes[gene].tint = 0xFFFF00 
    }
  })
}
function outNode () {
  console.log(this.gene)
  __this.genedata[this.gene].forEach( (g, i) => {
    let gene = __this.genes[i]
    if (g > __this.limiar && gene !== this.gene && __this.genenodes[gene]) {
      __this.genenodes[gene].tint = 0xFF0000 
    }
  })
}
function clickNode () {
  console.log('plot genes > x')
  __this.mgene = this
  let genes = []
  __this.genedata[this.gene].forEach( (g, i) => {
    let gene = __this.genes[i]
    if (g > __this.limiar && gene !== this.gene) {
      genes.push(gene)
    }
  })
  __this.plotGenes(genes, this.generation + 1)
  __this.mgenes = genes
}
export default {
  head () {
    return {
      script: [
        // { src: '/libs/pixi4.8.7.js' },
        { src: '/libs/pixi5.0.2.js' },
      ],
    }
  },
  data () {
    return {
      genes: [],
      gene: '',
      limiar: 0.2,
    }
  },
  methods: {
    renderNetwork () {
      this.nodes = []
      const node = new PIXI.Graphics()
      node.gene = this.gene
      node.generation = 0
      node.lineStyle(1, 0x0000FF)
      node.beginFill(0xFFFFFF)
      node.drawCircle( 0, 0, 10 )
      node.endFill()
      node.tint = 0xFF0000
      node.interactive = true
      node.buttonMode = true
      node.alpha = 0.8
      this.app_.stage.addChild(node)
      node
        .on('pointerover', hoverNode )
        .on('pointerout', outNode )
        .on('pointerdown', clickNode )
      //   .on('pointerup', releaseNode)
      //   .on('pointerupoutside', releaseNode)
      //   .on('pointermove', moveNode)
      this.nodes.push(node)
      this.getGeneData(this.gene)
      this.generations[0] = [this.gene]
      this.genenodes[this.gene] = node
    },
    plotGenes (genes, generation) {
      let genes_ = genes.filter( g => !Object.keys(this.genenodes).includes(g) )
      if (!this.generations[generation])
        this.generations[generation] = genes_
      else
        this.generations[generation] = this.generations[generation].concat(genes_)
      let r = generation * 30
      let l = this.generations[generation].length
      this.generations[generation].forEach( (g, i) => {
        let a = 2*Math.PI*i/l
        if (!this.genenodes[g]) {
          const node = new PIXI.Graphics()
          node.gene = g
          node.generation = generation
          node.lineStyle(1, 0x0000FF)
          node.beginFill(0xFFFFFF)
          node.drawCircle( 0, 0, 10 )
          node.x = r*Math.cos(a)
          node.y = r*Math.sin(a)
          node.endFill()
          node.tint = 0xFF0000
          node.interactive = true
          node.buttonMode = true
          node.alpha = 0.8
          node
            .on('pointerover', hoverNode )
            .on('pointerout', outNode )
            .on('pointerdown', clickNode )
          this.app_.stage.addChild(node)
          this.nodes.push(node)
          this.genenodes[g] = node
          this.getGeneData(g)
        } else {
          let n = this.genenodes[g]
          n.x = r*Math.cos(a)
          n.y = r*Math.sin(a)
        }
      })
    },
    mkLinks_ (g) {
      let cc = this.genedata[g]
      cc.forEach( (c, j) => {
        if (c > this.limiar) {
          let gg = this.genes[j]
          if (gg === g)
            return
          let lnames = Object.keys(this.links)
          if (this.genenodes[gg]) {
            let n1 = g+'-'+gg
            let n2 = gg+'-'+g
            // check if line is present
            let g1 = this.genenodes[g]
            let g2 = this.genenodes[gg]
            if (this.links[n1] || this.links[n2]) {
              // if it is, update x, y
              let l = this.links[n1] ? this.links[n1] : this.links[n2]
              l.clear()
              l.moveTo(g1.x, g1.y)
              l.lineTo(g2.x, g2.y)
            } else {
              // if not, make the line
              let l = new PIXI.Graphics()
              l.lineStyle(1, 0xFFFFFF)
              l.tint = 0x0000FF
              l.moveTo(g1.x, g1.y)
              l.lineTo(g2.x, g2.y)
              l.alpha = 0.4
              this.app_.stage.addChild(l)
              this.links[n1] = l
            }
          }
        }
      })
    },
    updateLinks () {
      this.genes.forEach( g => {
        if (!this.genedata[g])
          return
        else {
          this.mkLinks_(g)
        }
      })
    },
    mkLinks (generation) {
      let genes = this.generations[generation]
      genes.forEach( (g, i) => {
        let cc = this.genedata[g]
        cc.forEach( (c, j) => {
          if (c > this.limiar) {
            let gg = this.genes[j]
            let lnames = Object.keys(this.links)
            if (Object.keys(this.genenodes).includes(gg)) {
              let n1 = g+'-'+gg
              let n2 = gg+'-'+g
              // check if line is present
              let g1 = this.genenodes[g]
              let g2 = this.genenodes[gg]
              if (this.links[n1] || this.links[n2]) {
                // if it is, update x, y
                let l = this.links[n1] ? this.links[n1] : this.links[n2]
                l.clear()
                l.moveTo(g1.x, g1.y)
                l.lineTo(g2.x, g2.y)
              } else {
                // if not, make the line
                let line = new PIXI.Graphics()
                line.lineStyle(1, 0xFFFFFF)
                line.tint = 0x0000FF
                l.moveTo(g1.x, g1.y)
                l.lineTo(g2.x, g2.y)
                line.alpha = 0.4
                this.app_.stage.addChild(line)
                this.links[n1] = line
              }
            }
          }
        })
      })
    },
    getGeneData (gene) {
      let turl = process.env.flaskURL + '/geneData/'
      $.ajax(
        turl,
        {
          data: JSON.stringify({
            gene: gene
          }),
          contentType : 'application/json',
          type : 'POST',
        },
      ).done( data => {
        this.genedata[gene] = data
        this.updateLinks()
      })
    },
    getGenes () {
      let turl = process.env.flaskURL + '/genes/'
      $.ajax(
        turl,
        {
          data: JSON.stringify({
            banana: 'for you'
          }),
          contentType : 'application/json',
          type : 'POST',
        },
      ).done( genes => {
        this.genes = genes
      })
    },
    initPixi () {
      this.app_ = new PIXI.Application()
      document.getElementById('renderCanvas').appendChild(this.app_.view)
      this.cwidth_ = document.getElementsByTagName('canvas')[0].width
      this.cheight_ = document.getElementsByTagName('canvas')[0].height
      this.app_.stage.x = this.cwidth_ / 2
      this.app_.stage.y = this.cheight_ / 2
      this.cwidth =  0.9 * document.getElementsByTagName('canvas')[0].width
      this.cheight = 0.9 * document.getElementsByTagName('canvas')[0].height
      this.app_.renderer.backgroundColor = 0xFFFFFF
    },
  },
  mounted () {
    window.__this = this
    this.genedata = {}
    this.genenodes = {}
    this.generations = []
    this.links = {}
    this.initPixi()
    this.getGenes()
  }
}
</script>
