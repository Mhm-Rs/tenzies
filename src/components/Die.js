//composant permettant d'afficher un dé
//les points (cercles noirs) proviennent de Dots.js

import React from 'react'
import '../styles.css'
import Dots from '../components/Dots.js'

//on prend l'information de s'il est sélectionné ou pas avec isHeld 
//venant de App.js
export default function Die(props) {
    //en fonction de si on a attrapé le dé ou pas, il sera en blanc ou en vert
    let styles = {
        backgroundColor: props.isHeld ? '#59E391' : 'white'
    }
    return (
        <div
            className='dice'
            style={styles}
            onClick={props.holdDice}
        >
            <Dots number={props.value} /> {/* pour les points */}
        </div>
    )
}