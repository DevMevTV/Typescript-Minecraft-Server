import { error } from "../../../logApi"
import { knownPacks } from "../../clientbound/configuration/known_packs"
import { handleLoginAcknowledged } from "./handle_login_acknowledged"
import { handleLoginStart } from "./handle_login_start"

export const handleLogin = (socket, packet) => {
    const packetId = packet[0]

    if (packetId == 0x1a) { // Login Start
        handleLoginStart(packet, socket)
    } else if (packetId == 0x01) {
        handleLoginAcknowledged()
        knownPacks(socket)
    } else {
        error(`UNEXPECTED PACKET FOUND IN LOGIN: \n PacketId:${packetId} \n Packet:${packet}`, "SERVER")
        console.log(packet)
    }
}