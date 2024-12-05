import { decodeVarInt, encodeVarInt } from "./VarInt"

export const encodeString = (value: string): Buffer => {
    const utf8Buffer = Buffer.from(value, 'utf8')
    const lengthVarInt = encodeVarInt(utf8Buffer.length)
    return Buffer.concat([lengthVarInt, utf8Buffer])
}

export const decodeString = (buffer: Buffer, offset: number): { value: string; offset: number } => {
    const { value: length, size } = decodeVarInt(buffer.subarray(offset))
    const stringStart = offset + size
    const stringBuffer = buffer.subarray(stringStart, stringStart + length)
    return { value: stringBuffer.toString('utf8'), offset: stringStart + length }
}