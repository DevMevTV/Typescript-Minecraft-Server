import { Socket } from "net"
import { sendStatusResponse } from "../../clientbound/status/send_status_response"

export const handleStatusRequest = (socket: Socket) => {
    sendStatusResponse(socket)
}