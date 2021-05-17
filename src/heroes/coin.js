import * as funcs from '../shared/funcs'
import {domOperations} from '../index'

export class Coin {
  props = {
    className: 'coin'
  }

  verStep = 5
  jumpHeight = 20

  jumpAnimation = false
  fallAnimation = false

  visible = false
  hidden = false

  constructor(addProps = null) {
    this.elem = domOperations.createElem('div', this.props)

    if (addProps) {
      domOperations.applyProps(this.elem, addProps)
    }
  }

  moveUp() {
    if (!funcs.isVisible(this.elem, {x: 0, y: -1 * this.jumpHeight})) {
      return
    }

    if (this.fallAnimation || this.jumpAnimation) {
      return
    }

    if (!this.visible || this.hidden) {
      return
    }

    this.jumpAnimation = true

    let shiftDistance = this.jumpHeight

    const interval = setInterval(() => {
      this.visible = funcs.isVisible(this.elem)
      this.hidden = funcs.isHidden(this.elem)

      if (this.verStep > 0) {
        this.verStep *= -1
      }

      if (shiftDistance <= 0 || !this.jumpAnimation ||
          !this.visible || this.hidden) {
        this.jumpAnimation = false
        clearInterval(interval)
        return
      }

      let adjOffsetY = this.verStep

      while (funcs.hasObstacle(this.elem, {x: 0, y: adjOffsetY})) {
        this.jumpAnimation = false
        adjOffsetY++
      }

      const topPos = funcs.findCurCoords(this.elem).top

      shiftDistance += adjOffsetY

      domOperations.heroShift(this.elem, {
        top: topPos + adjOffsetY
      })
    }, 50)
  }

  moveDown() {
    if (this.jumpAnimation || this.fallAnimation) {
      return
    }

    if (!this.visible || this.hidden) {
      return
    }

    this.fallAnimation = true

    const interval = setInterval(() => {
      this.visible = funcs.isVisible(this.elem)
      this.hidden = funcs.isHidden(this.elem)

      if (this.verStep < 0) {
        this.verStep *= -1
      }

      if (funcs.isOnGround(this.elem)) {
        this.fallAnimation = false
        funcs.alignHero(this.elem)
        clearInterval(interval)
        return
      }

      if (!this.visible || this.hidden) {
        this.fallAnimation = false
        clearInterval(interval)
        return
      }

      const curCoords = funcs.findCurCoords(this.elem)

      domOperations.heroShift(this.elem, {
        top: curCoords.top + this.verStep
      })
    }, 50)
  }

  animate() {
    this.visible = funcs.isVisible(this.elem)
    this.hidden = funcs.isHidden(this.elem)

    if (this.visible && !this.hidden) {
      if (!funcs.isOnGround(this.elem)) {
        this.moveDown()
      } else {
        this.moveUp()
      }

      funcs.collisionHandler(this.elem)
    }
  }
}
