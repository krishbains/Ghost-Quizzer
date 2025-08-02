import React, { useEffect, useState } from 'react'
import socket from '@/lib/socket';

interface Player {
  playerId: string;
  name: string;
  isHost: boolean;
  score: number;
}

const LeaderBoard = () => {
    const [players, setPlayers] = useState<Player[]>([])
    
    useEffect(() => {
      socket.on("update-scores", (players: Player[]) => {
        console.log('players', players)
        setPlayers(players)
      })
      
      return () => {
        socket.off("update-scores")
      }
    }, [])
    
  return (
    <div className='flex flex-col items-center justify-center p-10'>
      <div className='border-2 border-r-5 border-b-5 border-black bg-amber-200 max-w-md min-h-96 p-10 rounded-md'>
        <h1 className='text-5xl font-bold mb-10'>Leader Board</h1>
          <div>
            {[...players]
              .sort((a, b) => b.score - a.score)
              .map((player) => (
                <div className='flex justify-between' key={player.playerId}>
                  <h2 className='text-2xl font-bold'>{player.name}</h2>
                  <p className='text-2xl font-bold ml-5'>{player.score}</p>
                </div>
              ))}
          </div>
      </div>
    </div>
  )
}

export default LeaderBoard