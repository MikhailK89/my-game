import * as gameFuncs from './gameFuncs'
import {trackKeys} from '../../index'
import {store} from '../../index'
import {restartIsActivated} from '../../store/actions'

export class GameManager {
  heroes = []
  animationInterval = null

  gameIsOver = store.getState().gameIsOver
  gameIsStarted = store.getState().gameIsStarted

  menu = null

  constructor() {
    this.checkStoreChanges = this.checkStoreChanges.bind(this)
    this.init()
  }

  init() {
    store.subscribe(this.checkStoreChanges)
  }

  checkStoreChanges(state) {
    if (state.gameIsOver) {
      if (!state.gameIsOver.includes(this.gameIsOver)) {
        this.stopGame()
        this.menu.activate(state.gameIsOver)
      }
    }

    if (state.gameIsStarted) {
      if (state.gameIsStarted !== this.gameIsStarted) {
        this.startGame()
      }
    }

    this.gameIsOver = state.gameIsOver
    this.gameIsStarted = state.gameIsStarted
  }

  createGame() {
    gameFuncs.createBackground()
    this.heroes = gameFuncs.createHeroes()

    this.menu = gameFuncs.createMenu()

    if (!store.getState().restartIsActivated) {
      this.menu.activate('game_start')
    }
  }

  startGame() {
    if (store.getState().restartIsActivated) {
      gameFuncs.deleteGame()
      this.createGame()
      this.init()
    } else {
      store.emit(restartIsActivated(true), false)
    }

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
