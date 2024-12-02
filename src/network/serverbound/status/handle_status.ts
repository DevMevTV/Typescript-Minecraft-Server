import { handleLegacyStatusRequest } from "./handle_legacy_status_request"
import { handlePingRequest } from "./handle_ping_request"
import { handleStatusRequest } from "./handle_status_request"

export const handleStatus = (socket, packet) => {
    const packetId = packet[0]

    if (packetId == 0x10) { // Status Request
        handleStatusRequest(socket)
    } else if (packetId == 0xff) { // Legacy Status Request
        handleLegacyStatusRequest(socket)
    } else if (packetId == 0x09) { // Ping Request
        handlePingRequest(packet, socket)
    }
}