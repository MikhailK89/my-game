export class TrackScroll {
  subs = []

  constructor(game) {
    this.game = game
    this.scrollHandler = this.scrollHandler.bind(this)
    this.init()
  }

  init() {
    this.game.addEventListener('scroll', this.scrollHandler)
  }

  destroy() {
    this.game.removeEventListener('scroll', this.scrollHandler)
  }

  scrollHandler() {
    const scrollCoords = {
      x: this.game.scrollLeft,
      y: this.game.scrollTop
    }

    if (this.subs.length > 0) {
      this.subs.forEach(s => s(scrollCoords))
    }
  }

  subscribe(f) {
    this.subs.push(f)
  }

  unsubscribe(f) {
    this.subs = this.subs.filter(s => s !== f)
  }
}
