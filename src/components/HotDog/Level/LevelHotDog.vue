
<template>
    <div class="height-100vh pt-1em">
        <div class="header-level">
            <p class="mb-1em text-center"> Niveau 1</p>
            <Timer></Timer>
        </div>


        <div class="orders">
            <div class="order" v-for="(order, index) in orders" :key="index"
            @click="selectedOrder=index; deleveryOrder()" >
                <div v-for="(item, index2) in order.products" :key="index2">
                    <p>{{ item.name }} x {{ item.quantity }}</p>
                </div>
            </div>
        </div>

        <div class="kitchen">

            <div class="top-kitchen flex">
                <MachineDrinks @message="handleMachine($event)"></MachineDrinks>

                <div class="width-50px height-85px align-self-end mr-1em">
                    <OrangeJuice v-if="haveOrange" 
                    class="pointer"
                    @click="inMyHand = HotDogProductName.JUS_ORANGE ; setActive('orangeJuice')" 
                    ></OrangeJuice>
                </div>

                <div class="width-50px height-85px align-self-end">
                    <Coca v-if="haveCoca" 
                    @click="inMyHand = HotDogProductName.COCA ; setActive('coca')"
                    class="align-self-end pointer" 
                    ></Coca>
                </div>
                <Cookie class="align-self-end" @click="inMyHand=HotDogProductName.COOKIE; setActive('cookie')"></Cookie>
            </div>
            <div class="bord-kitchen"></div>
            <div class="plan-kitchen flex justify-space-between">
                <div class="pain" style="width: 16%;">
                    <Pain @click="addPain()"></Pain>
                </div>
                <div class="assietes" style="width: 16%; display: flex; height: 100%; align-items: flex-end; flex-direction: column;">
                    <Assiette class="mt-2em" @click="setInMyHand(stepAssiete1,0)"></Assiette>
                    <Assiette @click="setInMyHand(stepAssiete2,1)"></Assiette>
                </div>
                <div class="plaque" style="width: 32%; display: flex;">
                    <Plaque></Plaque>
                    <Plaque></Plaque>
                </div>
                <div class="frites" style="width: 16%; display: flex;">
                <Frites v-for="index in haveFries" :key="index" 
                    class="pointer"
                    @click="inMyHand = HotDogProductName.FRITES ; setActive('frites', index)">
            </Frites>
                </div>
                <div style="width: 16%; ">
                    <Friteuse @click="useEquipement(HotDogProductName.FRITES)"></Friteuse>
                </div>
                
            </div>
            <div class="bottom-kitchen flex align-center">
                <div class="container-trash" @click="putTrash(inMyHand, activeAssiette)">
                    <img src="../../../assets/HotDog/poubelle.svg" alt="">
                </div>
                <div class="container-ice-cream"></div>
            </div>
        </div>
    </div>
</template>
  
  <script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import Timer from '../../shared/Timer/Timer.vue'
    import { Orders } from '../../../models/orders';
    import { getNewOrder } from '../../../components/shared/functions/defineOrders';
    import { ProductWithQuantity } from '../../../models/products';
    import { LevelType } from '../../../Enum/LevelType';
    import { HotDogProductName } from '../../../Enum/HotDogProductName';
    import MachineDrinks from '../Equipements/machine-drinks/MachineDrinks.vue'
    import OrangeJuice from '../food/orangeJuice/OrangeJuice.vue'
    import Coca from '../food/Coca/Coca.vue'
    import Cookie from '../food/Cookie/Cookie.vue'
    import Friteuse from '../Equipements/friteuse/Friteuse.vue'
    import Frites from '../food/Frites/Frites.vue'
    import Pain from '../food/Pain/Pain.vue'
    import Assiette from '../food/assiette/Assiette.vue';
    import Plaque from '../Equipements/plaques/plaques.vue'

    const haveOrange = ref<boolean>(false);
    const haveCoca = ref<boolean>(false);
    const haveFries = ref<number>(0);
    const selectedOrder = ref<number>(-1);
    const inMyHand = ref<HotDogProductName | null>(null);
    const machineDrinksIsInUse = ref<boolean>(false);
    const machineFriesIsInUse = ref<boolean>(false);
    const stepAssiete1= ref<typeAssiete>('vide')
    const stepAssiete2 = ref<typeAssiete>('vide')
    const activeAssiette= ref<number|null>(null)

    type typeAssiete = 'vide' | 'pain' | 'saucice' | 'mayonnaise' | 'ketchup' | 'moutarde' | null
    const orders = ref<Orders[]>([
    ])

    const useEquipement = (getAction:HotDogProductName) => {
        switch(getAction){
            case HotDogProductName.JUS_ORANGE:
                if(!machineDrinksIsInUse.value){
                    machineDrinksIsInUse.value = true;
                    updateVerre('orange')
                    const timeOutOrange = setTimeout(function() {
                        haveOrange.value = true;
                        removeUpdate('orange')
                        machineDrinksIsInUse.value = false;
                    }, 4000)
                }
                break
            case HotDogProductName.COCA:
                if(!machineDrinksIsInUse.value){
                    machineDrinksIsInUse.value = true;
                    updateVerre('coca')
                    const timeOutCoca = setTimeout(function() {
                        haveCoca.value = true;
                        removeUpdate('coca')
                        machineDrinksIsInUse.value = false;
                    }, 4000);
                }
                break
            
            case HotDogProductName.FRITES:
                if(!machineFriesIsInUse.value && haveFries.value !== 3){
                    machineFriesIsInUse.value = true
                    updateFries();
                    const timeOutFries = setTimeout(function() {
                        haveFries.value = 3
                        updateFries();
                        machineFriesIsInUse.value = false;
                    }, 4000);
                }
        }
    }

    const deleveryOrder = () => {
        
        if(inMyHand.value && selectedOrder.value>=0){
            const updatedProducts: ProductWithQuantity[] = orders.value[selectedOrder.value].products.filter((product: ProductWithQuantity) => {

                if (product.labelName === inMyHand.value) {
                    const active = document.querySelectorAll('.active-food')
                        active.forEach(element => {
                            element.classList.remove('active-food')
                        });

                    if(product.quantity>0){
                        product.quantity--;
                    }

                    switch(inMyHand.value){
                        case HotDogProductName.COCA:
                            haveCoca.value = false;
                            break
                        case HotDogProductName.JUS_ORANGE:
                            haveOrange.value = false;
                            break
                    }
                    inMyHand.value = null;
                    return product.quantity > 0 ? true : false
                }else{
                    return true
                }

                });

            orders.value[selectedOrder.value].products = updatedProducts;
            if(orders.value[selectedOrder.value].products.length === 0){
                orders.value.splice(selectedOrder.value,1)
            }

        }
        selectedOrder.value = -1
    }

    const handleMachine = (e: HotDogProductName) => {
       useEquipement(e)
    }

    const updateVerre = (boisson: string) => {
        const verre = document.getElementById('objet-verre')
        const ellipse = document.getElementById('couleur-liquide-elipse')
        const liquide = document.getElementById('couleur-liquide')
        verre?.classList.add('active-verre')
        ellipse?.classList.add(`ellipse-liquide-${boisson}`)
        liquide?.classList.add(`liquide-${boisson}`)
    }

    const removeUpdate = (boisson: string) => {
        const verre = document.getElementById('objet-verre')
        const ellipse = document.getElementById('couleur-liquide-elipse')
        const liquide = document.getElementById('couleur-liquide')
        liquide?.classList.remove(`liquide-${boisson}`)
        ellipse?.classList.remove(`ellipse-liquide-${boisson}`)
        verre?.classList.remove('active-verre')
    }

    const updateFries = () => {
        const fries = document.getElementById('fritesMachine')

        if(fries?.classList.contains('no-visible')){
            fries?.classList.remove('no-visible');
            return;
        }else{
            fries?.classList.add('no-visible');
        }
        
    }

    const setActive = (id: string, index: null| number = null) => {
        removeActive()
        if(index){
            const article = document.querySelectorAll('#'+id);
            article[index-1].classList.add('active-food')


        }else{
            const food = document.getElementById(id);
            if(food){
                food.classList.add('active-food');
            }
        }
    }

    const removeActive = () => {
        const active = document.querySelectorAll('.active-food')
        active.forEach(element => {
            element.classList.remove('active-food')
        });
    }

    const addPain = () => {
        if(stepAssiete1.value === 'vide'){
            stepAssiete1.value = 'pain'
            updateVisibilityAssiete(0, stepAssiete1.value)
            return
        }else if(stepAssiete2.value === 'vide'){
            stepAssiete2.value = 'pain'
            updateVisibilityAssiete(1, stepAssiete1.value)
        }
    }

    const updateVisibilityAssiete = (numberAssiete: number, step: typeAssiete) =>{
        switch(step){
            case 'pain':
                const pain = document.querySelectorAll('#assiette-pain')[numberAssiete]
                pain.classList.remove('no-visible');
                break
        }
    }

    const setInMyHand = (object : typeAssiete, activeAssieteOrPoele: number|null) => {
        if(object !== null || object !== 'vide' ){
            switch(object){
                case 'pain':
                    inMyHand.value = HotDogProductName.PAIN_ASSIETTE;
                    activeAssiette.value = activeAssieteOrPoele;
                    setActive('assiette-container', activeAssieteOrPoele!+1)
                    break
            }
        }
    }



    const putTrash = (hand:  HotDogProductName | null, index: number|null) =>{
        if(
            (hand === HotDogProductName.PAIN_ASSIETTE || hand === HotDogProductName.SAUCISSE_POELE) 
            && index !== null){

                switch(hand){
                    case HotDogProductName.PAIN_ASSIETTE || HotDogProductName.HOT_DOG || HotDogProductName.HOT_DOG_KETCHUP
                    ||HotDogProductName.HOT_DOG_MAYONNAISE || HotDogProductName.HOT_DOG_MUSTARD:
                        const pain = document.querySelectorAll('#assiette-pain')[index]
                        const saucisse =  document.querySelectorAll('#assiette-saucisse')[index]
                        const sauce =  document.querySelectorAll('#assiette-sauce')[index]
                        pain.classList.add('no-visible');
                        saucisse.classList.add('no-visible');
                        sauce.classList.add('no-visible');
                        removeActive()
                        stepAssiete1.value = index === 0? 'vide' : stepAssiete1.value
                        stepAssiete2.value = index === 1? 'vide' : stepAssiete2.value
                        console.log(stepAssiete1.value)
                        console.log(stepAssiete1.value)
                        break
                }
             
                inMyHand.value = null;
                activeAssiette.value = null;
            }
            


    }
    onMounted(() => {
     const interval = setInterval(() => {
        if(orders.value.length <4){
            orders.value.push({
            status: false,
            products: getNewOrder(LevelType.NORMAL, 1)
        })
        }else{
            clearInterval(interval)
        }

    }, 4000);
    })

 
    

  </script>
  
  <style scoped src="./style.scss">
  </style>