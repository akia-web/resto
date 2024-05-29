import { HotDogProductName } from "../../../Enum/HotDogProductName";
import { LevelType } from "../../../Enum/LevelType";
import {Product, ProductWithQuantity } from "../../../models/products";
import { allDishesHotDog, allDrinksHotDog, allSnacksHotDog } from "../../HotDog/Config/allPlats";

export const getNewOrder = (niveau: LevelType, level: number): ProductWithQuantity[] => {
    let maxItem: number;
    const products: ProductWithQuantity[] = []

    if(level >= 1 && level <= 9 ){
        maxItem = 1;
    }else if(level >= 10 && level <= 20){
        maxItem = 2;
    } else{
        maxItem = 3;
    }

    for(let i : number = 0; i<maxItem; i++){
       if(niveau === LevelType.NORMAL){
        const randomNumber = getRandomNumber(0, 100);
        if(randomNumber >= 0 && randomNumber <34){
            //plats
          
            const plats = getListPlats(level); 
            const randomOrder = getRandomNumber(0, plats.length-1)
            let item : ProductWithQuantity = {
                ...plats[randomOrder],
                price: getPriceForItem(plats[randomOrder]),
                quantity:1,
            }
            products.push(item);

        }else if(randomNumber >= 35 && randomNumber <66){
            // boisson 
            const boissons = allDrinksHotDog;
            const randomBoisson = getRandomNumber(0, boissons.length-1)
            let item : ProductWithQuantity = {
                ...boissons[randomBoisson],
                price: getPriceForItem(boissons[randomBoisson]),
                quantity:1,
            }
            products.push(item);

        }else{
            //snack
            const snacks = allSnacksHotDog;
            const randomSnack = getRandomNumber(0, snacks.length-1);
            let item : ProductWithQuantity = {
                ...snacks[randomSnack],
                quantity:1,
                price: getPriceForItem(snacks[randomSnack])
            }
            products.push(item);
        }
       }
    }
    return products;
}


export const getRandomNumber = (min: number, max: number) :number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getPriceForItem = (plat : Product) => {
    switch(plat.labelName){
        case HotDogProductName.COCA:
        case HotDogProductName.JUS_ORANGE:
            return 2;
        case HotDogProductName.COOKIE:
            return 3
        case HotDogProductName.SAUSAGE:
            return 5
        
        case HotDogProductName.HOT_DOG:
            return 7
        default:
            return 0

    }

}

const getListPlats = (level:number) : Product[]=> {
    if(level >= 1 && level <= 4){
        return allDishesHotDog.filter((element:Product)=>!element.haveCondiment);
    }else if(level >= 5 && level <= 9){
        return allDishesHotDog.filter((element:Product)=>!element.haveCondiment || element.condiment ==='ketchup');
    }else if(level >= 11 && level <= 15){
        return allDishesHotDog.filter((element:Product)=>!element.haveCondiment || element.condiment ==='ketchup' || element.condiment === 'mayonnaise');
    }else{
        return allDishesHotDog;
    }
}