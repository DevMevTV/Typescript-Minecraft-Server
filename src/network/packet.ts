import { encodeString } from "./netString"
import { decodeVarInt, encodeVarInt } from "./VarInt"

export const encodePacket = (packetId: number, packet: Array<any>, includeId?: boolean) => {
    let data: Buffer = Buffer.from([])

    packet.forEach((value) => {
        if (Buffer.isBuffer(value)) {
            data = Buffer.concat([data, value])
        } else if (typeof value === "string") {
            data = Buffer.concat([data, encodeString(value)])
        } else if (typeof value === "number") {
            data = Buffer.concat([data, Buffer.from([value])])
        } else if (typeof value === "object") {
            const jsonBuffer = Buffer.from(JSON.stringify(value), "utf-8")
            const lengthBuffer = encodeVarInt(jsonBuffer.length)
            data = Buffer.concat([data, lengthBuffer, jsonBuffer])
        }
    })

    const packetIdBuffer = Buffer.from([packetId])
    const fullDataBuffer = Buffer.concat([packetIdBuffer, data])
    const lengthBuffer = encodeVarInt(includeId ? fullDataBuffer.length : fullDataBuffer.length - 1)

    return Buffer.concat([lengthBuffer, fullDataBuffer])
}


export const readPacketLength = (buffer: Buffer) => {
    const { value: packetLength, size: varIntSize } = decodeVarInt(buffer);
    return { packetLength, varIntSize };
};