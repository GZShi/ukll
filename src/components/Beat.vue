<template>
  <svg :class="{active: active}"
    xshape-rendering="optimizeSpeed"
    :viewBox="`0 0 ${width*dpr} ${height*dpr}`"
    :style="{
    width: `${width}px`,
    height: `${height}px`
  }">
    <g ref="root" transform="translate(0,10.5)">
      <g ref="sep" stroke="#888" />
      <g ref="line" stroke="#888" stroke-width="1px" />
      <g ref="note" />
    </g>
  </svg>
</template>

<script>
import * as d3 from 'd3'
import {arpeggio} from './svgSymbols'

export default {
  props: ['active', 'notes', 'partEnd', 'partStart', 'partIndex', 'sectionStart', 'size'],
  data() {
    return {
      dpr: 1,//devicePixelRatio || 1,
      width: 1,
      height: 1*1.2,
      strings: [0, 1, 2, 3],
      y: null,
      noteRadius: 0,
      fontSize: 0,
      margin: 1*0.06,
    }
  },
  watch: {
    size() {
      this.resize()
    }
  },
  mounted() {
    this.resize()
  },
  methods: {
    resize() {
      let size = this.size
      this.width = size
      this.height = size * 1.8
      this.margin = Math.max(this.width, this.height) * 0.06
      this.y = d3.scaleBand().domain(this.strings).rangeRound([this.margin, this.height-this.margin])
      this.noteRadius = 0.8*this.y.bandwidth()/2
      this.fontSize = 0.8*this.noteRadius*2

      // clean
      let sep = d3.select(this.$refs.sep)
      sep.selectAll('*').remove()

      // start
      if (this.partStart) {
        sep.append('text')
          .attr('dy', this.fontSize/2-2)
          .attr('font-size', this.fontSize)
          .text(this.partIndex + 1)
          .attr('stroke', 'none')
          .attr('fill', '#777')
      }
      if (this.sectionStart && this.partStart) {
        sep.append('line')
          .attr('x1', 0).attr('x2', 0)
          .attr('y1', this.y(0)).attr('y2', this.y(3))
          .attr('stroke', '#444')
          .attr('stroke-width', 3)
          .attr('transform', `translate(1.5, 0)`)
      }
      // end
      sep.append('line')
        .attr('x1', this.width).attr('x2', this.width)
        .attr('y1', this.y(0)).attr('y2', this.y(3))
        .attr('stroke', this.partEnd ? '#444' : '#ddd')
        .attr('stroke-width', this.partEnd ? 1 : 1)
        .attr('transform', `translate(-.5, 0)`)
      
      this.drawStrings()
      this.drawNotes()
    },
    drawStrings() {
      let g = d3.select(this.$refs.line)
      g.selectAll('*').remove()
      g.selectAll('line').data(this.strings)
        .enter().append('line')
        .attr('x1', 0).attr('x2', this.width)
        .attr('y1', d => this.y(d))
        .attr('y2', d => this.y(d))
    },
    drawNotes() {
      let vm = this
      if (!this.notes) return
      let g = d3.select(this.$refs.note)
      g.selectAll('*').remove()
      let x = d3.scaleBand().domain(this.notes.map(d => d.index)).range([this.margin, this.width-this.margin])
      g.selectAll('g.note').data(this.notes || [])
        .enter()
        .append('g').attr('class', 'note')
        .attr('transform', d => `translate(${x(d.index) + x.bandwidth()/2},0)`)
        .each(function (note) {
          if (!note || !note.press || !note.play) return
          let ng = d3.select(this)
          let leftHands = (note.press.strings || []).map((d, index) => {
            if (d === null || isNaN(d)) return null
            return {index, fret: d, finger: ''}
          }).filter(d => d)

          let finger = ng.selectAll('g.finger').data(leftHands)
            .enter().append('g').attr('class', 'finger')
            .attr('transform', d => `translate(0, ${vm.y(d.index)})`)
            .each(function (d) {
              let fing = d3.select(this)
              fing.append('circle')
                .attr('cx', 0)
                .attr('cy', 0)
                .attr('r', vm.noteRadius)
                .attr('fill', '#eee')
              fing.append('text')
                .text(d.fret)
                .attr('font-size', vm.fontSize)
                .attr('dx', 0)
                .attr('dy', vm.noteRadius/2)
                .attr('text-anchor', 'middle')
            })
          
          // 琶音箭头标记
          if (note.play.type === 'arpeggio') {
            let arpg = ng.append('g').attr('class', 'arpeggio')
              .attr('transform', `translate(${-vm.y.bandwidth()-vm.noteRadius/2},${-vm.y.bandwidth()/2})`)
            arpg.selectAll('path').data(leftHands)
              .enter().append('path')
              .attr('d', arpeggio(vm.y.bandwidth()))
              .attr('transform', d => `translate(0, ${vm.y(d.index)})`)
              .attr('fill', '#333')
          }
        })
    },
  }
}
</script>

<style lang="less" scoped>
svg {
  display: inline-block;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
svg.active {
  background-color: #ddd;
}
</style>