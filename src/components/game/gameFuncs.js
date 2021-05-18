import * as worldSettings from '../../settings/worldSettings'
import {domOperations} from '../../index'
import {game} from '../../index'
import {trackScroll} from '../../index'

export function createBackgroundElement(item) {
  return domOperations.createElem('div', {className: worldSettings.bgElems[item]})
}

export function createBackground() {
  worldSettings.worldMap.forEach(row => {
    const rowElem = domOperations.createElem('div', {className: 'row'})

    for (let i = 0; i < row.length; i++) {
      domOperations.insertElem(createBackgroundElement(row[i]), rowElem)
    }

    domOperations.insertElem(rowElem, game)
  })
}

export function createHeroes() {
  const createdHeroes = []
  const heroesChars = Object.keys(worldSettings.heroes)

  worldSettings.worldMap.forEach((row, idxRow) => {
    for (let idxCol = 0; idxCol < row.length; idxCol++) {
      if (heroesChars.includes(row[idxCol])) {
        const heroClass = worldSettings.heroes[row[idxCol]]

        if (row[idxCol] === 'p') {
          createdHeroes.push(new heroClass())
        }

        if (row[idxCol] === 'c') {
          createdHeroes.push(new heroClass({
            style: {
              left: idxCol * worldSettings.rectSize + 'px',
              top: idxRow * worldSettings.rectSize + 'px'
            }
          }))
        }

        if (row[idxCol] === 's') {
          const gameScreen = new heroClass()
          trackScroll.subscribe(gameScreen.checkScreenScroll)
          createdHeroes.push(gameScreen)
        }
      }
    }
  })

  createdHeroes.forEach(h => {
    domOperations.insertElem(h.elem, game)
  })

  return createdHeroes
}
