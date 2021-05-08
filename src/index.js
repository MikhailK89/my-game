import './styles/style.scss'
import './styles/items.scss'

import {DomOperations} from './shared/domOperations'
import {worldMap, heroes} from './settings/worldSettings'
import {Player} from './heroes/player'

export const domOperations = new DomOperations()

const game = document.querySelector('.game')

const arrowCodes = {
  37: 'left',
  38: 'up',
  39: 'right'
}

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

const arrowsState = trackKeys(arrowCodes)

function createBackgroundElement(item) {
  let elem

  if (item === 'o' || heroes.includes(item)) {
    elem = domOperations.createElem('div', {className: 'air'})
  }

  if (item === 'x') {
    elem = domOperations.createElem('div', {className: 'ground'})
  }

  if (item === 'w') {
    elem = domOperations.createElem('div', {className: 'wall'})
  }

  return elem
}

function createBackground() {
  worldMap.forEach(row => {
    const rowElem = domOperations.createElem('div', {className: 'row'})

    for (let i = 0; i < row.length; i++) {
      domOperations.insertElem(createBackgroundElement(row[i]), rowElem)
    }

    domOperations.insertElem(rowElem, game)
  })
}

function createHeroes() {
  worldMap.forEach(row => {

    for (let idxCol = 0; idxCol < row.length; idxCol++) {

      if (row[idxCol] === 'p') {
        const player = new Player({
          style: {
            left: 10 + 'px',
            top: 200 + 'px'
          }
        })

        domOperations.insertElem(player.elem, game)

        setInterval(() => {
          player.animate(arrowsState)
        }, 50)
      }
    }
  })
}

createBackground()
createHeroes()
