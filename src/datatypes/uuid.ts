export class UUID {
    private uuid: string

    public constructor(uuid: string | Buffer, offset: number = 0) {
        if (Buffer.isBuffer(uuid)) {
            this.uuid = uuid.subarray(offset, offset + 16).toString("hex")
        } else {
            this.uuid = uuid.replace("-", "")
        }

        this.uuid = this.uuid.substring(0, 8) + "-"
                + this.uuid.substring(8, 12) + "-"
                + this.uuid.substring(12, 16) + "-"
                + this.uuid.substring(16, 20) + "-"
                + this.uuid.substring(20)
    }

    public toString() {
        return this.uuid
    }

    public toBuffer() {
        return Buffer.from(this.toTrimmed().match(/../g)!.map(byte => parseInt(byte, 16)))
    }

    public toTrimmed() {
        return this.uuid.replace(/-/g, "");
    }

    public static randomUUID() {
        return new UUID(crypto.randomUUID())
    }
}