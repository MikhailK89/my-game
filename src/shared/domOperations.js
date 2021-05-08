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

    const res = keys.reduce((obj, key) => {
      return {
        ...obj,
        [key]: coords[key] + 'px'
      }
    }, {})

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
}
