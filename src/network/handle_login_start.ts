import { Socket } from "net";
import { log } from "../logApi";

export const handleLoginStart = (packet: Buffer, socket: Socket) => {
  const usernameLength = packet.readUInt8(1); // Username length is stored in the second byte
  const username = packet.toString('utf8', 2, 2 + usernameLength); // Extract the username string from the buffer
  console.log(username)

  log(`${username} Logging in`, "SERVER");
};