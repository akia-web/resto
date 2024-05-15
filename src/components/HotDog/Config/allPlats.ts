import { CategoryProduct } from "../../../Enum/CategoryProduct";
import { HotDogProductName } from "../../../Enum/HotDogProductName";
import { Product } from "../../../models/products";

export type CondimentHotDog = 'ketchup'| 'mayonnaise' | 'moutarde'

export const allDrinksHotDog : Product[]=[
    {
        name:`jus d'orange`, 
        img:'jus-orange',
        category: CategoryProduct.DRINKS,
        haveCondiment: false,
        haveSecondaryFood: false,
        labelName: HotDogProductName.JUS_ORANGE
    }, 
    {
        name:`coca`, 
        img:'coca',
        category: CategoryProduct.DRINKS,
        haveCondiment: false,
        haveSecondaryFood: false,
        labelName: HotDogProductName.COCA
    }, 
]

export const allSnacksHotDog : Product[]=[
    {
        name:`glace`, 
        img:'glace',
        category: CategoryProduct.SNACKS,
        haveCondiment: false,
        haveSecondaryFood: false,
        labelName: HotDogProductName.GLACE
    }, 
    {
        name:`cookie`, 
        img:'cookie',
        category: CategoryProduct.SNACKS,
        haveCondiment: false,
        haveSecondaryFood: false,
        labelName: HotDogProductName.COOKIE
    }, 
    {
        name:`frites`, 
        img:'frites',
        category: CategoryProduct.SNACKS,
        haveCondiment: false,
        haveSecondaryFood: false,
        labelName: HotDogProductName.FRITES
    }, 
]

export const allDishesHotDog : Product[]=[
    {
        name:`hot-dog`, 
        img:'hotdog',
        category: CategoryProduct.DISHES,
        haveCondiment: false,
        haveSecondaryFood: true,
        labelName: HotDogProductName.HOT_DOG
    }, 
    {
        name:`hot-dog avec ketchup`, 
        img:'hot-dog-with-ketchup',
        category: CategoryProduct.DISHES,
        haveCondiment: true,
        haveSecondaryFood: true,
        condiment: 'ketchup',
        labelName: HotDogProductName.HOT_DOG_KETCHUP
    }, 
    {
        name:`hot-dog avec mayonnaise`, 
        img:'hot-dog-with-mayonnaise',
        category: CategoryProduct.DISHES,
        haveCondiment: true,
        haveSecondaryFood: true,
        condiment:'mayonnaise',
        labelName: HotDogProductName.HOT_DOG_MAYONNAISE
    }, 
    {
        name:`hot-dog avec moutarde`, 
        img:'hot-dog-with-mustard',
        category: CategoryProduct.DISHES,
        haveCondiment: true,
        haveSecondaryFood: true,
        condiment:'moutarde',
        labelName: HotDogProductName.HOT_DOG_MUSTARD,
    }, 
    {
        name:`saucisse`, 
        img:'sausage',
        category: CategoryProduct.DISHES,
        haveCondiment: false,
        haveSecondaryFood: false,
        labelName: HotDogProductName.SAUSAGE,
    }, 
    {
        name:`saucisse avec ketchup`, 
        img:'sausage-with-ketchup',
        category: CategoryProduct.DISHES,
        haveCondiment: true,
        haveSecondaryFood: false,
        condiment:'ketchup',
        labelName: HotDogProductName.SAUSAGE_KETCHUP
    }, 
    {
        name:`saucisse avec mayonnaise`, 
        img:'sausage-with-mayonnaise',
        category: CategoryProduct.DISHES,
        haveCondiment: true,
        haveSecondaryFood: false,
        condiment:'mayonnaise',
        labelName: HotDogProductName.SAUSAGE_MAYONNAISE,
    }, 
    {
        name:`saucisse avec moutarde`, 
        img:'sausage-with-mustard',
        category: CategoryProduct.DISHES,
        haveCondiment: true,
        haveSecondaryFood: false,
        condiment:'moutarde',
        labelName: HotDogProductName.SAUSAGE_MUSTARD
    }, 
]