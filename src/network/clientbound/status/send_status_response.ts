import { error } from "../../../logApi"
import { VERSION, PROTOCOL_VERSION, MAX_PLAYERS, MOTD } from "../../../config"
import { Socket } from "net"
import { encodePacket } from "../../packet"

export const sendStatusResponse = (socket: Socket) => {
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

    const packet = encodePacket(0x00, [statusResponse], true)
    socket.write(packet, (err) => {
      if (err) {
        error(`Failed to send status response: ${err}`, "SERVER")
      }
    })
}