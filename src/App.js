//composant principal
import React from 'react'
import './styles.css'
import Die from './components/Die'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import useSound from 'use-sound'
import diceSfx from './dice-roll.mp3'
import holdSfx from './cut.mp3'
import releaseSfx from './cutza.mp3'
import congratsSfx from './congrats.mp3'
import newGameSfx from './newgame.mp3'



export default function App() {
    
    //tableau contenant tous les objets dés utilisés actuellement
    const [diceValues, setDiceValues] = React.useState(allNewDice())

    //nombre de lancers (initialisé à 100)
    const [numberRolls, setNumberRolls] = React.useState(100)

    //permet de savoir si on a gagné (tous les dés attrapés on la même valeur - true) ou pas (false)
    const [tenzies, setTenzies] = React.useState(false)

    //son de lancer
    const [rolling] = useSound(diceSfx, { volume: 0.5 });

     //son de saisie
    const [holding] = useSound(holdSfx)

     //son de libération
    const [releasing] = useSound(releaseSfx, { volume: 0.5 })

     //son d'applaudissements
    const [gratsing] = useSound(congratsSfx)

     //son de nouvelle partie
    const [newGaming] = useSound(newGameSfx)

    //retourne un objet dé dont la valeur est le nombre du dé (entre 1 et 6)
    //un champ isHeld pour savoir s'il est "attrapé" (initialisé à false)
    //un id permettant de l'identifier de manière unique avec nanoid
    function generateNewDie() {
        return {
            value: Math.floor(Math.random() * 6) + 1,
            isHeld: false,
            id: nanoid()
        }
    }

    //permet de vérifier à chaque modification d'un élément si on a gagné ou pas
    React.useEffect(() => {

        //pour que allHeld vaille true, il faut que les propriétés isHeld de tous les dés soient true
        const allHeld = diceValues.every(die => die.isHeld)
        //on prend la valeur d'un dé 
        const sameValue = diceValues[0].value
        //on vérifie si elle est la même que celle de tous les autres dés
        const allSameValue = diceValues.every(die => die.value === sameValue)

        //si tous les dés sont attrapés et qu'ils ont tous la même valeur, on a gagné
        //on met tenzies à true et on joue le son d'applaudissement
        if (allHeld && allSameValue) {
            setTenzies(true) 
            gratsing()
        }

    }, [diceValues, gratsing])

    //déterminer et enregistrer le nombre de lancers de l'utilisateur
    React.useEffect(() => {
        //si l'utilisateur a gagné en un nombre de lancers inférieur à son précédent nombre de lancers,
        //on l'enregistre dans le local storage
        if (numberRolls < JSON.parse(localStorage.getItem("number_of_rolls")) && numberRolls !== 0 && tenzies) {
            localStorage.setItem("number_of_rolls", JSON.stringify(numberRolls))
        }

        //au début de la partie, on met le nombre de lancers à 100 dans le local storage 
        //puis on définit le nombre de lancers de l'utilisateur à 0
        if (numberRolls === 100) {
            localStorage.setItem("number_of_rolls", JSON.stringify(numberRolls))
            setNumberRolls(0)
        }


    }, [tenzies, numberRolls])

    //permet de générer 10 dés (des objets) avec generateNewDie()
    //en ajoutant chacun de ces dés dans un tableau de dés nommé diceArray qui est retourné
    function allNewDice() {
        const diceArray = []
        for (let i = 0; i < 10; i++) {
            diceArray.push(generateNewDie())
        }
        return diceArray;
    }
    
    //refaire un tirage aléatoire de tous les dés (sauf ceux qui sont attrapés)
    function rollDice() {
        //si on a déjà gagné (ie tenzies=1) on joue le son de nouvelle partie, on remet tenzies à false
        //on génère 10 nouveaux dés et on met le nombre de lancers à 0
        if (tenzies) {
            newGaming() //le pop
            setTenzies(false)
            setDiceValues(allNewDice())
            setNumberRolls(0)

        }
        //sinon on augmente le nombre de lancers, on joue le son de lancer
        //et on génère un nouveau dé sauf pour les dés qui sont attrapés
        else {
            setNumberRolls(prevNumberRolls => prevNumberRolls + 1)
            rolling()
            setDiceValues(oldDiceValues => {
                return oldDiceValues.map(die => {
                    return die.isHeld ? die : generateNewDie()
                })
            })
        }
    }


    //Attraper un dé (ne pas faire changer sa valeur entre deux lancers)
    function holdDice(id) {
        //on parcourt le tableau de dés (diceValues)
        //si le dé n'est pas attrapé, on joue le son de saisie, sinon on joue le son de libération
        //et on met la propriété isHeld du dé à la valeur contraire de celle qu'elle possède déjà
        setDiceValues(oldDiceValues => {
            return oldDiceValues.map(die => {
                if (die.id === id) {
                    die.isHeld ? releasing() : holding()
                    return {
                        ...die,
                        isHeld: !die.isHeld
                    }
                }
                else
                    return die;
            })
        })
    }

    //parcourir diceValues et afficher chaque dé à l'aide du component Die.js
    //on passe holdDice pour pouvoir gérer le changement d'état (attrapé ou libéré) au click sur le dé pour chaque dé
    let diceElements = diceValues.map((diceValue) => {
        return (
            <Die
                value={diceValue.value}
                key={diceValue.id}
                isHeld={diceValue.isHeld}
                holdDice={() => holdDice(diceValue.id)}
            />
        )
    })

    return (
        <main className='app--main'>
            {tenzies && <Confetti />} {/*Si on a gagné, on utilise le component Confetti */}
            <h1 className='title'>Tenzies</h1>
                  {/*on affiche le précédent record de lancers contenu dans le local storage  */} 
            <div className='rollcount'>Lowest number of rolls: {JSON.parse(localStorage.getItem("number_of_rolls"))}</div> 
            <p className='instructions'>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className='container'>
                {diceElements}
            </div>
            <button
                className='app--roll'
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"} {/*Si on a gagné, le bouton affiche "New Game", sinon il affiche "Roll" */}
            </button>
        </main>

    )
}
