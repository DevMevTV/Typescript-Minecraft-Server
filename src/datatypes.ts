import { encode, decode, Tag } from 'nbt-ts'

export class VarInt {
    public static encode(value: number) {
        const buffer: number[] = []
        let more = true
        while (more) {
          let temp = value & 0x7F
          value >>>= 7
          if (value !== 0) temp |= 0x80
          buffer.push(temp)
          more = value !== 0
        }
        return Buffer.from(buffer)
    }

    public static decode(buffer: Buffer, offset: number = 0) {
        let value = 0
        let position = offset
        let shift = 0
        let byte: number
    
        do {
            if (position >= buffer.length) {
                throw new RangeError("VarInt exceeds buffer length")
            }
    
            byte = buffer[position]
            value |= (byte & 0x7F) << shift
            shift += 7
            position++
        } while ((byte & 0x80) !== 0)
    
        return { value, size: position - offset, offset: position }
    }
    
}


export class NetString {
    public static encode(value: string) {
        const utf8Buffer = Buffer.from(value, 'utf8')
        const lengthVarInt = VarInt.encode(utf8Buffer.length)
        return Buffer.concat([lengthVarInt, utf8Buffer])
    }

    public static decode(buffer: Buffer, offset: number) {
        const { value: length, size } = VarInt.decode(buffer, offset)
        const stringStart = offset + size
        const stringBuffer = buffer.subarray(stringStart, stringStart + length)

        return { value: stringBuffer.toString('utf8'), offset: stringStart + length }
    }
}


export class UShort {
    public static encode(value: number) {
        if (value < 0 || value > 65535) {
            throw new RangeError("Value must be between 0 and 65535")
        }
    
        const buffer = Buffer.alloc(2)
        buffer.writeUInt16BE(value)
        return buffer
    }

    public static decode(buffer: Buffer, offset: number = 0) {
        if (offset + 2 > buffer.length) {
            throw new RangeError("Unsigned Short exceeds buffer length")
        }
    
        const value = buffer.readUInt16BE(offset)
        return { value, size: 2, offset: offset + 2 }
    }
}


export class Short {
    public static encode(value: number) {
        if (value < -32768 || value > 32767) {
            throw new RangeError("Value must be between -32768 and 32767")
        }
    
        const buffer = Buffer.alloc(2)
        buffer.writeUInt16LE(value)
        return buffer
    }

    public static decode(buffer: Buffer, offset: number = 0) {
        if (offset + 2 > buffer.length) {
            throw new RangeError("Unsigned Short exceeds buffer length")
        }
    
        const value = buffer.readUInt16BE(offset)
        return { value, size: 2, offset: offset + 2 }
    }
}


export class UUID {
    public static encode(value: string) {
        const buffer = Buffer.from(value.match(/../g)!.map(byte => parseInt(byte, 16)))

        return buffer
    }

    public static decode(buffer: Buffer, offset: number = 0) {
        const value = buffer.subarray(offset, offset + 16).toString("hex")
        return { value, offset: offset + 16 }
    } 

    public static untrim(uuid: string) {
        return uuid.substring(0, 8) + "-" + uuid.substring(8, 12) + "-" + uuid.substring(12, 16) + "-" + uuid.substring(16, 20) + "-" + uuid.substring(20)
    }
}


export class Int {
    public static encode(value: number) {
        if (value < -2147483648 || value > 2147483647) {
            throw new RangeError("Value must be between -2147483648 and 2147483647")
        }

        const buffer = Buffer.alloc(4)
        buffer.writeInt32BE(value)
        return buffer
    }

    public static decode(buffer: Buffer, offset: number = 0) {
        if (offset + 4 > buffer.length) {
            throw new RangeError("Signed Integer exceeds buffer length")
        }

        const value = buffer.readInt32BE(offset)
        return { value, size: 4, offset: offset + 4 }
    }
}


export class Long {
    public static encode(value: bigint) {
        if (value < BigInt("-9223372036854775808") || value > BigInt("9223372036854775807")) {
            throw new RangeError("Value must be between -9223372036854775808 and 9223372036854775807")
        }

        const buffer = Buffer.alloc(8)
        buffer.writeBigInt64BE(value)
        return buffer
    }

    public static decode(buffer: Buffer, offset: number = 0) {
        if (offset + 8 > buffer.length) {
            throw new RangeError("Signed Long exceeds buffer length")
        }

        const value = buffer.readBigInt64BE(offset)
        return { value, size: 8, offset: offset + 8 }
    }
}


export class Float {
    public static encode(value: number) {
        if (!Number.isFinite(value)) {
            throw new RangeError("Value must be a finite number")
        }

        const buffer = Buffer.alloc(4)
        buffer.writeFloatBE(value)
        return buffer
    }

    public static decode(buffer: Buffer, offset: number = 0) {
        if (offset + 4 > buffer.length) {
            throw new RangeError("Float exceeds buffer length")
        }

        const value = buffer.readFloatBE(offset)
        return { value, size: 4, offset: offset + 4 }
    }
}


export class TextComponent {
    public static encode(value: string | Record<string, any>) {
        return encode(null, value)
    }

    public static decode(buffer: Buffer): { value: string | Record<string, any> } {
        const result = decode(buffer)
        const tag = result.value

        if (typeof tag === 'string') {
            return { value: tag }
        } else if (tag && typeof tag === 'object') {
            return { value: tag as Record<string, any> }
        } else {
            throw new Error('Invalid Text Component format')
        }
    }
}


export class Double {
    public static encode(value: number) {
        if (!Number.isFinite(value)) {
            throw new RangeError("Value must be a finite number")
        }

        const buffer = Buffer.alloc(8)
        buffer.writeDoubleBE(value)
        return buffer
    }

    public static decode(buffer: Buffer, offset: number = 0) {
        if (offset + 8 > buffer.length) {
            throw new RangeError("Float exceeds buffer length")
        }

        const value = buffer.readDoubleBE(offset)
        return { value, size: 8, offset: offset + 8 }
    }
}


export class Angle {
    public static encode(angle: number) {
        const encoded = Math.round(angle * (256 / 360))
        const buffer = Buffer.alloc(1)
        buffer.writeUInt8(encoded)
        return buffer
    }

    public static decode(buffer: Buffer, offset: number = 0) {
        const encoded = buffer.readUInt8(offset)

        const value = encoded * (360 / 256)
        return { value, offset: offset + 1 }
    }
}