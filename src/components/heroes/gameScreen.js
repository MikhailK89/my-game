import {domOperations} from '../../index'
import {store} from '../../index'

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

  scrollStep = 2

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

  moveRight() {
    domOperations.scrollScreen(this.scrollStep, 0)
  }

  restoreScreen() {
    domOperations.applyProps(this.elem, {
      style: {
        width: 10 + 'px'
      }
    })
  }

  animate() {
    if (!this.startAnimation) {
      this.startAnimation = true

      setTimeout(() => {
        this.allowAnimation = true
        this.animationTimeout = null
      }, this.animationDelay)
    }

    if (!this.allowAnimation) {
      return
    }

    if (domOperations.leftScrollDone() && !this.expansionActivated) {
      this.expansionActivated = true
    }

    if (this.expansionActivated) {
      domOperations.applyProps(this.elem, {
        style: {
          width: this.elem.offsetWidth + 2 + 'px'
        }
      })
    }

    this.moveRight()
  }
}
