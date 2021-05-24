import * as funcs from '../../shared/funcs'
import {domOperations} from '../../index'
import {store} from '../../index'
import {gameIsOver, gameIsStarted} from '../../store/actions'

export class GameScreen {
  props = {
    className: 'game-screen'
  }

  animationTimeout = null
  expansionActivated = false

  gameIsOver = store.getState().gameIsOver

  startAnimation = false
  allowAnimation = false
  animationDelay = 3000

  scrollStep = 3

  constructor(addProps = null) {
    this.elem = domOperations.createElem('div', this.props)

    if (addProps) {
      domOperations.applyProps(this.elem, addProps)
    }

    this.checkScreenScroll = this.checkScreenScroll.bind(this)
    this.checkStoreChanges = this.checkStoreChanges.bind(this)

    this.init()
  }

  init() {
    store.subscribe(this.checkStoreChanges)
  }

  checkStoreChanges(state) {
    if (state.gameIsOver) {
      if (!state.gameIsOver.includes(this.gameIsOver)) {
        if (this.animationTimeout) {
          clearTimeout(this.animationTimeout)
        }

        this.restoreScreen()
      }
    }

    this.gameIsOver = state.gameIsOver
  }

  checkScreenScroll(scrollCoords) {
    domOperations.applyProps(this.elem, {
      style: {
        left: scrollCoords.x + 'px',
        top: scrollCoords.y + 'px'
      }
    })
  }

  restoreScreen() {
    domOperations.applyProps(this.elem, {
      style: {
        width: 10 + 'px'
      }
    })
  }

  moveRight() {
    let adjScrollX = this.scrollStep
    let callGameOver = false

    if (this.getCollisionCoordX(adjScrollX)) {
      adjScrollX = this.getCollisionCoordX(adjScrollX)
      callGameOver = true
    }

    if (this.allowAnimation) {
      domOperations.scrollScreen(adjScrollX, 0)
    }

    if (callGameOver) {
      store.emit(gameIsOver('game-screen'))
      store.emit(gameIsStarted(false))
    }

    if (this.expansionActivated) {
      domOperations.applyProps(this.elem, {
        style: {
          width: this.elem.offsetWidth + 2 + 'px'
        }
      })
    }
  }

  getCollisionCoordX(scrollX) {
    const screenCoords = funcs.findCurCoords(this.elem)
    const playerCoords = funcs.findCurCoords(document.querySelector('.player'))

    if (screenCoords.right + scrollX - 8 >= playerCoords.left) {
      return playerCoords.left - 2
    }

    return null
  }

  animate() {
    if (!this.startAnimation) {
      this.startAnimation = true

      this.animationTimeout = setTimeout(() => {
        this.allowAnimation = true
        this.animationTimeout = null
      }, this.animationDelay)
    }

    if (domOperations.leftScrollDone() && !this.expansionActivated) {
      this.expansionActivated = true
      this.allowAnimation = false
    }

    this.moveRight()
  }
}
