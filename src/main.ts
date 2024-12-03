import { createServer, Socket } from "net"
import { log, error } from "./logApi"
import { handlePacket, ConnectionState } from "./network/handle_packet"
import { PORT } from "./config"

let nextSocketId = 0
const reusableIds: number[] = []
global.sockets = {}

const server = createServer((socket: Socket) => {
  let socketId: number

  if (reusableIds.length > 0) {
    socketId = reusableIds.pop()!
  } else {
    socketId = nextSocketId++
  }

  global.sockets[socketId] = { NextState: ConnectionState.Handshake}

  socket.on("data", (clientData: Buffer) => {
    global.currentSocketId = socketId
    handlePacket(clientData, socket)
  })

  socket.on("end", () => {
    delete global.sockets[socketId]
    reusableIds.push(socketId)
    //log("connection closed", "SERVER")
  })

  socket.on("error", (err) => {
    error("Socket error: " + err, "SERVER")
  })
})

log("Starting server...", "SERVER")
server.listen(PORT, "0.0.0.0", () => {
  log("Server running on port 25565", "SERVER")
})