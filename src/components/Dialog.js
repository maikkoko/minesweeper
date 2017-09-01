import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './Dialog.css'

export default class Dialog extends Component {

  static propTypes = {
    isVisible     : PropTypes.bool,
    onClick       : PropTypes.func.isRequired,
    context       : PropTypes.string,
    time          : PropTypes.object
  }

  render () {
    let { context, isVisible, time } = this.props
    let display = null
    switch (context) {
      case 'WIN':
        display = (
          <div>
            <p className='dialog-content-text'>
              Congratulations! You Win!
            </p>
            <p className='dialog-content-time'>
              Time: { time ? time.format('mm:ss.SS') : '' }
            </p>
          </div>
        )
        break
      case 'GAMEOVER':
        display = (
          <div>
            <p className='dialog-content-text' style={{ marginTop: '50px' }}>
              You stepped on a bomb! Game Over!
            </p>
          </div>
        )
        break
      default:
        break
    }

    return (
      <div className={ isVisible ? 'dialog' : 'dialog--hidden' }>
        <div className='dialog-content'>
          
          { display }
          
          <div
            onClick={this.props.onClick}
            className='dialog-button game-button'>
            <p>Confirm</p>
          </div>
        </div>
      </div>
    )
  }
}