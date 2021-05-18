import './styles/style.scss'
import './styles/items.scss'

import * as worldSettings from './settings/worldSettings'
import {DomOperations} from './shared/domOperations'
import {TrackScroll} from './shared/trackScroll'
import {TrackKeys} from './shared/trackKeys'
import {GameManager} from './components/game/gameManager'
import {createStore} from './store/createStore'
import {rootReducer} from './store/rootReducer'
import {initialState} from './store/initialState'

export const domOperations = new DomOperations()
export const game = document.querySelector('.game')

export const trackKeys = new TrackKeys(worldSettings.arrowCodes)
export const trackScroll = new TrackScroll(game)

export const store = createStore(rootReducer, initialState)

const gameManager = new GameManager()

gameManager.createGame()
