import { Socket } from "net"
import { encodePacket } from "../../packet"
import { encodeVarInt } from "../../VarInt"
import { encodeString } from "../../netString"

export const knownPacks = (socket: Socket) => {
    const packs = [
        {
            namespace: "minecraft",
            id: "core",
            version: "1.21"
        }
    ]

    let data = encodeVarInt(packs.length)

    packs.forEach((pack) => {
        data = Buffer.concat([
            data,
            encodeString(pack.namespace),
            encodeString(pack.id),
            encodeString(pack.version),
        ])
    });

    const packet = encodePacket(0x0E, [data], true)
    socket.write(packet)
}
