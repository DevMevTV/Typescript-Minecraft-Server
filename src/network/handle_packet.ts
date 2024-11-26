import { log, error } from "../logApi"
import { Socket } from "net";

import { handleStatusRequest } from "./handle_status_request";
import { handlePingRequest } from "./handle_ping_request";
import { handleLegacyPing } from "./handle_legacy_ping";
import { handleLoginStart } from "./handle_login_start";

enum PacketIDs {
    LegacyPing = 0xFE,
    StatusRequest = 0x10,
    PingRequest = 0x09
}
  
enum ConnectionState {
    Handshake = 0,
    Status = 1,
    Login = 2,
}

const clients = new Map<Socket, ConnectionState>();

export const handlePacket = (packet: Buffer, socket: Socket) => {
  const state = packet[packet.length - 1] || ConnectionState.Status;
  const packetId = packet[0];

  if (packetId == 0x10) {
    console.log(packet)
    log(packet.toString(), "DEBUG")
  }

  if (state === ConnectionState.Status && packetId === PacketIDs.StatusRequest) {
    handleStatusRequest(socket);
  } else if (packetId === 0x1a) {
    handleLoginStart(packet, socket)
  } else if (packetId === PacketIDs.PingRequest) {
    handlePingRequest(packet, socket);
  } else if (packetId == PacketIDs.LegacyPing) {
    handleLegacyPing(socket);
  } else if (packetId == 0x01) {
    // Not implemented; dont know what it is
  } else {
    error(`Unexpected packet ID: 0x${packetId.toString(16)}`, "SERVER");
    error(`Received data: ${packet.toString("utf-8")}`, "SERVER");
  }
};