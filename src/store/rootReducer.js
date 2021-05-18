import {GAME_OVER} from './types'

export function rootReducer(state, action) {
  switch (action.type) {
    case GAME_OVER:
      return {
        ...state,
        gameIsOver: action.data
      }
    default:
      return {...state}
  }
}
