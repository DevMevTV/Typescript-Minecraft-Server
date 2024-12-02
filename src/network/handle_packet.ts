import { error } from "../logApi"
import { Socket } from "net"

import { handleStatus } from "./serverbound/status/handle_status"
import { handleLogin } from "./serverbound/login/handle_login"
  
export enum ConnectionState {
    Handshake = 0,
    Status = 1,
    Login = 2,
}

global.sockets = {}

export const handlePacket = (packet: Buffer, socket: Socket, socketId: number) => {
  let nextState = global.sockets[socketId].NextState

  if (nextState == ConnectionState.Handshake) {
    nextState = ConnectionState.Status
    global.sockets[socketId].NextState = ConnectionState.Status
  }

  if (nextState == ConnectionState.Status) {
    if(packet[packet.length - 1] == 2) {
      nextState = ConnectionState.Login
      global.sockets[socketId].NextState = ConnectionState.Login
    }

    if (nextState == ConnectionState.Status) {
      handleStatus(socket, packet)
    }
  }

  if (nextState == ConnectionState.Login) {
    handleLogin(socket, packet)
  }
}