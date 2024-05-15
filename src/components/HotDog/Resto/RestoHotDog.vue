

<template>
  <div class="height-100vh">
    <div class="header"></div>
    <div class="main">
      <Play @play="handlePlay"></Play>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import Play from '../../shared/Play/Play.vue'

const emit = defineEmits();

const handlePlay = () => {
  emit('play');
}

</script>

<style scoped src="./style.scss">
</style>
