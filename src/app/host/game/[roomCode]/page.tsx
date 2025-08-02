'use client'
import GameRoom from "@/components/GameRoom";
import { Button } from "@/components/ui/button";
import socket from "@/lib/socket";

interface Props {
  params: { roomCode: string };
}

export default function HostGame({ params }: Props) {
  return (
    <div>
      <GameRoom roomCode={params.roomCode} playerName="Host" isHost={true} />
    </div>
  );
}