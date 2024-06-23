import { CategoryProduct } from "../Enum/CategoryProduct";
import { HotDogProductName } from "../Enum/HotDogProductName";
import { CondimentHotDog } from "../components/HotDog/Config/allPlats";


export interface Product {
    name: string;
    img: string;
    category : CategoryProduct;
    haveSecondaryFood: boolean;
    haveCondiment: boolean;
    condiment?: CondimentHotDog;
    labelName: HotDogProductName;
    price?: number;
}