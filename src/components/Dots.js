//composant permettant de connaître le nom de points sur chaque dé
//en fonction de sa valeur
import React from 'react'
import '../styles.css'

//on prend le nombre de points en paramètre à partir de Die
export default function Dots(props) {
    let dots
    switch (props.number) {
        //si c'est 1, on aura un point au centre
        case 1:
            dots = <div className='dot one'></div>
            break;
        //si c'est 2, on aura deux points en diagonale
        case 2:
            dots = <div>
                <div className='dot two-one'></div>
                <div className='dot two-two'></div>
            </div>
            break;
        //si c'est 3, on aura trois points en diagonale
        case 3:
            dots = <div>
                <div className='dot three-one'></div>
                <div className='dot three-two'></div>
                <div className='dot three-three'></div>
            </div>
            break;
        //si c'est 4, on aura quatre points en carré
        case 4:
            dots = <div>
                <div className='dot four-one'></div>
                <div className='dot four-two'></div>
                <div className='dot four-three'></div>
                <div className='dot four-four'></div>
            </div>
            break;
        //si c'est 5, on aura cinq points en carré + un au centre
        case 5:
            dots = <div>
                <div className='dot five-one'></div>
                <div className='dot five-two'></div>
                <div className='dot five-three'></div>
                <div className='dot five-four'></div>
                <div className='dot five-five'></div>
            </div>
            break;
        case 6:
        //si c'est 6, on aura six points en carré
            dots = <div>
                <div className='dot six-one'></div>
                <div className='dot six-two'></div>
                <div className='dot six-three'></div>
                <div className='dot six-four'></div>
                <div className='dot six-five'></div>
                <div className='dot six-six'></div>
            </div>
            break;
        default:
            console.log("c'est gate")
            break;
    }
    return (
        <div>{dots}</div>
    )
}