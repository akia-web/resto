import { Orders } from './orders';
import { LevelType } from '../Enum/LevelType';
import {getNewOrder} from '../components/shared/functions/defineOrders'

export class ClientResto {

    humeur:number|null;
    order: Orders | null = this.setOrder();
    design: string | null;
    timeRest : number | undefined;
    id:number;

    constructor(humeur:number, design: string, id:number ){
        this.humeur = humeur;
        this.design = design;
        this.id = id;
    }

    setOrder(){
        return {
            status: false,
            products: getNewOrder(LevelType.NORMAL, 1),
            id: 1
        }
    }

    removeHeart(){
        this.timeRest =  setInterval(() => {
            if(this.humeur && this.humeur>0){
               this.humeur -= 1
                if( this.humeur === 0){        
                }
            }else{       
            }
        }, 10000)
    }
}