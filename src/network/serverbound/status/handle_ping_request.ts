import { Socket } from "net"

export const handlePingRequest = (packet: Buffer, socket: Socket) => {
    socket.write(packet)
}