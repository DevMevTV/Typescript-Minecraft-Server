import { Socket } from "net"
import { encodeVarInt } from "../../VarInt"
import { error } from "../../../logApi"
import { encodeString } from "../../netString"
import { encodePacket } from "../../packet"

export const sendLoginFinished = (socket: Socket) => {
    const uuid = Buffer.from("8667ba71b85a4004af54457a9734eed7", "hex")
    const username = "Steve"

    const propertiesCount = 0
    const strictErrorHandling = 0

    
    const packetData = [
        uuid,
        username,
        propertiesCount,
        strictErrorHandling,
    ]

    const packet = encodePacket(0x02, packetData)
    socket.write(packet, (err) => {
        if (err) {
            error(`Failed to send Login Success: ${err}`, "SERVER")
        }
    })
}
