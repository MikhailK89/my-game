import * as funcs from '../../shared/funcs'
import {domOperations} from '../../index'
import {game} from '../../index'
import {store} from '../../index'
import {gameIsOver, gameIsStarted} from '../../store/actions'
import imgRight from '../../assets/player-sm-right.png'
import imgLeft from '../../assets/player-sm-left.png'

export class Player {
  props = {
    className: 'player'
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

    this.createSprites()

    this.checkStoreChanges = this.checkStoreChanges.bind(this)
    this.init()
  }

  init() {
    store.subscribe(this.checkStoreChanges)
  }

  checkStoreChanges(state) {
    if (state.gameIsOver) {
      this.jumpAnimation = false
      this.fallAnimation = false
    }
  }

  createSprites() {
    this.imgRight = domOperations.createElem('img', {
      className: 'player__img-right',
      src: imgRight,
      style: {
        left: -320 + 'px'
      }
    })

    this.imgLeft = domOperations.createElem('img', {
      className: 'player__img-left',
      src: imgLeft,
      style: {
        display: 'none'
      }
    })

    domOperations.insertElem(this.imgRight, this.elem)
    domOperations.insertElem(this.imgLeft, this.elem)
  }

  manageSprite(dir) {
    if (this.bg.dir !== dir) {
      this.bg.pos = -1 * (this.bg.pos + 320)
      this.bg.dir = dir
    }

    if (dir === 'right') {
      this.imgRight.style.display = 'block'
      this.imgLeft.style.display = 'none'

      this.bg.pos -= 80

      if (this.bg.pos < -320) {
        this.bg.pos = 0
      }
    }

    if (dir === 'left') {
      this.imgLeft.style.display = 'block'
      this.imgRight.style.display = 'none'

      this.bg.pos += 80

      if (this.bg.pos > 0) {
        this.bg.pos = -320
      }
    }

    const imgElem = dir === 'right' ? this.imgRight : this.imgLeft

    domOperations.applyProps(imgElem, {
      style: {
        left: this.bg.pos + 'px'
      }
    })
  }

  moveBackAndForth(dir = 'right') {
    this.manageSprite(dir)

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
      if (!this.fallAnimation) {
        clearInterval(interval)
        return
      }

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
      this.moveBackAndForth('right')
    }

    if (arrowsState.left) {
      this.moveBackAndForth('left')
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

  collisionHandler() {
    const obstaclePoints = funcs.getElemsUnderPoints(this.elem, 'obstaclePoints')
    const keys = Object.keys(obstaclePoints)

    for (let i = 0; i < keys.length; i++) {
      const item = obstaclePoints[keys[i]]

      if (item) {
        if (['game-screen', 'finish'].includes(item.className)) {
          store.emit(gameIsOver(item.className))
          store.emit(gameIsStarted(false))
          break
        }
      }
    }
  }

  animate(arrowsState) {
    this.move(arrowsState)

    if (!funcs.isOnGround(this.elem)) {
      this.moveDown()
    }

    this.collisionHandler()
  }
}
