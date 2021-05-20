import {domOperations} from '../index'
import {store} from '../index'
import {gameIsOver, gameIsStarted} from '../store/actions'

export class Menu {
  props = {
    className: 'menu'
  }

  constructor() {
    this.elem = domOperations.createElem('div', this.props)

    this.pressButtonHandler = this.pressButtonHandler.bind(this)
  }

  activate(type = 'game_start') {
    const state = store.getState()

    if (type === 'game_start') {
      this.elem.innerHTML = `
        <h2 class="menu__title">Start running</h2>
        <div class="menu__counter">Collected coins:
          <span>${state.collectedCoins}/${state.totalCoins}</span>
        </div>
        <button class="menu__btn">Go!</button>
      `
    } else if (type === 'game-screen') {
      this.elem.innerHTML = `
        <h2 class="menu__title">You lose</h2>
        <div class="menu__counter">Collected coins:
          <span>${state.collectedCoins}/${state.totalCoins}</span>
        </div>
        <button class="menu__btn">Try again!</button>
      `
    } else if (type === 'finish') {
      this.elem.innerHTML = `
        <h2 class="menu__title">You won</h2>
        <div class="menu__counter">Collected coins:
          <span>${state.collectedCoins}/${state.totalCoins}</span>
        </div>
        <button class="menu__btn">Next!</button>
      `
    }

    this.elem.style.display = 'block'
    domOperations.centerElem(this.elem)
    this.activateEventListener()
  }

  activateEventListener() {
    const btn = document.querySelector('.menu__btn')
    btn.addEventListener('click', this.pressButtonHandler)
  }

  deleteEventListener() {
    const btn = document.querySelector('.menu__btn')
    btn.removeEventListener('click', this.pressButtonHandler)
  }

  pressButtonHandler() {
    this.deleteEventListener()
    this.elem.style.display = 'none'

    store.emit(gameIsOver(null))
    store.emit(gameIsStarted(true))
  }
}
