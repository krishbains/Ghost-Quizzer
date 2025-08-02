// Connect to your local Socket.IO server
import { io } from "socket.io-client"

// This runs in the browser, not server
// const socket = io("http://localhost:4000") // Same port as your backend
const socket = io('https://ghost-quizzer.onrender.com/')

export default socket
