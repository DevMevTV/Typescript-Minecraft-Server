import { createServer, Socket } from "net"
import { log, error } from "./logApi"
import { handlePacket, ConnectionState } from "./network/handle_packet"
import { PORT } from "./config"
import { readPacketLength } from "./network/packet"
import { encodeVarInt } from "./network/VarInt"

require("./network/packet")

let nextSocketId = 0
const reusableIds: number[] = []
global.sockets = {}

const server = createServer((socket: Socket) => {
  let socketId: number

  socket.setNoDelay()

  if (reusableIds.length > 0) {
    socketId = reusableIds.pop()!
  } else {
    socketId = nextSocketId++
  }

  global.sockets[socketId] = { NextState: ConnectionState.Handshake}

  socket.on("data", (clientData: Buffer) => {
    global.currentSocketId = socketId

    const splitBuffer = (buffer: Buffer) => {
      const length = readPacketLength(buffer).packetLength
      let returnBuffer: Buffer = encodeVarInt(length)

      returnBuffer = buffer.subarray(0, length + 1)
      
      handlePacket(returnBuffer, socket)

      if (length + 1 !== buffer.length) {
        splitBuffer(buffer.subarray(length + 1, buffer.length))
      }
    }

    splitBuffer(clientData)

  })

  socket.on("end", () => {
    delete global.sockets[socketId]
    reusableIds.push(socketId)
  })

  socket.on("error", (err) => {
    error("Socket error: " + err, "SERVER")
  })
})

log("Starting server...", "SERVER")
server.listen(PORT, "0.0.0.0", () => {
  log("Server running on port 25565", "SERVER")
})