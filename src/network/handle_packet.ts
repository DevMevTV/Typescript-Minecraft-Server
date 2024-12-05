import { Socket } from "net"

import { handleStatus } from "./serverbound/status/handle_status"
import { handleLogin } from "./serverbound/login/handle_login"
import { handleHandshake } from "./serverbound/handle_handshake"
import { handleConfiguration } from "./serverbound/configuration/handle_configuration"

export enum ConnectionState {
    Handshake = 0,
    Status = 1,
    Login = 2,
// Other
    Configuration = 3, 
}

export const handlePacket = (packet: Buffer, socket: Socket) => {
    const socketId = global.currentSocketId
    let nextState: ConnectionState = global.sockets[socketId].NextState

    switch(nextState) {
        case ConnectionState.Handshake: {handleHandshake(socket, packet); break}
        case ConnectionState.Status: {handleStatus(socket, packet); break}
        case ConnectionState.Login: {handleLogin(socket, packet); break}
        case ConnectionState.Configuration: {handleConfiguration(socket, packet); break}
    }
}