import { encode, decode, Tag } from 'nbt-ts'
import { Vector3 } from './math/vectors'

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
        buffer.writeInt16BE(value)
        return buffer
    }

    public static decode(buffer: Buffer, offset: number = 0) {
        if (offset + 2 > buffer.length) {
            throw new RangeError("Short exceeds buffer length")
        }
    
        const value = buffer.readInt16BE(offset)
        return { value, size: 2, offset: offset + 2 }
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
            console.log("A")
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
        
        while (angle > 180) {
            angle -= 360
        }
        while (angle < -180) {
            angle += 360
        }

        const buffer = Buffer.alloc(1)
        buffer.writeInt8((angle * 256) / 360)
        return buffer
    }

    public static decode(buffer: Buffer, offset: number = 0) {
        const encoded = buffer.readInt8(offset)
        
        const value = (encoded * (360 / 256)) - 180
        return { value, offset: offset + 1 }
    }
}


export class Position {
    public static encode(position: Vector3): Buffer {
        const buffer = Buffer.alloc(8);

        const x = position.x & 0x3FFFFFF;
        const y = position.y & 0xFFF;
        const z = position.z & 0x3FFFFFF;

        const value = (BigInt(x) << BigInt(38)) | (BigInt(z) << BigInt(12)) | BigInt(y);

        const high = Number(value >> BigInt(32));
        const low = Number(value & BigInt(0xFFFFFFFF));

        buffer.writeUInt32BE(high, 0);
        buffer.writeUInt32BE(low, 4);

        return buffer;
    }

    public static decode(buffer: Buffer, offset: number = 0) {
        const high = buffer.readUInt32BE(offset);
        const low = buffer.readUInt32BE(offset + 4);

        const value = (BigInt(high) << BigInt(32)) | BigInt(low);

        let x = Number((value >> BigInt(38)) & BigInt(0x3FFFFFF));
        let y = Number(value & BigInt(0xFFF));
        let z = Number((value >> BigInt(12)) & BigInt(0x3FFFFFF));

        if (x >= 1 << 25) x -= 1 << 26;
        if (y >= 1 << 11) y -= 1 << 12;
        if (z >= 1 << 25) z -= 1 << 26;

        return {
            value: new Vector3(x, y, z),
            offset: offset + 8,
        };
    }
}
