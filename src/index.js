import './styles/style.scss'
import './styles/items.scss'

import * as worldSettings from './settings/worldSettings'
import {DomOperations} from './shared/domOperations'

export const domOperations = new DomOperations()
export const game = document.querySelector('.game')

function trackKeys(codes) {
  const pressed = {}

  function handler(event) {
    if (codes.hasOwnProperty(event.keyCode)) {
      const down = event.type === 'keydown'
      pressed[codes[event.keyCode]] = down
      event.preventDefault()
    }
  }

  addEventListener('keydown', handler)
  addEventListener('keyup', handler)

  return pressed
}

const arrowsState = trackKeys(worldSettings.arrowCodes)

function createBackgroundElement(item) {
  return domOperations.createElem('div', {className: worldSettings.bgElems[item]})
}

function createBackground() {
  worldSettings.worldMap.forEach(row => {
    const rowElem = domOperations.createElem('div', {className: 'row'})

    for (let i = 0; i < row.length; i++) {
      domOperations.insertElem(createBackgroundElement(row[i]), rowElem)
    }

    domOperations.insertElem(rowElem, game)
  })
}

function createHeroes() {
  const createdHeroes = []

  worldSettings.worldMap.forEach(row => {
    for (let i = 0; i < row.length; i++) {
      if (Object.keys(worldSettings.heroes).includes(row[i])) {
        const heroClass = worldSettings.heroes[row[i]]
        const hero = new heroClass()

        createdHeroes.push(hero)

        domOperations.insertElem(hero.elem, game)
      }
    }
  })

  setInterval(() => {
    createdHeroes.forEach(h => {
      h.animate(arrowsState)
    })
  }, 50)
}

createBackground()
createHeroes()
