import { Socket } from "net"
import { sendLegacyStatusResponse } from "../../clientbound/status/send_legacy_status_response"

export const handleLegacyStatusRequest = (socket: Socket) => {
    sendLegacyStatusResponse(socket)
}