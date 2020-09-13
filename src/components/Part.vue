<template>
  <div class="part-container" :style="{
    'padding-top': `${size/5}px`
  }">
    <div class="anchor" ref="anchor"></div>
    <Beat
      v-for="(beat, bi) in part.beats"
      :key="bi"
      :active="bi == activeIndex"
      :notes="beat.notes"
      :section-start="sectionStart"
      :part-start="bi == 0"
      :part-index="part.index"
      :part-end="bi == part.beats.length - 1"
      :size="size/4"
    />
  </div>
</template>

<script>
import Beat from './Beat'
import {sleep} from './utils'

export default {
  components: {Beat},
  props: ['part', 'section-start', 'size'],
  data() {
    return {
      activeIndex: -1
    }
  },
  methods: {
    async play(tick) {
      this.activeIndex = -1
      for (let i = 0; i < this.part.beats.length; i++) {
        this.activeIndex = i
        await sleep(tick)
      }
      this.activeIndex = -1
    },
    show() {
      this.$refs.anchor.scrollIntoView({behavior: 'smooth'})
    }
  }
}
</script>

<style lang="less" scoped>
.part-container {
  display: inline-block;
  position: relative;
  .anchor {
    // width: 3px;
    // height: 3px;
    background-color: gray;
    position: absolute;
    top: -40px;
  }
}
</style>