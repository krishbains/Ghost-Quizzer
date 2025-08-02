'use client'
import GameRoom from "@/components/GameRoom";
import { useEffect, useState } from "react";

interface Props {
  params: { roomCode: string };
}

export default function PlayerGame({ params }: Props) {
  const [playerName, setPlayerName] = useState('')

  useEffect(() => {
    const name = localStorage.getItem('playerName')
    if (name) setPlayerName(name)
  }, [])

  if (!playerName) return <div>Loading...</div>; // Wait until playerName is loaded

  return (
    <div>
      <GameRoom roomCode={params.roomCode} playerName={playerName} isHost={false} />
    </div>
  );
}