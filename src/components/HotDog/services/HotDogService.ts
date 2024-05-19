import { EnumPoele } from "../../../Enum/EnumPoele"

export const updateVisibilityPoele = (poeleNumber: number, step: EnumPoele) =>{
    const poele = document.querySelectorAll('#poele-container')[poeleNumber]
    const saucisse = document.querySelectorAll('#saucisse-poele')[poeleNumber]
    const saucisseCuite = document.querySelectorAll('#saucisse-cuite')[poeleNumber]
    const saucisseCouleur : NodeListOf<HTMLElement> = poele.querySelectorAll('.cls-3')

    switch(step){
        case EnumPoele.VIDE:
            saucisse.classList.add('no-visible')
            saucisseCuite.classList.add('no-visible')
            saucisseCouleur.forEach((element: HTMLElement) => {
                element.style.fill = '#c15a36';
            });
            break
        case EnumPoele.CRU:
            saucisse.classList.remove('no-visible');
            break
        case EnumPoele.CUITE:
            saucisseCuite.classList.remove('no-visible');
            break
        case EnumPoele.CRAMEE:
            saucisseCouleur.forEach((element: HTMLElement) => {
                element.style.fill = '#594f4b';
            });
    }
}

export const updateDrinks = (boisson: string, remove : boolean = false) => {
    const verre = document.getElementById('objet-verre')
    const ellipse = document.getElementById('couleur-liquide-elipse')
    const liquide = document.getElementById('couleur-liquide')

    if(remove){
        liquide?.classList.remove(`liquide-${boisson}`)
        ellipse?.classList.remove(`ellipse-liquide-${boisson}`)
        verre?.classList.remove('active-verre')
    }else{
        verre?.classList.add('active-verre')
        ellipse?.classList.add(`ellipse-liquide-${boisson}`)
        liquide?.classList.add(`liquide-${boisson}`)
    }

}

export const updateFries = () => {
    const fries = document.getElementById('fritesMachine')

    if(fries?.classList.contains('no-visible')){
        fries?.classList.remove('no-visible');
        return;
    }else{
        fries?.classList.add('no-visible');
    }
    
}

export const setActive = (id: string, index: null| number = null) => {
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

export const removeActive = () => {
    const active = document.querySelectorAll('.active-food')
    active.forEach(element => {
        element.classList.remove('active-food')
    });
}



