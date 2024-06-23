
<template>
    <div class="height-100vh">
        <div class="header-level">
            <p class="mb-1em text-center"> Niveau 1</p>
            <Timer></Timer>
            <p>Argent : {{ money }}</p>
        </div>


        <ListClient></ListClient>

        <div class="kitchen">            
            <div class="plan-kitchen flex justify-space-between">
                <div style="width: 20%; background-color: red;">
                    <MachineDrinks @message="handleMachine($event)" style="margin-top: -250px;"></MachineDrinks>
                    <div class="flex width-100 justify-center" style="background-color: blueviolet">
                        <OrangeJuice v-if="haveOrange" 
                        class="pointer mr-1em"
                        @click="inMyHand = HotDogProductName.JUS_ORANGE ; setActive('orangeJuice')" 
                        ></OrangeJuice>

                        <Coca v-if="haveCoca" 
                        @click="inMyHand = HotDogProductName.COCA ; setActive('coca')"
                        class="align-self-end pointer" 
                        ></Coca>
                    </div>
                    
                </div>
                <div class="assietes" style="width: 16%; display: flex; height: 100%; align-items: flex-end; flex-direction: column;">
                    <Assiette v-for="(assiete, index) in assietes" :key="index" 
                    class="" @click="preparePlate(assiete)"></Assiette>
                </div>
                <div class="plaque" style="width: 32%; display: flex;">
                    <Plaque v-for="(poele, index) in poeles" :key="index"
                    @click="preparePlate(undefined, poele)"></Plaque>
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
                    <Friteuse @click="cookingSideDishes(HotDogProductName.FRITES)"></Friteuse>
                </div>
                
            </div>
            <div class="bottom-kitchen flex align-center">
                <div class="container-trash" @click="putTrash()">
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
    import { ref, onMounted, reactive, watch} from 'vue'
    import Timer from '../../shared/Timer/Timer.vue'
    import { Orders } from '../../../models/orders';
    import { ProductWithQuantity } from '../../../models/products';
    import {Poele} from '../../../models/poele';
    import { HotDogProductName } from '../../../Enum/HotDogProductName';
    import {EnumPoele} from '../../../Enum/EnumPoele'
    import {Plate} from '../../../models/plate';
    import {updateVisibilityPoele, updateFries, updateDrinks, setActive, removeActive, inMyHandIsDishes, removeDishesInPlate } from '../services/HotDogService'
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
    import {ClientResto} from '../../../models/clientResto';

    import ListClient from '../Clients/listClient/listClient.vue';

    const money = ref<number>(0);
    const idOrder = ref<number>(1)
    const haveOrange = ref<boolean>(false);
    const haveCoca = ref<boolean>(false);
    const haveFries = ref<number>(0);
    const selectedOrder = ref<number>(-1);
    const inMyHand = ref<HotDogProductName | null | Poele | Plate>(null);
    const machineDrinksIsInUse = ref<boolean>(false);
    const machineFriesIsInUse = ref<boolean>(false);
    const assietes = reactive<Plate[]>(
        [
            { 
                active: false,
                main: false,
                accompanying: false,
                trim: false
            },
            { 
                active: false,
                main: false,
                accompanying: false,
                trim: false
            },
        ]
    )
        
    const poeles = reactive<Poele[]>([
        {step:EnumPoele.VIDE, interval:undefined, active:false},
        {step: EnumPoele.VIDE,  interval:undefined, active:false}
    ])

    type typeDrinks = HotDogProductName.JUS_ORANGE | HotDogProductName.COCA
    let orders = reactive<Orders[]>([])

    const cookingSideDishes = (getAction:HotDogProductName) :void => {
        
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
            const updatedProducts: ProductWithQuantity[] = orders[selectedOrder.value].products.filter((product: ProductWithQuantity) => {
                let item : any;

                if(typeof inMyHand.value ==='object' &&  'main' in inMyHand.value!){
                    if(inMyHand.value.main && !inMyHand.value.accompanying){
                        item = HotDogProductName.SAUSAGE
                    }else if(inMyHand.value.main && inMyHand.value.accompanying){
                        item = HotDogProductName.HOT_DOG
                    }
                  
                }else{
                    item = inMyHand.value
                }

                if (product.labelName === item) {
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

                    if(inMyHandIsDishes(inMyHand.value)){
                        const assieteActive: number = assietes.findIndex((assiete: Plate)=> assiete.active === true)
                        assietes[assieteActive].main = false;
                        assietes[assieteActive].accompanying = false;
                        assietes[assieteActive].trim = false;
                        assietes[assieteActive].active = false;
                        removeDishesInPlate(assieteActive)
                      
                    }

                    inMyHand.value = null;
                    const deleteOrder =  product.quantity > 0 ? true : false

                    if(!deleteOrder){
                        money.value += product.price
                        createOrder()
                    }
                    return deleteOrder
                }else{
                    return true
                }

                });

            orders[selectedOrder.value].products = updatedProducts;
            if(orders[selectedOrder.value].products.length === 0){
                clearTimeout(orders[selectedOrder.value].interval)
                orders.splice(selectedOrder.value,1)
            }

        }
        selectedOrder.value = -1
    }

    const handleMachine = (e: HotDogProductName) => {
       cookingSideDishes(e)
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
        for (let i = 0; i < assietes.length; i++) {
            let assiete = assietes[i];

            if(!assiete.accompanying){
                assiete.accompanying = true
                updateVisibilityAssiete(assiete)
                break
            }
           
        }
    }

    const addSausages = () => {

        for (let i = 0; i < poeles.length; i++) {
        const poele = poeles[i];
        if (poele.step === EnumPoele.VIDE) {
            cookSausages(poele, i, 3000);
            break;
        }
    }
    }

    const cookSausages = (poele: Poele, index:number, secondes: number) => {
        poele.step = EnumPoele.CRU

        updateVisibilityPoele(index, poele.step)
        poele.interval = setTimeout(()=>{
            poele.step = EnumPoele.CUITE
            updateVisibilityPoele(index, poele.step)
            clearTimeout(poele.interval)
            poele.interval = setTimeout(()=>{
                poele.step = EnumPoele.CRAMEE
                updateVisibilityPoele(index, poele.step)
            },secondes *2)
        },secondes)

    }

    const updateVisibilityAssiete = (assiete : Plate) =>{
        const numberAssiete =  assietes.findIndex((item : Plate) => item === assiete)
        const pain = document.querySelectorAll('#assiette-pain')[numberAssiete]
        const assiette = document.querySelectorAll('#assiette-saucisse')[numberAssiete!]
        const sausage = document.querySelectorAll('#assiette-saucisse-no-pain')[numberAssiete!]

        if(!assiete.main && !assiete.accompanying && !assiete.trim){
            pain.classList.add('no-visible')
            assiette.classList.add('no-visible')
            sausage.classList.add('no-visible')
        }

        if(assiete.main && !assiete.accompanying){
            sausage.classList.remove('no-visible') 
        }

        if(assiete.main && assiete.accompanying){
            sausage.classList.add('no-visible')
            assiette.classList.remove('no-visible')
        }

        if(assiete.accompanying){
            pain.classList.remove('no-visible')
        }
    }

    const preparePlate = (plate? : Plate, poele?:Poele) =>{

        if(poele){
            setAllPoelesInactives();
            poele.active = true
            const indexActivePoele = poeles.findIndex((item : Poele) => item === poele)

            if(poele.step === EnumPoele.CUITE){
                setActive('allSaucisse',indexActivePoele)
            }

            if(poele.step === EnumPoele.CRAMEE){
                inMyHand.value = poele
                clearTimeout(poeles[indexActivePoele].interval) 
                setActive('allSaucisse',indexActivePoele)
            }
        }

        const indexActivePoele:number = poeles.findIndex((item : Poele) => item.active === true)
       
        if(plate){
            
            setAllPlateInactive();
            plate.active = true;
            const indexActivePlate = getActivePlateIndex()

             //si saucisse cuite active
            if(indexActivePoele > -1  && poeles[indexActivePoele].step === EnumPoele.CUITE){
                clearTimeout(poeles[indexActivePoele].interval);
                plate.main = true;
                poeles[indexActivePoele].active = false;
                poeles[indexActivePoele].step = EnumPoele.VIDE
                updateVisibilityPoele(indexActivePoele, poeles[indexActivePoele].step);
                updateVisibilityAssiete(plate);
            }

            //si saucisse cramée active mais clic sur une assiete de pain
            if(indexActivePoele > -1  && poeles[indexActivePoele].step === EnumPoele.CRAMEE && plate.accompanying){
                inMyHand.value = plate;
                setActive('assiette-container', indexActivePlate)
            }

            // Si pas de poeles actives et assiete selectionnée
            if(indexActivePoele === -1){
                inMyHand.value = plate;
                setActive('assiette-container', indexActivePlate)
            }
        }
    }

    const putTrash = () =>{
        if( inMyHand.value && inMyHandIsDishes(inMyHand.value)){
            if(typeof inMyHand.value ==='object' &&  'main' in inMyHand.value){
                const activePlate: number = getActivePlateIndex()
                removeDishesInPlate(activePlate)
                assietes[activePlate].accompanying = false;
                assietes[activePlate].main = false;
                assietes[activePlate].trim = false;
                assietes[activePlate].active = false;
            }else{
                const activePoele:number = getActivePoeleIndex();
                console.log(activePoele)
                poeles[activePoele].step = EnumPoele.VIDE
                updateVisibilityPoele(activePoele, poeles[activePoele].step);
                poeles[activePoele].active = false;
               
            }
         
            removeActive()
           
            inMyHand.value = null;  
        }
    
    }

   const setAllPlateInactive = () =>{
    assietes.map((element: Plate) =>{
        element.active = false;
    })
   }

   const getActivePlateIndex = () :number =>{
       return assietes.findIndex((item:Plate)=> item.active === true)
   }

   const getActivePoeleIndex = () :number =>{
       return poeles.findIndex((item:Poele)=> item.active === true)
   }

   const setAllPoelesInactives = () => {
    poeles.map((element: Poele) =>{
        element.active = false;
    })
   }
  

  </script>
  
  <style scoped src="./style.scss">
  </style>