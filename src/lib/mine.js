/*
 * Mine Field Generator Class
 */

export const BEGINNER = 'beginner'
export const INTERMEDIATE = 'intermediate'
export const EXPERT = 'expert'

export class Map {

  constructor (difficulty) {
    switch (difficulty) {
      case BEGINNER:
        this.width = 9
        this.height = 9
        this.mines = 10
        break
      
      case INTERMEDIATE:
        this.width = 16
        this.height = 16
        this.mines = 40
        break

      case EXPERT:
        this.width = 30
        this.height = 16
        this.mines = 99
        break

      default:
        this.width = 9
        this.height = 9
        this.mines = 10
        break
    }

    this.field = null // Create mine field (will serve as the map/board reference)
    this.reset() // Clears all
    this.plantMines() // Randomly adds mines to field
  }

  reset () {
    let mineField = new Array(this.height);

    for (let row = 0; row < this.height; row++) {
      mineField[row] = new Array(this.width)
      for (let col = 0; col < this.width; col++) {
        mineField[row][col] = ' '
      }
    }

    this.field = mineField
  }

  plantMines () {
    let minesPlanted = 0

    while (minesPlanted < this.mines) {
      let plantedRow = getRandomInt(this.height)
      let plantedCol = getRandomInt(this.width)

      // Ensure no mine is planted on coordinate
      if (this.field[plantedRow][plantedCol] !== '*') {
        this.field[plantedRow][plantedCol] = '*'
        minesPlanted++;
      }
    }

    this.plantHints()
    
  }

    
  plantHints () {
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        if (this.field[row][col] !== '*') {
          this.field[row][col] = this.getMinesNear(row, col)
        }
      }
    }
  }

  getMinesNear (row, col) {
    let neighbors = 0

    // Check all directions for mines
    neighbors += this.hasMine(row - 1, col - 1) // NW
    neighbors += this.hasMine(row - 1, col)     // NW
    neighbors += this.hasMine(row - 1, col + 1) // NE
    neighbors += this.hasMine(row, col + 1)     // E
    neighbors += this.hasMine(row + 1, col + 1) // SE
    neighbors += this.hasMine(row + 1, col)     // S
    neighbors += this.hasMine(row + 1, col - 1) // SW
    neighbors += this.hasMine(row, col - 1)     // W

    return neighbors
  }

  hasMine (row, col) {
    // Check if out of bounds
    if (row >= 0 && row < this.height && col >= 0 && col < this.width) {
      // Return true if coordinate has mine
      if (this.field[row][col] === '*') {
        return 1
      }

      return 0
    }

    return 0
  }

  getMineField () {
    return this.field
  }

  getBoardDetails () {
    return {
      width: this.width,
      height: this.height,
      mines: this.mines
    }
  }

}

function getRandomInt (max) {
  let min = 0
  return Math.floor(Math.random() * (max - min)) + min;
}