import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './Dialog.css'

export default class Dialog extends Component {

  static propTypes = {
    isVisible     : PropTypes.bool,
    onClick       : PropTypes.func.isRequired,
    text          : PropTypes.string.isRequired
  }

  render () {
    let { text, isVisible } = this.props
 
    return (
      <div className={ isVisible ? 'dialog' : 'dialog--hidden' }>
        <div className='dialog-content'>
          <p className='dialog-content-text'>{ text }</p>

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