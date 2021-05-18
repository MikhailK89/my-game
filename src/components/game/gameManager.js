import * as gameFuncs from './gameFuncs'
import {trackKeys} from '../../index'
import {store} from '../../index'

export class GameManager {
  heroes = []
  animationInterval = null

  constructor() {
    this.checkStoreChanges = this.checkStoreChanges.bind(this)
    this.init()
  }

  init() {
    store.subscribe(this.checkStoreChanges)
  }

  checkStoreChanges(state) {
    if (state.gameIsOver) {
      this.stopGame()
    }
  }

  createGame() {
    gameFuncs.createBackground()
    this.heroes = gameFuncs.createHeroes()
  }

  startGame() {
    this.animationInterval = setInterval(() => {
      this.heroes.forEach(h => {
        h.animate(trackKeys.arrowsState)
      })
    }, 50)
  }

  stopGame() {
    clearInterval(this.animationInterval)
  }
}
