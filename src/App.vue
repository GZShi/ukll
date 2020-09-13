<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import Score from '@/components/Score.vue'

export default {
  name: 'App',
  components: {
    Score
  }
}
</script>


<style lang="less">
body {
  padding: 0;
  margin: 0;
}
</style>