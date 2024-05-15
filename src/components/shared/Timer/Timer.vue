<template>
        <span class="timer">{{ parseTime }}</span>
</template>
  
<script setup lang="ts">
    import { defineEmits, ref, onMounted } from 'vue'

    const emit = defineEmits();



    const timeRest = ref<number>(10);
    const parseTime = ref<string>(`${Math.floor(10 / 60)}'${10 % 60}`)

    const playTime = () => {
        const timerInterval = setInterval(function() {
            if (timeRest.value <= 0) {
                clearInterval(timerInterval);
            } else {
                
                timeRest.value--;
                parseTime.value = `${Math.floor(timeRest.value / 60)}'${String(timeRest.value % 60).padStart(2, '0')}`;
            }
        }, 1000);
    }

    onMounted(() => {
        playTime()
    })

</script>
  
  <style scoped src="./style.scss">
  </style>
  