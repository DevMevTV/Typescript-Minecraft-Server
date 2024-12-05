import { error } from "../../../logApi"
import { handleLegacyStatusRequest } from "./handle_legacy_status_request"
import { handlePingRequest } from "./handle_ping_request"
import { handleStatusRequest } from "./handle_status_request"

export const handleStatus = (socket, packet) => {
    const packetId = packet[1]

    if (packetId == 0x00) { // Status Request
        handleStatusRequest(socket)
    } else if (packetId == 0xff) { // Legacy Status Request
        handleLegacyStatusRequest(socket)
    } else if (packetId == 0x01) { // Ping Request
        handlePingRequest(packet, socket)
    } else {
        error(`UNEXPECTED PACKET FOUND IN STATUS: \n PacketId:${packetId} \n Packet:${packet}`, "SERVER")
        console.log(packet)
    }
}