<template>
    <div> 
        <Resto v-if="step==='resto'" @play="handlePlay"></Resto>
        <Level v-if="step==='level'"></Level>
    </div>
  </template>
  
  <script setup lang="ts">
    import { ref } from 'vue'
    import Resto from '../Resto/RestoHotDog.vue'
    import Level from '../Level/LevelHotDog.vue'
    const step = ref<string>('resto')

    const handlePlay = () => {
        step.value = 'level'
    }
  
  </script>
  
  