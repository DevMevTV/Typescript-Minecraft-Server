import { handleLoginData } from "./handle_login_data"
import { handleLoginStart } from "./handle_login_start"

export const handleLogin = (socket, packet) => {
    const packetId = packet[0]

    if (packetId == 0x10) {
        handleLoginStart(packet, socket)
    } else if (packetId == 0x1a || packetId == 0x19) {
        handleLoginData(packet, socket)
    }
}