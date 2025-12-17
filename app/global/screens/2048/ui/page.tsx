import React from 'react'
import Score from '../components/score'
import Board from '../components/board'

export const Game2048Screen = () => {
  return (
    <div>
      <header>
        <h1>2048</h1>
        <Score />
      </header>
      <main>
        <Board />
      </main>
    </div>
  )
}
