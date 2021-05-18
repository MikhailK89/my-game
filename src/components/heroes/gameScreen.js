import {domOperations} from '../../index'

export class GameScreen {
  props = {
    className: 'game-screen'
  }

  animationDelay = 3000
  animationStart = false

  scrollStep = 2

  constructor(addProps = null) {
    this.elem = domOperations.createElem('div', this.props)

    if (addProps) {
      domOperations.applyProps(this.elem, addProps)
    }

    this.checkScreenScroll = this.checkScreenScroll.bind(this)

    this.init()
  }

  init() {
    setTimeout(() => {
      this.animationStart = true
    }, this.animationDelay)
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

  animate() {
    if (!this.animationStart) {
      return
    }

    // this.moveRight()
  }
}
