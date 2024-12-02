import { log } from "../../../logApi"
import { decodeVarInt, encodeVarInt } from "../../VarInt"


export const handleLoginData = (packet, socket) => {
    let offset = 1

    const { value: usernameLength, size: usernameLengthSize } = decodeVarInt(packet.slice(2, 3))
    offset += usernameLengthSize
    offset += 1
    
    const username = packet.slice(offset, offset + usernameLength).toString("utf-8")
    offset += usernameLength

    const uuid = packet.slice(offset, offset + 16).toString("hex")

    log(`${username} joined the game with ${uuid} `, "SERVER")
}