import React, { Component } from 'react'
import PropTypes from 'prop-types'

import BombImage from './BombImage'
import './Cell.css'

export default class Cell extends Component {

  static propTypes = {
    uiState     : PropTypes.object.isRequired,
    value       : PropTypes.string.isRequired,
    onClick     : PropTypes.func.isRequired,
    coords      : PropTypes.object.isRequired
  }

  render () {
    let { uiState, value } = this.props

    let display
    switch (value) {
      case '0':
        display = <p>&nbsp;</p>
        break
      case '*':
        display =
          <BombImage
            fill='#000'
            width={18} />
        break
      default:
        display = <p>{value}</p>
        break
    }

    if (uiState.isRevealed) {
      return (
        <div
          onContextMenu={this._preventDefault}
          className='cell'>
          <div className='cell-value'>
            { display }
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