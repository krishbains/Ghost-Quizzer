"use client"
import { Button } from "@/components/ui/button";
import { customAlphabet } from 'nanoid'
import { useRouter } from "next/navigation";



export default function CreateQuiz() {
  const router = useRouter()

  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  const nanoid = customAlphabet(alphabet, 6)

  const handleClick = () => {
  const roomCode = nanoid() // e.g. "4XJ7KQ"
  console.log(roomCode)
  router.push(`/host/game/${roomCode}`)
}
  return (
    <div>
      <h1>Create a New Quiz</h1>
      <p>Host can create and configure their quiz here.</p>
      <Button className="hover:bg-slate-700" onClick={handleClick} type="submit">
        Create Quiz
      </Button>
    </div>
  );
}