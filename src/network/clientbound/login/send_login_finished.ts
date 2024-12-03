import { Socket } from "net";
import { encodeVarInt } from "../../VarInt";
import { error } from "../../../logApi";
import { encodeString } from "../../netString";

export const sendLoginFinished = (socket: Socket) => {
    const uuid = Buffer.from("8667ba71b85a4004af54457a9734eed7", "hex");
    const username = "Steve";
    const usernameBuffer = encodeString(username);

    const propertiesCount = encodeVarInt(0); // Empty properties array
    const strictErrorHandling = Buffer.from([0]); // Set to false (0)

    const packetId = Buffer.from([0x02]);
    const combinedBuffer = Buffer.concat([
        uuid,
        usernameBuffer,
        propertiesCount,
        strictErrorHandling,
    ]);

    const packetLength = encodeVarInt(combinedBuffer.length);
    const fullDataBuffer = Buffer.concat([packetLength, packetId, combinedBuffer]);

    socket.write(fullDataBuffer, (err) => {
        if (err) {
            error(`Failed to send Login Success: ${err}`, "SERVER");
        }
    });
};
