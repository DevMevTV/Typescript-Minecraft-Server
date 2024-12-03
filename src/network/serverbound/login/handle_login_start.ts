import { Socket } from "net"
import { decodeVarInt, encodeVarInt } from "../../VarInt"
import { log } from "../../../logApi"
import { sendLoginFinished } from "../../clientbound/login/send_login_finished"

export const handleLoginStart = (packet: Buffer, socket: Socket) => {
    
    let offset = 1  
    const { value: usernameLength, size: usernameLengthSize } = decodeVarInt(packet.subarray(2, 3))
    offset += usernameLengthSize
    offset += 1

    const username = packet.slice(offset, offset + usernameLength).toString("utf-8")
    offset += usernameLength
    const uuid = packet.slice(offset, offset + 16).toString("hex")  
    log(`${username} joined the game with ${uuid} `, "SERVER")

    sendLoginFinished(socket)
  
}
