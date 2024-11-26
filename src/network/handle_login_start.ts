import { Socket } from "net";
import { log, error } from "../logApi";
import { encodeVarInt } from "./VarInt";

export const handleLoginStart = (packet: Buffer, socket: Socket) => {
  const uuid = Buffer.from("8667ba71b85a4004af54457a9734eed7", "hex");
  const username = "Steve";
  const usernameBuffer = Buffer.from(username, "utf-8");
  const usernameLength = encodeVarInt(usernameBuffer.length);

  const propertiesArray = Buffer.from([0]);
  const strictErrorHandling = Buffer.from([0]);

  const combinedBuffer = Buffer.concat([
      uuid,
      usernameLength,
      usernameBuffer,
      propertiesArray,
      strictErrorHandling,
  ]);

  const packetId = Buffer.from([0x02]);
  const packetLength = encodeVarInt(combinedBuffer.length);
  const fullDataBuffer = Buffer.concat([packetLength, packetId, combinedBuffer]);

  socket.write(fullDataBuffer, (err) => {
      if (err) {
          error(`Failed to send Login Success: ${err}`, "SERVER");
      }
  });
};