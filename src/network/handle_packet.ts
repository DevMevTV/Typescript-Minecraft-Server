import { log, error } from "../logApi"
import { Socket } from "net";
import { decodeVarInt } from "./VarInt";

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


export const handlePacket = (packet: Buffer, socket: Socket) => {
  const state = packet[packet.length - 1] || ConnectionState.Status;
  const packetId = packet[0];

  if (state === ConnectionState.Status && packetId === PacketIDs.StatusRequest) {
    handleStatusRequest(socket);
  } else if (state == ConnectionState.Login && packetId === 0x10) {
    handleLoginStart(packet, socket)
  } else if (packetId === PacketIDs.PingRequest) {
    handlePingRequest(packet, socket);
  } else if (packetId == PacketIDs.LegacyPing) {
    handleLegacyPing(socket);
  } else if (packetId == 0x01) {
    // Not implemented; dont know what it is
  } else if (packetId == 0x1a) {
    let offset = 1;

    const { value: usernameLength, size: usernameLengthSize } = decodeVarInt(packet.slice(2, 3));
    offset += usernameLengthSize;
    offset += 1
    
    const username = packet.slice(offset, offset + usernameLength).toString("utf-8");
    offset += usernameLength;

    const uuid = packet.slice(offset, offset + 16).toString("hex");

    console.log(`Username: ${username}`);
    console.log(`UUID: ${uuid}`);
  } else {
    error(`Unexpected packet ID: 0x${packetId.toString(16)}`, "SERVER");
    error(`Received data: ${packet.toString("utf-8")}`, "SERVER");
    console.log(packet)
    if (packetId === 0x10) { error(`Next State: ${state}`, "SERVER") }
  }
};