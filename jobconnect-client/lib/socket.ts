// Socket.io keeps a permanent connection between
// the browser and our server for real-time notifications

import { io, Socket } from "socket.io-client"

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"

// Create one socket instance shared across the whole app
const socket: Socket = io(SOCKET_URL, {
  autoConnect: false, // don't connect until user logs in
})

export default socket