import { HotDogProductName } from "../Enum/HotDogProductName"

export interface Plate {
    // step: typeAssiete | null,
    active: boolean,
    main:boolean,
    accompanying: boolean,
    trim: boolean // garniture
}

export type typeAssiete = null| 'vide' | HotDogProductName.PAIN_ASSIETTE | 
HotDogProductName.HOT_DOG | 
HotDogProductName.HOT_DOG_KETCHUP| HotDogProductName.HOT_DOG_MAYONNAISE | HotDogProductName.HOT_DOG_MUSTARD
| HotDogProductName.SAUSAGE | 
HotDogProductName.SAUSAGE_KETCHUP | HotDogProductName.SAUSAGE_MAYONNAISE | HotDogProductName.SAUSAGE_MUSTARD
