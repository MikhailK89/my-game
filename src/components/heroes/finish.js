import {domOperations} from '../../index'
import {game} from '../../index'

export class Finish {
  props = {
    className: 'finish'
  }

  finishActivated = false

  constructor(addProps = null) {
    this.elem = domOperations.createElem('div', this.props)

    if (addProps) {
      domOperations.applyProps(this.elem, addProps)
    }
  }

  activateFinish() {
    this.elem.style.display = 'block'

    domOperations.applyProps(this.elem, {
      style: {
        right: -1 * game.scrollLeft + 'px',
        top: game.scrollTop + 'px',
        height: 100 + '%'
      }
    })
  }

  animate() {
    if (domOperations.leftScrollDone() && !this.finishActivated) {
      this.finishActivated = true
      this.activateFinish()
    }
  }
}
