import { Socket } from "net"
import { encodeVarInt } from "../../VarInt"

export const handleLoginStart = (packet: Buffer, socket: Socket) => {
    const rawUuid = "717abc37099141589d641e11d199a178"

    const uuid = Buffer.from(rawUuid, "hex")

    const username = "Steve"
    const usernameBuffer = Buffer.from(username, "utf-8")
    const usernameLength = encodeVarInt(usernameBuffer.length)

    const propertiesArray = encodeVarInt(0) // No properties
    const strictErrorHandling = Buffer.from([0])

    const loginSuccessPayload = Buffer.concat([
      uuid,
      usernameLength,
      usernameBuffer,
      propertiesArray,
      strictErrorHandling,
    ])

    const loginSuccessPacketId = Buffer.from([0x02])
    const loginSuccessPacketLength = encodeVarInt(loginSuccessPayload.length)
    const loginSuccessPacket = Buffer.concat([loginSuccessPacketLength, loginSuccessPacketId, loginSuccessPayload])

    socket.write(loginSuccessPacket, (err) => {
      if (err) {
        console.error(`Failed to send Login Success: ${err}`)
        return
      }
    })
}
