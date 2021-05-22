import * as worldSettings from '../../settings/worldSettings'
import {domOperations} from '../../index'
import {game} from '../../index'
import {totalCoins} from '../../store/actions'
import {trackScroll} from '../../index'
import {store} from '../../index'
import {collectedCoins} from '../../store/actions'
import {Menu} from '../menu'

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

  let coinsCounter = 0

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
              left: idxCol * worldSettings.rectSize + 10 + 'px',
              top: idxRow * worldSettings.rectSize + 'px'
            }
          }))

          coinsCounter++
        }

        if (row[idxCol] === 's') {
          const gameScreen = new heroClass()
          trackScroll.subscribe(gameScreen.checkScreenScroll)
          createdHeroes.push(gameScreen)
        }

        if (row[idxCol] === 'f') {
          const finish = new heroClass()
          trackScroll.subscribe(finish.checkScreenScroll)
          createdHeroes.push(finish)
        }
      }
    }
  })

  store.emit(totalCoins(coinsCounter), false)

  createdHeroes.forEach(h => {
    domOperations.insertElem(h.elem, game)
  })

  return createdHeroes
}

export function createMenu() {
  const menu = new Menu()
  domOperations.insertElem(menu.elem, game)

  return menu
}

export function deleteGame() {
  store.clearListeners()
  store.emit(collectedCoins(0, false))
  trackScroll.clearSubs()
  game.innerHTML = ''
  domOperations.resetScroll()
}
