import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './Cell.css'

export default class Cell extends Component {

  static propTypes = {
    uiState     : PropTypes.object.isRequired,
    value       : PropTypes.string.isRequired,
    onClick     : PropTypes.func.isRequired,
    coords      : PropTypes.object.isRequired
  }

  render () {
    let { uiState } = this.props
    let value = this.props.value !== '0'
      ? this.props.value : ' '

    if (uiState.isRevealed) {
      return (
        <div
          onContextMenu={this._preventDefault}
          className='cell'>
          <div className='cell-value'>
            <p>
              { value }
            </p>
          </div>
        </div>
      )
    }

    return (
      <div
        onContextMenu={this._handleRightClick}
        onClick={this._handleClick}
        className='cell'>

        <div
          className={uiState.isFlagged
            ? 'cell-button cell-button--active' : 'cell-button'} />
          
      </div>
    )
  }

  _handleClick = () => {
    if (!this.props.uiState.isFlagged) {
      this.props.onClick(this.props.coords, 'reveal')
    }
  }

  _handleRightClick = (event) => {
    event.preventDefault()
    this.props.onClick(this.props.coords, 'flag')
  }

  _preventDefault = (event) => {
    event.preventDefault()
  }
}