import {domOperations} from '../index'

export function findCurCoords(elem) {
  const rect = elem.getBoundingClientRect()
  return {
    left: rect.left,
    right: rect.right,
    top: rect.top,
    bottom: rect.bottom
  }
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
      point1: document.elementFromPoint(left, bottom),
      point2: document.elementFromPoint(horMid, bottom),
      point3: document.elementFromPoint(right, bottom)
    }
  }

  if (set === 'obstaclePoints') {
    return {
      point1: document.elementFromPoint(left - 1, top - 1),
      point2: document.elementFromPoint(horMid, top - 1),
      point3: document.elementFromPoint(right + 1, top - 1),
      point4: document.elementFromPoint(left - 1, verMid),
      point5: document.elementFromPoint(right + 1, verMid),
      point6: document.elementFromPoint(left - 1, bottom - 1),
      point7: document.elementFromPoint(horMid, bottom - 1),
      point8: document.elementFromPoint(right + 1, bottom - 1)
    }
  }
}

export function isOnGround(elem) {
  const groundPoints = getElemsUnderPoints(elem, 'groundPoints')
  const keys = Object.keys(groundPoints)

  const groundStatus = ['ground', 'wall']

  let isGround = false

  keys.forEach(key => {
    if (groundStatus.includes(groundPoints[key].className)) {
      isGround = true
    }
  })

  return isGround
}

export function hasObstacle(elem, offset = null) {
  const obstaclePoints = getElemsUnderPoints(elem, 'obstaclePoints', offset)
  const keys = Object.keys(obstaclePoints)

  const notObstacles = ['air', 'player']

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
    const elemUnder = groundPoints[key]
    const rect = elemUnder.getBoundingClientRect()

    domOperations.heroShift(elem, {
      top: rect.top - elemHeight
    })
  })
}
