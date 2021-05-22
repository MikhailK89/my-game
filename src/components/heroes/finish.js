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

    this.checkScreenScroll = this.checkScreenScroll.bind(this)
  }

  checkScreenScroll(scrollCoords) {
    if (this.finishActivated) {
      domOperations.applyProps(this.elem, {
        style: {
          right: -1 * scrollCoords.x + 'px',
          top: scrollCoords.y + 'px'
        }
      })
    }
  }

  activateFinish() {
    this.finishActivated = true
    this.elem.style.display = 'block'
  }

  animate() {
    if (domOperations.leftScrollDone() && !this.finishActivated) {
      this.activateFinish()
    }
  }
}
