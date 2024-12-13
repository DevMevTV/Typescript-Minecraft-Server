import { Socket } from "net"
import { error } from "../../../logApi"
import { finishConfiguration } from "../../clientbound/configuration/finish_configuration"

export const handleConfiguration = (socket: Socket, packet: Buffer) => {
    const packetId = packet[1]

    if (packetId == 0x00) { // Client Information, ignoring for now
    } else if (packetId == 0x02) { // Plugin Message, ignoring for now
    } else if (packetId == 0x07) { // Dont really know what it is, comes after clientbound known packs
        finishConfiguration(socket)
    } else {
        error(`UNEXPECTED PACKET FOUND IN CONFIGURATION: \n PacketId:${packetId} \n Packet:${packet}`, "SERVER")
        console.log(packet)
    }
}