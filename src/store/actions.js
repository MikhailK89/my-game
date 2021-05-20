import {GAME_OVER, GAME_START, GAME_RESTART, COINS_TOTAL, COINS_COLLECT} from '../store/types'

export function gameIsOver(data) {
  return {
    type: GAME_OVER,
    data
  }
}

export function gameIsStarted(data) {
  return {
    type: GAME_START,
    data
  }
}

export function restartIsActivated(data) {
  return {
    type: GAME_RESTART,
    data
  }
}

export function totalCoins(data) {
  return {
    type: COINS_TOTAL,
    data
  }
}

export function collectedCoins(data) {
  return {
    type: COINS_COLLECT,
    data
  }
}
