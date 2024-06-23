
<template>
    <div>
        <div class="orders flex">
            <div style="width: 20%;"></div>
            <div style="width: 20%;" class="order">
                <Commandes v-if="listClients[0]" :client="listClients[0]" 
                @parti="handleLeft"
                @click="deleveryOrder()" ></Commandes>
            </div>
            <div style="width: 20%;" class="order">
                <Commandes  v-if="listClients[1]"
                :client="listClients[1]" 
                @parti="handleLeft"
                @click="deleveryOrder()" ></Commandes>
            </div>
            <div style="width: 20%;" class="order">
                <Commandes 
                v-if="listClients[2]"
                :client="listClients[2]" 
                @parti="handleLeft"
                @click="deleveryOrder()" ></Commandes>
            </div>
            <div style="width: 20%;" class="order">
                <Commandes :client="listClients[3]" 
                v-if="listClients[3]"
                @parti="handleLeft"
                @click="deleveryOrder()" ></Commandes>
            </div>
        </div>
        <Client :listClients="listClients"></Client>
        <div class="bord-kitchen"></div>
    </div>
  </template>
  
  <script setup lang="ts">
    import { ref, defineEmits, onMounted, reactive } from 'vue'
    import { ClientResto } from '../../../../models/clientResto';
    import Commandes from '../commandes/commandes.vue'
    import Client from '../client/client.vue'

    const emit = defineEmits();
    const listClients = reactive<ClientResto[]>([])
    let id : number = 0
    const selectedOrder = ref<number|null>(null)
    
    const createOrder = () : void => {
        const orderNull = listClients.findIndex((element:ClientResto)=> !element.order)
        listClients[orderNull].order =  listClients[orderNull].setOrder();
        listClients[orderNull].humeur = 5
        listClients[orderNull].design =  '../../../assets/client/client.svg'
    }

    const createEmptyClient = () => {
        for(let i=0; i< 4; i++){
            const client = new ClientResto(0, '../../../assets/client/client.svg', id);
            client.order = null;
            listClients.push(client);
            id += 1;
        }

    }

    const deleveryOrder = () : void =>{

    }

    const handleLeft = (ref:number): void =>{
        console.log('client parti')
        const indexClient = listClients.findIndex((element:ClientResto)=> element.id === ref)
        console.log(`id: ${ref} index:${indexClient}`)
        listClients[indexClient].design = null;
        listClients[indexClient].order = null;
        setTimeout(() => {createOrder()}, 10000)
    }

    onMounted(() => {

        for(let i=0; i< 4; i++){
            createEmptyClient()
            setTimeout(() => { createOrder()  }, 5000*(i+1))       
        }  
        }) 
  </script>
  
  <style scoped src="./style.scss">
  </style>
  