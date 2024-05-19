
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
   
            </div>
            <div class="bord-kitchen"></div>
            <div class="plan-kitchen flex justify-space-between">
                <div class="pain" style="width: 16%; display: flex; justify-content: center;">
                    <div class="mr-1em" style="width: 50px;">
                        <OrangeJuice v-if="haveOrange" 
                        class="pointer"
                        @click="inMyHand = HotDogProductName.JUS_ORANGE ; setActive('orangeJuice')" 
                        ></OrangeJuice>
                    </div>

                    <div style="width: 50px;">
                        <Coca v-if="haveCoca" 
                        @click="inMyHand = HotDogProductName.COCA ; setActive('coca')"
                        class="align-self-end pointer" 
                        ></Coca>
                    </div>
                </div>
                <div class="assietes" style="width: 16%; display: flex; height: 100%; align-items: flex-end; flex-direction: column;">
                    <Assiette v-for="(assiete, index) in assietes" :key="index" 
                    class="" @click="setInMyHand(assiete.step,index)"></Assiette>
                </div>
                <div class="plaque" style="width: 32%; display: flex;">
                    <Plaque v-for="(poele, index) in poeles" :key="index"
                    @click="setInMyHand(poele.step,index, poele)"></Plaque>
                </div>

                <div class="frites" style="width: 16%;">
                    <div style=" display: flex; height: 80px">
                        <Frites v-for="index in haveFries" :key="index" 
                        class="pointer"
                        @click="inMyHand = HotDogProductName.FRITES ; setActive('frites', index)">
                        </Frites>
                    </div>
                    <div style="height: calc(100% - 80px); display: flex; align-items: center;">
                        <PlatSaucisse class="pointer" @click="addSausages()"></PlatSaucisse>
                    </div>
                 

                </div>
                <div style="width: 16%; ">
                    <Friteuse @click="cook(HotDogProductName.FRITES)"></Friteuse>
                </div>
                
            </div>
            <div class="bottom-kitchen flex align-center">
                <div class="container-trash" @click="putTrash(inMyHand, activeAssiette)">
                    <div class="top" style="">
                        <p>Poubelle</p>
                    </div>
                    <div class="bottom"></div>
                   
                </div>
                <div class="bottom-right">
                    <div style="height: 120px; display: flex; align-items: flex-end;">
                        <Pain @click="addPain()" class="pointer"></Pain>
                        <Cookie class="align-self-end" @click="inMyHand=HotDogProductName.COOKIE; setActive('cookie')"></Cookie>
                    </div>
                    <div class="etagere"></div>
                   
                </div>
            </div>
        </div>
    </div>
</template>
  
  <script setup lang="ts">
    import { ref, onMounted} from 'vue'
    import Timer from '../../shared/Timer/Timer.vue'
    import { Orders } from '../../../models/orders';
    import { getNewOrder } from '../../../components/shared/functions/defineOrders';
    import { ProductWithQuantity } from '../../../models/products';
    import {Poele} from '../../../models/poele';
    import { LevelType } from '../../../Enum/LevelType';
    import { HotDogProductName } from '../../../Enum/HotDogProductName';
    import {EnumPoele} from '../../../Enum/EnumPoele'
    import {updateVisibilityPoele, updateFries, updateDrinks, setActive, removeActive } from '../services/HotDogService'
    import MachineDrinks from '../Equipements/machine-drinks/MachineDrinks.vue'
    import OrangeJuice from '../food/orangeJuice/OrangeJuice.vue'
    import Coca from '../food/Coca/Coca.vue'
    import Cookie from '../food/Cookie/Cookie.vue'
    import Friteuse from '../Equipements/friteuse/Friteuse.vue'
    import Frites from '../food/Frites/Frites.vue'
    import Pain from '../food/Pain/Pain.vue'
    import Assiette from '../food/assiette/Assiette.vue';
    import Plaque from '../Equipements/plaques/plaques.vue'
    import PlatSaucisse from '../food/PlatSaucisses/PlatSaucisses.vue'

    const haveOrange = ref<boolean>(false);
    const haveCoca = ref<boolean>(false);
    const haveFries = ref<number>(0);
    const selectedOrder = ref<number>(-1);
    const inMyHand = ref<HotDogProductName | null>(null);
    const machineDrinksIsInUse = ref<boolean>(false);
    const machineFriesIsInUse = ref<boolean>(false);
    const assietes = ref<{step:typeAssiete}[]>([{step:'vide'},{step:'vide'}])
    const activeAssiette= ref<number|null>(null)
    const activePoele= ref<number|null>(null)
    const poeles = ref<Poele[]>([
        {step:EnumPoele.VIDE, interval:undefined},
        {step: EnumPoele.VIDE,  interval:undefined}
    ])
    const selectedSaussage = ref<EnumPoele | null>()

    type typeAssiete = null| 'vide' | HotDogProductName.PAIN_ASSIETTE | 
    HotDogProductName.HOT_DOG | HotDogProductName.HOT_DOG_KETCHUP| HotDogProductName.HOT_DOG_MAYONNAISE | HotDogProductName.HOT_DOG_MUSTARD
    | HotDogProductName.SAUSAGE | HotDogProductName.SAUSAGE_KETCHUP | HotDogProductName.SAUSAGE_MAYONNAISE | HotDogProductName.SAUSAGE_MUSTARD
    type typeDrinks = HotDogProductName.JUS_ORANGE | HotDogProductName.COCA
    const orders = ref<Orders[]>([
    ])

    const cook = (getAction:HotDogProductName) :void => {
        
        switch(getAction){
            case HotDogProductName.JUS_ORANGE:
            case HotDogProductName.COCA:
                makeDrinks(getAction, 4000)
                break;
            
            case HotDogProductName.FRITES:
                if(!machineFriesIsInUse.value && haveFries.value !== 3){
                    machineFriesIsInUse.value = true
                    updateFries();

                    setTimeout(function() {
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
                        case HotDogProductName.FRITES:
                        haveFries.value -= 1;
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
       cook(e)
    }

    const makeDrinks = (type : typeDrinks, time: number) => {
        if(!machineDrinksIsInUse.value){
                machineDrinksIsInUse.value = true;
                updateDrinks(type)
                setTimeout(function() {
                    haveOrange.value = type === HotDogProductName.JUS_ORANGE ? true : haveOrange.value;
                    haveCoca.value = type === HotDogProductName.COCA ? true : haveCoca.value
                    updateDrinks(type, true)
                    machineDrinksIsInUse.value = false;
                }, time)
        }
    }


    const addPain = () => {
        for (let i = 0; i < assietes.value.length; i++) {
            let pain = assietes.value[i];

            if(pain.step === 'vide'){
                pain.step = HotDogProductName.PAIN_ASSIETTE
                updateVisibilityAssiete(i, pain.step)
                break
            }
           
        }

        // if(stepAssiete1.value === 'vide'){
        //     stepAssiete1.value = HotDogProductName.PAIN_ASSIETTE
        //     updateVisibilityAssiete(0, stepAssiete1.value)
        //     return
        // }else if(stepAssiete2.value === 'vide'){
        //     stepAssiete2.value = HotDogProductName.PAIN_ASSIETTE
        //     updateVisibilityAssiete(1, stepAssiete1.value)
        // }
    }

    const addSausages = () => {

        for (let i = 0; i < poeles.value.length; i++) {
        const poele = poeles.value[i];
        if (poele.step === EnumPoele.VIDE) {
            cookSausages(poele, i, 3000);
            console.log('lala');
            break;
        }
    }
    }

    const cookSausages = (poele: Poele, index:number, secondes: number) => {
        poele.step = EnumPoele.CRU

        updateVisibilityPoele(index, poele.step)
            setInterval(()=>{
             poele.step = EnumPoele.CUITE

                updateVisibilityPoele(index, poele.step)
                poele.interval = setInterval(()=>{
                    poele.step = EnumPoele.CRAMEE
                    updateVisibilityPoele(index, poele.step)
                },secondes *2)
            },secondes)

    }

    const updateVisibilityAssiete = (numberAssiete: number, step: typeAssiete) =>{
        switch(step){
            case HotDogProductName.PAIN_ASSIETTE:
                const pain = document.querySelectorAll('#assiette-pain')[numberAssiete]
                pain.classList.remove('no-visible');
                break
            case HotDogProductName.HOT_DOG:
                const assiette = document.querySelectorAll('#assiette-saucisse')[numberAssiete!]
                assiette.classList.remove('no-visible')
            
        }
    }

    


    const setInMyHand = (object : typeAssiete | EnumPoele, activeAssieteOrPoele: number|null, poele?: Poele) => {
        if(poele){
            object = poele.step
        }
        if(object !== null || object !== 'vide' ){
            switch(object){
                case HotDogProductName.PAIN_ASSIETTE:
                    console.log('pain')
                    inMyHand.value = HotDogProductName.PAIN_ASSIETTE;
                    if(selectedSaussage.value && selectedSaussage.value === EnumPoele.CUITE){
                        inMyHand.value = HotDogProductName.HOT_DOG;
                        updateVisibilityAssiete(activeAssieteOrPoele!, inMyHand.value)
                        clearInterval(poeles.value[activePoele.value!].interval)
                        
                        console.log(activePoele.value )
                        if(activePoele.value !== null){
                            console.log('je vais me faire update')
                            poeles.value[activePoele.value].step = EnumPoele.VIDE
                            poeles.value[activePoele.value]={step: EnumPoele.VIDE, interval: clearInterval(poeles.value[activePoele.value].interval)}
                            console.log(poeles.value)
                            // console.log(poeles.value[activePoele.value])
                            // updateVisibilityPoele(activePoele.value, poeles.value[activePoele.value].step!)
                            // activePoele.value = null;
                        }
                      
                    }
                    activeAssiette.value = activeAssieteOrPoele;
                    setActive('assiette-container', activeAssieteOrPoele!+1)
                    break
                
                case EnumPoele.CUITE:
                    selectedSaussage.value = poele?.step
                    activePoele.value = activeAssieteOrPoele;
                    console.log(activePoele.value)
                    setActive('allSaucisse', activeAssieteOrPoele!+1)
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