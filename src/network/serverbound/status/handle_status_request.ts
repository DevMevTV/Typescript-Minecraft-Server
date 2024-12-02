import { Socket } from "net"
import { encodeVarInt } from "../../VarInt"
import { error } from "../../../logApi"
import { VERSION, PROTOCOL_VERSION, MAX_PLAYERS, MOTD } from "../../../config"

export const handleStatusRequest = (socket: Socket) => {
    const statusResponse = {
      version: {
        name: VERSION,
        protocol: PROTOCOL_VERSION,
      },
      players: {
        max: MAX_PLAYERS,
        online: 2,
        sample: [
          { name: "Steve", id: "8667ba71-b85a-4004-af54-457a9734eed7" },
          { name: "Alex", id: "7a3f575e-c85f-4ff2-92da-dc18a78cb7465" },
        ],
      },
      description: {
        text: MOTD,
      },
      enforcesSecureChat: false,
    }
  
    const jsonString = JSON.stringify(statusResponse)
    const jsonBuffer = Buffer.from(jsonString, "utf-8")
  
    const packetIdBuffer = Buffer.from([0x00])
    const jsonLengthBuffer = encodeVarInt(jsonBuffer.length)
    const fullDataBuffer = Buffer.concat([packetIdBuffer, jsonLengthBuffer, jsonBuffer])
  
    const lengthBuffer = encodeVarInt(fullDataBuffer.length)
    const responseBuffer = Buffer.concat([lengthBuffer, fullDataBuffer])
  
    socket.write(responseBuffer, (err) => {
      if (err) {
        error(`Failed to send status response: ${err}`, "SERVER")
      }
    })
  }