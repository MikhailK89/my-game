import {GAME_OVER, GAME_START, GAME_RESTART, COINS_TOTAL, COINS_COLLECT} from './types'

export function rootReducer(state, action) {
  switch (action.type) {
    case GAME_OVER:
      return {
        ...state,
        gameIsOver: action.data
      }
    case GAME_START:
      return {
        ...state,
        gameIsStarted: action.data
      }
    case GAME_RESTART:
      return {
        ...state,
        restartIsActivated: action.data
      }
    case COINS_TOTAL:
      return {
        ...state,
        totalCoins: action.data
      }
    case COINS_COLLECT:
      return {
        ...state,
        collectedCoins: action.data
      }
    default:
      return {...state}
  }
}
