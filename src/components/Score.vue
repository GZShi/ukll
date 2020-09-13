<template>
  <div class="score-container">
    <div class="control-panel">
      <select name="" id="" v-model="songName">
        <option v-for="(song,i) in list" :key="i" :value="song.name">{{i+1}}. {{song.name}}</option>
      </select>
      <input type="number" v-model="bpm" title="BPM"  placeholder="BPM" style="width: 60px;">
      <button @click="play()" v-if="playState=='stop'">play</button>
      <button @click="stop()" v-else>stop</button>
      <span v-if="countDown>0">{{countDown}}</span>
    </div>
    <div class="parts-container" ref="p" :style="{padding: `${padding}px`}">
      <div :style="{
        'text-align': 'left',
        'font-size': `${fontSize}px`,
        'padding': '1em 0'
      }" v-if="score">
        <div style="margin-bottom: .5em">{{score.meta.title}}</div>
        <div v-for="(info, i) in score.meta.infos"
          :key="i"
          style="font-size: 0.5em; margin-bottom: .5em; color: #555">{{info}}</div>
      </div>
      <div v-if="score">
        <Part
          ref="part"
          v-for="part in score.parts"
          :key="`${score.meta.title}-${part.index}`"
          :part="part"
          :section-start="part.index%4==0"
          :size="partSize"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Part from './Part'
import * as songs from './data/songs'
import {sleep} from './utils'

export default {
  components: {Part},
  data() {
    let list = songs.getList()
    return {
      list,
      songName: list[0].name,
      score: null,
      partSize: 200,
      padding: 10,
      fontSize: 20,
      resizeHandler: null,
      countDown: 0,
      bpm: 80,
      playState: 'stop'
    }
  },
  watch: {
    songName() {
      this.updateScore()
    }
  },
  mounted() {
    let paramIndex = parseInt(this.$route.params.index, 10) - 1
    let song = this.list[paramIndex] || this.list[0]
    this.songName = song.name

    this.updateScore()
    this.resize()

    this.resizeHandler = () => this.resize()
    window.addEventListener('resize', this.resizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler)
    this.resizeHandler = null
  },
  methods: {
    async playPre() {
      for (let i = 4; i >= 0; i--) {
        this.countDown = i
        if (i == 0) return
        await sleep(60*1000/this.bpm)
        if (this.playState != 'play') return
      }
    },
    async play() {
      this.playState = 'play'
      await this.playPre()
      if (this.playState != 'play') return
      let parts = this.$refs.part
      for (let i = 0; i < parts.length; i++) {
        let p = parts[i]
        p.show()
        await p.play(60*1000/this.bpm)
        if (this.playState != 'play') return
      }
    },
    stop() {
      this.playState = 'stop'
    },
    resize() {
      let style = getComputedStyle(this.$refs.p)
      let width = parseInt(style.width, 10)

      this.padding = width * 0.05
      this.partSize = (width -this.padding*2-10) / 4

      this.fontSize = this.partSize / 6
    },
    updateScore() {
      this.score = songs.getScoreByName(this.songName)
      this.resize()
    }
  }
}
</script>

<style lang="less" scoped>
.score-container {
  margin: 0 auto;

  .control-panel {
    position: sticky;
    top: 0;
    background-color: rgba(22,22,22,.6);
    padding: 1em 0;
    z-index: 999;
    text-align: center;
  }

  .parts-container {
    width: 80vw;
    max-width: 1200px;
    margin: 40px auto;
    box-shadow: 0 0 1px #666, 0 2px 5px rgba(22,22,22,.43);
    box-sizing: border-box;
    text-align: center;
  }
}
</style>