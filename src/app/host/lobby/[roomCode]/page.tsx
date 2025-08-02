interface Props {
  params: { roomCode: string };
}

export default function HostLobby({ params }: Props) {
  return (
    <div>
      <h1>Host Lobby - Room: {params.roomCode}</h1>
      <p>Players joining the quiz will appear here.</p>
    </div>
  );
}