import { ConnectionState } from "../../handle_packet"

export const handleLoginAcknowledged = () => {
    global.sockets[global.currentSocketId].NextState = ConnectionState.Configuration
}