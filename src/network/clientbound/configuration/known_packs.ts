import { encodeString } from "../../netString";
import { encodeVarInt } from "../../VarInt";
import { finishConfiguration } from "./finish_configuration";

export const knownPacks = (socket) => {
    const pack = {
        namespace: "minecraft",
        id: "core",
        version: "1.21"
    };

    const packetId = encodeVarInt(0x0E);

    const packsCount = encodeVarInt(1);

    const namespace = encodeString(pack.namespace);
    const id = encodeString(pack.id);
    const version = encodeString(pack.version);
    const packsData = Buffer.concat([namespace, id, version]);

    const packetData = Buffer.concat([packsCount, packsData]);

    const packetLength = encodeVarInt(packetId.length + packetData.length);

    const result = Buffer.concat([packetLength, packetId, packetData]);

    socket.write(result);
};
