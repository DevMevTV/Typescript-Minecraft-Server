import { error } from "../../../logApi"

export const handleConfiguration = (socket, packet) => {
    const packetId = packet[0]

    if (packetId == 0x0f) { // Client Information, ignoring for now
    } else if (packetId == 0x19) { // Plugin Message, ignoring for now
    } else {
        error(`UNEXPECTED PACKET FOUND IN CONFIGURATION: \n PacketId:${packetId} \n Packet:${packet}`, "SERVER")
        console.log(packet)
    }
}