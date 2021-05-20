import {domOperations} from '../index'
import {game} from '../index'
import {groundStatus, notObstacles, shadowArea} from '../settings/worldSettings'

export function findCurCoords(elem) {
  const elemRect = elem.getBoundingClientRect()
  const gameRect = game.getBoundingClientRect()

  return {
    left: elemRect.left - gameRect.left,
    right: elemRect.right - gameRect.left,
    top: elemRect.top - gameRect.top,
    bottom: elemRect.bottom - gameRect.top
  }
}

export function getElemFromPoint(x, y) {
  const gameRect = game.getBoundingClientRect()

  x += gameRect.left
  y += gameRect.top

  return document.elementFromPoint(x, y)
}

export function getElemsUnderPoints(elem, set, offset = null) {
  const coords = findCurCoords(elem)

  let left = coords.left
  let right = coords.right
  let top = coords.top
  let bottom = coords.bottom

  if (offset) {
    left += offset.x
    right += offset.x
    top += offset.y
    bottom += offset.y
  }

  const elemHeight = bottom - top
  const elemWidth = right - left

  const verMid = top + elemHeight / 2
  const horMid = left + elemWidth / 2

  if (set === 'groundPoints') {
    return {
      point1: getElemFromPoint(left, bottom),
      point2: getElemFromPoint(horMid, bottom),
      point3: getElemFromPoint(right, bottom)
    }
  }

  if (set === 'obstaclePoints') {
    return {
      point1: getElemFromPoint(left - 1, top - 1),
      point2: getElemFromPoint(horMid, top - 1),
      point3: getElemFromPoint(right + 1, top - 1),
      point4: getElemFromPoint(left - 1, verMid),
      point5: getElemFromPoint(right + 1, verMid),
      point6: getElemFromPoint(left - 1, bottom - 1),
      point7: getElemFromPoint(right + 1, bottom - 1)
    }
  }

  if (set === 'coinCollisionPoints') {
    return {
      point1: getElemFromPoint(horMid, verMid)
    }
  }
}

export function isHidden(elem) {
  if (elem.style.display === 'none') {
    return true
  }

  return false
}

export function isVisible(elem, offset = null) {
  const obstaclePoints = getElemsUnderPoints(elem, 'obstaclePoints', offset)
  const keys = Object.keys(obstaclePoints)

  for (let i = 0; i < keys.length; i++) {
    if (!obstaclePoints[keys[i]]) {
      return false
    } else if (shadowArea.includes(obstaclePoints[keys[i]].className)) {
      return false
    }
  }

  return true
}

export function isOnGround(elem) {
  const groundPoints = getElemsUnderPoints(elem, 'groundPoints')
  const keys = Object.keys(groundPoints)

  let isGround = false

  keys.forEach(key => {
    if (!groundPoints[key]) {
      isGround = false
    } else if (groundStatus.includes(groundPoints[key].className)) {
      isGround = true
    }
  })

  return isGround
}

export function hasObstacle(elem, offset = null) {
  const obstaclePoints = getElemsUnderPoints(elem, 'obstaclePoints', offset)
  const keys = Object.keys(obstaclePoints)

  let isObstacle = false

  keys.forEach(key => {
    if (!obstaclePoints[key]) {
      isObstacle = true
    } else {
      if (!notObstacles.includes(obstaclePoints[key].className)) {
        isObstacle = true
      }
    }
  })

  return isObstacle
}

export function alignHero(elem) {
  const coords = findCurCoords(elem)
  const elemHeight = coords.bottom - coords.top

  const groundPoints = getElemsUnderPoints(elem, 'groundPoints')

  const keys = Object.keys(groundPoints)

  keys.forEach(key => {
    const elemUnderCoords = findCurCoords(groundPoints[key])

    domOperations.heroShift(elem, {
      top: elemUnderCoords.top - elemHeight
    })
  })
}
