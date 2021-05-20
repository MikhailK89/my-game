export class TrackKeys {
  arrowsState = {}

  constructor(codes) {
    this.codes = codes
    this.pressKeyHandler = this.pressKeyHandler.bind(this)
    this.init()
  }

  init() {
    document.addEventListener('keydown', this.pressKeyHandler)
    document.addEventListener('keyup', this.pressKeyHandler)
  }

  destroy() {
    document.removeEventListener('keydown', this.pressKeyHandler)
    document.removeEventListener('keyup', this.pressKeyHandler)
  }

  pressKeyHandler(event) {
    if (this.codes.hasOwnProperty(event.keyCode)) {
      const down = event.type === 'keydown'
      this.arrowsState[this.codes[event.keyCode]] = down
      event.preventDefault()
    }
  }
}
