import { Socket } from "net"

export const finishConfiguration = (socket: Socket) => {
    socket.write(Buffer.from([0x03]))
}