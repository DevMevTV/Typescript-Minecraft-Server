import { log, error } from "../logApi"
import { Socket } from "net";

import { handleStatusRequest } from "./handle_status_request";
import { handlePingRequest } from "./handle_ping_request";
import { handleLegacyPing } from "./handle_legacy_ping";

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
    const state = clients.get(socket) || ConnectionState.Handshake;
    const packetId = packet[0];

     if (state === ConnectionState.Handshake && packetId === PacketIDs.StatusRequest) {
      log("Modern status request detected", "SERVER");

      handleStatusRequest(socket);
    } else if (packetId === PacketIDs.PingRequest) {
      log("Ping request detected", "SERVER");

      handlePingRequest(packet, socket);
    } else if (packetId == PacketIDs.LegacyPing) {
      log("Legacy status request detected", "SERVER");

      handleLegacyPing(socket);
    } else {
      error(`Unexpected packet ID: 0x${packetId.toString(16)}`, "SERVER");
      error(`Received data: ${packet.toString("utf-8")}`, "SERVER", true);
    }
};