export const finishConfiguration = (socket) => {
    socket.write(Buffer.from([0x03]))
}