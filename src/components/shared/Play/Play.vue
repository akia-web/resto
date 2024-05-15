<template>
  <button class="button-play" @click="playGame()">
    play
  </button>
</template>

<script setup lang="ts">
    import { defineEmits } from 'vue'

    const emit = defineEmits();

    const playGame = ():void => {
        emit('play');
    }
</script>

<style scoped src="./style.scss">
</style>
