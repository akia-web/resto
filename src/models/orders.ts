import { ProductWithQuantity } from "./products";


export interface Orders{
    products: ProductWithQuantity[];
    status: boolean;
    id: number;
}