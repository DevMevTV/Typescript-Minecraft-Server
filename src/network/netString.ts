import { encodeVarInt } from "./VarInt"

export const encodeString = (value: string): Buffer => {
    const utf8Buffer = Buffer.from(value, 'utf8')
    const lengthVarInt = encodeVarInt(utf8Buffer.length)
    return Buffer.concat([lengthVarInt, utf8Buffer])
}