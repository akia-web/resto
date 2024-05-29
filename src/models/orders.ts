import { ProductWithQuantity } from "./products";


export interface Orders{
    products: ProductWithQuantity[];
    status: boolean;
    interval: number | undefined;
    love: number;
    id: number;
}