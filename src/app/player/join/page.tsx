'use client'
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PlayerJoin() {
  const router = useRouter()
  const [roomCode, setRoomCode] = useState('')
  const [name, setName] = useState('')
  const handleSubmit = ()=> {
    if (!roomCode) {
      console.log('Please enter a room code')
      return
    }
    localStorage.setItem('playerName', name) //storing names in local storage for client view only
    router.push(`/player/game/${roomCode}`)
    
  }
  return (
    <div>
      <h1>Join Quiz</h1>
      <p>Enter your name</p>
      <input type="text" placeholder="Bingu" value={name} onChange={(e) => setName(e.target.value)} />
      <p>Enter room code to join a quiz.</p>
      <input type="text" placeholder="Room Code" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} />
      <Button type="submit" onClick={handleSubmit}>Join</Button>
    </div>
  );
}