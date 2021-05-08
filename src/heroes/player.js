import * as funcs from '../shared/funcs'
import {domOperations} from '../index'
import imgRight from '../assets/player-sm-right.png'
import imgLeft from '../assets/player-sm-left.png'

export class Player {
  props = {
    className: 'player',
    style: {
      width: '80px',
      height: '96px',
      background: `url(${imgRight}) no-repeat`,
      backgroundPosition: 'top left 0px'
    }
  }

  step = 7
  bgPos = 0

  dir = 1

  jumpAnimation = false
  fallAnimation = false

  constructor(addProps) {
    this.elem = domOperations.createElem('div', this.props)
    domOperations.applyProps(this.elem, addProps)
  }

  moveBackAndForth(img, dir = 'right') {
    const leftPos = funcs.findCurCoords(this.elem).left

    this.bgPos -= 80

    if (this.bgPos < -320) {
      this.bgPos = 0
    }

    if (dir === 'right' && this.step < 0) {
      this.step *= -1
    }

    if (dir === 'left' && this.step > 0) {
      this.step *= -1
    }

    domOperations.applyProps(this.elem, {
      style: {
        background: `url(${img}) no-repeat`,
        backgroundPosition: `top left ${this.bgPos}px`
      }
    })

    let adjOffsetX = this.step

    while (funcs.hasObstacle(this.elem, {x: adjOffsetX, y: 0})) {
      if (this.step > 0) {
        adjOffsetX--
      } else {
        adjOffsetX++
      }
    }

    domOperations.heroShift(this.elem, {
      left: leftPos + adjOffsetX
    })
  }

  moveUp() {
    if (!funcs.isOnGround(this.elem)) {
      return
    }

    if (this.jumpAnimation) {
      return
    }

    this.jumpAnimation = true

    const jumpHeight = 120
    const offsetY = -20

    const curCoords = funcs.findCurCoords(this.elem)
    let curPoint = curCoords.top
    const endPoint = curPoint - jumpHeight

    const interval = setInterval(() => {
      let adjOffsetY = offsetY

      while (funcs.hasObstacle(this.elem, {x: 0, y: adjOffsetY})) {
        this.jumpAnimation = false
        adjOffsetY++
      }

      curPoint += adjOffsetY

      domOperations.heroShift(this.elem, {
        top: curPoint
      })

      if (curPoint < endPoint || !this.jumpAnimation) {
        this.jumpAnimation = false
        clearInterval(interval)
      }
    }, 50)
  }

  moveDown() {
    if (this.jumpAnimation) {
      return
    }

    if (this.fallAnimation) {
      return
    }

    this.fallAnimation = true

    const curCoords = funcs.findCurCoords(this.elem)
    let curPoint = curCoords.top

    const interval = setInterval(() => {
      curPoint += 20

      domOperations.heroShift(this.elem, {
        top: curPoint
      })

      if (funcs.isOnGround(this.elem)) {
        this.fallAnimation = false
        funcs.alignHero(this.elem)
        clearInterval(interval)
      }
    }, 50)
  }

  move(arrowsState) {
    if (arrowsState.right) {
      this.moveBackAndForth(imgRight, 'right')
      this.dir = 1
    }

    if (arrowsState.left) {
      this.moveBackAndForth(imgLeft, 'left')
      this.dir = -1
    }

    if (arrowsState.up) {
      this.moveUp()
    }
  }

  animate(arrowsState) {
    this.move(arrowsState)

    if (!funcs.isOnGround(this.elem)) {
      this.moveDown()
    }
  }
}
