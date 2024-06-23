<template>
    <div>  
        <div class="flex">
            <p v-for="index2 in props.client.humeur" :key="index2">♥</p>
        </div>
        <div v-for="(product, index2) in client.order?.products" :key="index2">
            <p>{{ product.name }} x {{ product.quantity }}</p>
        </div>
    </div>
  </template>
  
  <script setup lang="ts">
    import { ref, defineEmits, defineProps, watch, onMounted } from 'vue'
    import { ClientResto } from '../../../../models/clientResto';
  
    const  clientImage  = ref<HTMLElement|null>(null);
    const sourir = ref<HTMLElement|null>(null);
    const content = ref<HTMLElement|null>(null);
    const neutre = ref<HTMLElement|null>(null);
    const triste = ref<HTMLElement|null>(null);
    const colere = ref<HTMLElement|null>(null);

    const emit = defineEmits();

    const props = defineProps<{
            client : ClientResto,
    }>()

  

    const resetData = () => {
        console.log(`client ${props.client.id} cree`)
        props.client.removeHeart()
        clientImage.value =  document.getElementById('client-'+props.client.id)
        if(clientImage.value){
            sourir.value = clientImage.value.querySelector('#sourir')
            content.value = clientImage.value.querySelector('#content')
            neutre.value =  clientImage.value.querySelector('#neutre')
            triste.value = clientImage.value.querySelector('#triste')
            colere.value = clientImage.value.querySelector('#colere')
            if(sourir.value && content.value && neutre.value && triste.value && colere.value){
                sourir.value.classList.remove('no-visible');
                content.value.classList.add('no-visible');
                neutre.value.classList.add('no-visible');
                triste.value.classList.add('no-visible');
                colere.value.classList.add('no-visible');
            }
          
        }

    }

    const changeEmotion = (elementToRemove : HTMLElement, elementToAdd: HTMLElement) =>{
        elementToRemove.classList.add('no-visible');
        elementToAdd.classList.remove('no-visible');
    }

    watch(() => props.client.order, (newValue:number, oldValue:number) => {
        if(!oldValue && newValue){
            resetData();
        }
    })

    
    watch(() => props.client.humeur, (newValue:number, oldValue:number) => {
        if(sourir.value && content.value && neutre.value && triste.value && colere.value){
             
            switch(newValue){

                case 4:
                    changeEmotion(sourir.value, content.value);
                    break;
                case 3:
                    changeEmotion(content.value, neutre.value);
                    break;
                case 2:
                    changeEmotion(neutre.value, triste.value);
                    break;
                case 1:
                    changeEmotion(triste.value, colere.value);
                    break;
                case 0:
                    clearInterval(props.client.timeRest)
                    emit('parti', props.client.id);
            }
        }
    });

  
  </script>
  
  <style scoped src="./style.scss">
  </style>
  