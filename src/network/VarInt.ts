export const encodeVarInt = (value: number): Buffer => {
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
  
export const decodeVarInt = (buffer: Buffer): { value: number; size: number } => {
    let value = 0
    let position = 0
    let byte: number
  
    do {
      if (position >= buffer.length) {
        throw new RangeError("VarInt exceeds buffer length")
      }
  
      byte = buffer[position]
      value |= (byte & 0x7f) << (7 * position)
      position++
    } while ((byte & 0x80) !== 0)
  
    return { value, size: position }
}