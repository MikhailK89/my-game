import {GAME_OVER} from '../store/types'

export function gameOver() {
  return {
    type: GAME_OVER,
    data: true
  }
}
