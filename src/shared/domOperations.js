import {game} from '../index'

export class DomOperations {
  applyProps(elem, props) {
    const keys = Object.keys(props)

    if (keys.length) {
      keys.forEach(key => {
        if (typeof elem[key] === 'object') {
          this.applyProps(elem[key], props[key])
        } else {
          elem[key] = props[key]
        }
      })
    }
  }

  heroShift(elem, coords) {
    const keys = Object.keys(coords)

    const res = {}

    keys.forEach(key => {
      if (key === 'left') {
        res['left'] = coords['left'] + game.scrollLeft + 'px'
      }

      if (key === 'top') {
        res['top'] = coords['top'] + game.scrollTop + 'px'
      }
    })

    if (Object.keys(res).length === 0) {
      return
    }

    this.applyProps(elem, {
      style: {
        ...res
      }
    })
  }

  createElem(type = 'div', props = {}) {
    const elem = document.createElement(type)
    this.applyProps(elem, props)

    return elem
  }

  insertElem(elem, parent) {
    parent.append(elem)
  }

  scrollScreen(x, y) {
    game.scrollLeft += x
    game.scrollTop += y
  }

  centerElem(elem) {
    this.applyProps(elem, {
      style: {
        left: game.offsetWidth / 2 + game.scrollLeft + 'px',
        top: game.offsetHeight / 2 + game.scrollTop + 'px',
        marginLeft: -1 * (elem.offsetWidth / 2) + 'px',
        marginTop: -1 * (elem.offsetHeight / 2) + 'px'
      }
    })
  }

  resetScroll() {
    game.scrollLeft = 0
    game.scrollTop = 0
  }

  leftScrollDone() {
    const maxScrollLeft = game.scrollWidth - game.clientWidth

    if (Math.ceil(game.scrollLeft) >= maxScrollLeft) {
      return true
    }

    return false
  }
}
