export function createStore(rootReducer, initialState = {}) {
  let state = rootReducer({...initialState}, {type: '__INIT__'})
  let listeners = []

  return {
    subscribe(fn) {
      listeners.push(fn)
      return {
        unsubscribe() {
          listeners = listeners.filter(listener => {
            return listener !== fn
          })
        }
      }
    },
    emit(action, withNotice = true) {
      state = rootReducer(state, action)

      if (withNotice) {
        listeners.forEach(listener => listener(state))
      }
    },
    getState() {
      return JSON.parse(JSON.stringify(state))
    },
    clearListeners() {
      listeners = []
    }
  }
}
