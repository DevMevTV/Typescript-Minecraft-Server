import { Socket } from "net";
import { ConnectionState } from "../handle_packet";
import { decodeString } from "../netString";
import { decodeVarInt } from "../VarInt";
import { handleLoginStart } from "./login/handle_login_start";
import { handleStatusRequest } from "./status/handle_status_request";

export const handleHandshake = (socket: Socket, packet: Buffer) => {
    const socketId = global.currentSocketId

    const Protocol_Version_Data = Buffer.concat([Buffer.from([packet[2]]), Buffer.from([packet[3]])])
    const Server_Adress_Data = decodeString(packet, 4)
    
    const Protocol_Version = decodeVarInt(Protocol_Version_Data).value
    const Server_Adress = Server_Adress_Data.value
    const Server_Port = packet.readUInt16BE(Server_Adress_Data.offset)
    const Next_State = packet[Server_Adress_Data.offset + 2]

    global.sockets[socketId].Data = {Protocol_Version: Protocol_Version, Server_Adress: Server_Adress, Server_Port: Server_Port}
    global.sockets[socketId].NextState = Next_State as ConnectionState


    if (Next_State == 1) {
        handleStatusRequest(socket)
    } else if (Next_State == 2) {
        const offset = Server_Adress_Data.offset + 3
        if (packet[offset] == 0x1a) {
            handleLoginStart(packet.slice(offset, packet.length-1), socket)
        }
    }
}
