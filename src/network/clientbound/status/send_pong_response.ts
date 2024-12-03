import { Socket } from "net"

export const sendPongResponse = (socket: Socket, packet: Buffer) => {
    socket.write(packet)
}