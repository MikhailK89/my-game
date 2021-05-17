import * as funcs from '../shared/funcs'
import {domOperations} from '../index'
import {game} from '../index'
import imgRight from '../assets/player-sm-right.png'
import imgLeft from '../assets/player-sm-left.png'

export class Player {
  props = {
    className: 'player',
    style: {
      left: 40 + 'px',
      top: 200 + 'px',
      width: '80px',
      height: '96px',
      background: `url(${imgRight}) no-repeat`,
      backgroundPosition: 'top left -320px'
    }
  }

  horStep = 7
  verStep = 20
  jumpHeight = 140
  bg = {pos: -320, dir: 'right'}

  jumpAnimation = false
  fallAnimation = false

  constructor(addProps = null) {
    this.elem = domOperations.createElem('div', this.props)

    if (addProps) {
      domOperations.applyProps(this.elem, addProps)
    }
  }

  bgChange(img, dir) {
    if (this.bg.dir !== dir) {
      this.bg.pos = -1 * (this.bg.pos + 320)
      this.bg.dir = dir
    }

    if (dir === 'right') {
      this.bg.pos -= 80

      if (this.bg.pos < -320) {
        this.bg.pos = 0
      }
    }

    if (dir === 'left') {
      this.bg.pos += 80

      if (this.bg.pos > 0) {
        this.bg.pos = -320
      }
    }

    domOperations.applyProps(this.elem, {
      style: {
        background: `url(${img}) no-repeat`,
        backgroundPosition: `top left ${this.bg.pos}px`
      }
    })
  }

  moveBackAndForth(img, dir = 'right') {
    this.bgChange(img, dir)

    if (dir === 'right' && this.horStep < 0) {
      this.horStep *= -1
    }

    if (dir === 'left' && this.horStep > 0) {
      this.horStep *= -1
    }

    const leftPos = funcs.findCurCoords(this.elem).left

    let adjOffsetX = this.horStep

    while (funcs.hasObstacle(this.elem, {x: adjOffsetX, y: 0})) {
      if (this.horStep > 0) {
        adjOffsetX--
      } else {
        adjOffsetX++
      }
    }

    domOperations.heroShift(this.elem, {
      left: leftPos + adjOffsetX
    })

    this.scrollScreen(adjOffsetX, 0)
  }

  moveUp() {
    if (!funcs.isOnGround(this.elem)) {
      return
    }

    if (this.jumpAnimation) {
      return
    }

    this.jumpAnimation = true

    let shiftDistance = this.jumpHeight

    const interval = setInterval(() => {
      if (this.verStep > 0) {
        this.verStep *= -1
      }

      if (shiftDistance <= 0 || !this.jumpAnimation) {
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

      this.scrollScreen(0, adjOffsetY)
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

    const interval = setInterval(() => {
      if (this.verStep < 0) {
        this.verStep *= -1
      }

      const curCoords = funcs.findCurCoords(this.elem)

      let adjOffsetX = 0

      while (funcs.hasObstacle(this.elem, {x: adjOffsetX, y: 0})) {
        if (adjOffsetX <= 0) {
          adjOffsetX *= -1
          adjOffsetX++
        } else {
          adjOffsetX *= -1
        }
      }

      domOperations.heroShift(this.elem, {
        left: curCoords.left + adjOffsetX,
        top: curCoords.top + this.verStep
      })

      this.scrollScreen(adjOffsetX, this.verStep)

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
    }

    if (arrowsState.left) {
      this.moveBackAndForth(imgLeft, 'left')
    }

    if (arrowsState.up) {
      this.moveUp()
    }
  }

  scrollScreen(x, y) {
    const playerCoords = funcs.findCurCoords(this.elem)

    if (playerCoords.left <= game.clientWidth * 0.3 && this.horStep < 0) {
      domOperations.scrollScreen(x, 0)
    }

    if (playerCoords.left >= game.clientWidth * 0.7 && this.horStep > 0) {
      domOperations.scrollScreen(x, 0)
    }

    if (playerCoords.top <= game.clientHeight * 0.3 && this.verStep < 0) {
      domOperations.scrollScreen(0, y)
    }

    if (playerCoords.top >= game.clientHeight * 0.7 && this.verStep > 0) {
      domOperations.scrollScreen(0, y)
    }
  }

  animate(arrowsState) {
    this.move(arrowsState)

    if (!funcs.isOnGround(this.elem)) {
      this.moveDown()
    }
  }
}
