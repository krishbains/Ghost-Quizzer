import { Server } from "socket.io"
import http from "http"

const server = http.createServer()

const io = new Server(server, {
  cors: {
    origin: "*",
  },
})

interface Player {
  playerId: string;
  name: string;
  isHost: boolean;
  score: number
}
interface Answer {
  playerId: string;
  questionId: string;
  optionId: string;
  correctOptionId: string;
}
interface Room {
  players: Player[];
  currentQuestion: number;
  answers: Answer[];
  showAnswer: boolean;
  quizData?: any; // Add quiz data to room
}

const rooms: { [roomCode: string]: Room } = {}

io.on("connection", (socket) => {
  console.log("✅ A user connected: ", socket.id)

  socket.on("join-room", ({ roomCode, playerName, isHost }) => {
    if (!rooms[roomCode]) {
      rooms[roomCode] = {
        players: [],
        currentQuestion: 0,
        answers: [],
        showAnswer: false
      }
    }
    
    // Check if player already exists in the room
    const existingPlayer = rooms[roomCode].players.find(p => p.playerId === socket.id)
    if (!existingPlayer) {
      rooms[roomCode].players.push({
        playerId: socket.id,
        name: playerName,
        isHost,
        score: 0
      })
    }
    
    socket.join(roomCode)
    console.log(`${playerName} (${isHost ? "host" : "player"}) joined room ${roomCode}`)
    io.to(roomCode).emit("user-joined", { playerName, isHost, playerId: socket.id })
  })

  // Handle player disconnection
  socket.on("disconnect", () => {
    console.log("❌ User disconnected: ", socket.id)
    
    // Remove player from all rooms they were in
    Object.keys(rooms).forEach(roomCode => {
      const room = rooms[roomCode]
      const playerIndex = room.players.findIndex(p => p.playerId === socket.id)
      if (playerIndex !== -1) {
        const player = room.players[playerIndex]
        room.players.splice(playerIndex, 1)
        console.log(`${player.name} left room ${roomCode}`)
        
        // If room is empty, remove it
        if (room.players.length === 0) {
          delete rooms[roomCode]
          console.log(`Room ${roomCode} deleted (empty)`)
        }
      }
    })
  })

  socket.on("quiz-start", (data) => {
    let roomCode: string;
    let quizData: any = null;
    
    // Handle both string (roomCode) and object ({ roomCode, quizData }) formats
    if (typeof data === 'string') {
      roomCode = data;
    } else {
      roomCode = data.roomCode;
      quizData = data.quizData;
    }
    
    console.log(`Starting quiz in room ${roomCode}`)
    
    // Store quiz data in room if provided
    if (quizData && rooms[roomCode]) {
      rooms[roomCode].quizData = quizData;
      console.log(`Quiz data stored for room ${roomCode}:`, quizData.title);
    }
    
    io.to(roomCode).emit("quiz-started", { quizData })
  })

  socket.on("change-question", ({ roomCode, questionIndex }) => {
    console.log(`Changing to question ${questionIndex} in room ${roomCode}`)
    if (rooms[roomCode]) {
      rooms[roomCode].currentQuestion = questionIndex
      rooms[roomCode].showAnswer = false // reset reveal state
    }
    io.to(roomCode).emit("question-changed", { questionIndex })
    io.to(roomCode).emit("answer-visibility-changed", { visible: false }) // Hide answers on question change
  })

  socket.on("toggle-answer-visibility", ({ roomCode, visible }) => {
    if (rooms[roomCode]) {
      rooms[roomCode].showAnswer = visible
    }
    console.log(`Setting answer visibility to ${visible} in room ${roomCode}`)
    io.to(roomCode).emit("answer-visibility-changed", { visible })
  })

  socket.on("submit-answer", ({ roomCode, questionId, optionId, correctOptionId }) => {
    const room = rooms[roomCode]
    if (!room) return

    const player = room.players.find(p => p.playerId === socket.id)
    if (!player) return

    room.answers.push({
      playerId: socket.id,
      questionId,
      optionId,
      correctOptionId
    })
    if (optionId === correctOptionId) {
      player.score += 100
    }
    console.log(`Received answer '${optionId}' for question ${questionId} from ${player.name}, score: ${player.score}`)
  })

  socket.on('reveal-scores', ({roomCode}) => {
    console.log("Received reveal-scores for roomCode:", roomCode, "rooms keys:", Object.keys(rooms));
    const room = rooms[roomCode]
    if (!room) {
      console.log("Room not found for code:", roomCode);
      return;
    }
    io.to(roomCode).emit('update-scores', room.players)
    console.log('reveal-scores', room.players)
    room.answers = []
  })

  socket.on("end-quiz", ({ roomCode }) => {
    console.log(`Ending quiz in room ${roomCode}`)
    if (rooms[roomCode]) {
      // Emit final scores to all players
      io.to(roomCode).emit('update-scores', rooms[roomCode].players)
      
      // Emit quiz-ended event to all players in the room
      io.to(roomCode).emit("quiz-ended", { 
        roomCode,
        players: rooms[roomCode].players,
        quizData: rooms[roomCode].quizData
      })
    }
  })
})

server.listen(4000, () => {
  console.log("🚀 Socket.IO server running on port 4000")
})
