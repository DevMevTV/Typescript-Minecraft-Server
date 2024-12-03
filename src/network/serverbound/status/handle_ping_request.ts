import { Socket } from "net"
import { sendPongResponse } from "../../clientbound/status/send_pong_response"

export const handlePingRequest = (packet: Buffer, socket: Socket) => {
    sendPongResponse(socket, packet)
}