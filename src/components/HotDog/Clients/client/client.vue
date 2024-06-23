
<template>
    <div class="flex height-27vh">
      <div style="width: 20%; background-color: red;"></div>
      <div style="width: 20%; background-color: blue; position: relative; overflow: hidden;">
        <clientDesign :id="props.listClients[0].id" v-if="props.listClients[0] && props.listClients[0].order"></clientDesign>
      </div>
      <div style="width: 20%; background-color: blue; position: relative; overflow: hidden;">
        <clientDesign :id="props.listClients[1].id"
        v-if="props.listClients[1] && props.listClients[1].order"></clientDesign>
      </div>

      <div style="width: 20%; background-color: blue; position: relative; overflow: hidden;">
        <clientDesign :id="props.listClients[2].id" v-if="props.listClients[2] && props.listClients[2].order"></clientDesign>
      </div>

      <div style="width: 20%; background-color: blue; position: relative; overflow: hidden;">
        <clientDesign :id="props.listClients[3].id" v-if="props.listClients[3] && props.listClients[3].order"></clientDesign>
      </div>
       
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, defineEmits, defineProps, watch } from 'vue'
  import { ClientResto } from '../../../../models/clientResto';
  import clientDesign from '../clientDesign/clientDesign.vue';

  const emit = defineEmits();
  
  const props = defineProps<{
            listClients : ClientResto[],
        }>()

  </script>
  
  <style scoped src="./style.scss">
  </style>
  