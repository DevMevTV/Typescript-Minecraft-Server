import { readFileSync } from "fs"
import { error } from "../logApi";
import { ConnectionStates, Player } from "../player";
import { VarInt } from "../datatypes";

export class Protocol {
    private static protocols = {}

    public static DEBUG = false

    public static init() {
        this.protocols = JSON.parse(readFileSync("./data/reports/packets.json").toString())
    }

    public static handle(player: Player, buffer: Buffer) {
        const length = VarInt.decode(buffer);
        let returnBuffer: Buffer = VarInt.encode(length.value);
    
        returnBuffer = buffer.subarray(length.size, length.value + length.size);
        
        this.handlePacket(player, returnBuffer)
    
        if (length.value + length.size !== buffer.length) {
            this.handle(
                player,
                buffer.subarray(length.value + length.size, buffer.length)
            );
        }
    }

    private static handlePacket(player: Player, buffer: Buffer) {
        const NextState = ConnectionStates[player.NextState].toLowerCase()
        for (var protocol in this.protocols[NextState]["serverbound"]) {
            if (this.protocols[NextState]["serverbound"][protocol]["protocol_id"] == buffer[0]) {
                const fn = this.protocols[NextState]["serverbound"][protocol]["function"]
                if (!fn) {
                    if (!Protocol.DEBUG) return
                    error(`${NextState}.serverbound.${protocol} function not defined`, "SERVER")
                    return
                }
                fn(player, buffer)
            }
        }
    }

    public static send(player: Player, namespace: string, buffer: Buffer) {
        const NextState = ConnectionStates[player.NextState].toLowerCase()

        if (!this.protocols[NextState]["clientbound"][namespace]) {
            if (!Protocol.DEBUG) return
            error(`${NextState}.clientbound.${namespace} does not exist`, "SERVER")
            return
        }

        const packetId = this.protocols[NextState]["clientbound"][namespace]["protocol_id"]
        const packet = Buffer.concat([
            VarInt.encode(buffer.length + 1),
            VarInt.encode(packetId),
            buffer
        ])

        player.client().write(packet)
    }


    public static HANDSHAKE(namespace: string, fn: Function) {
        this.addProtocol("handshake", "serverbound", namespace, fn)
    }

    public static STATUS(namespace: string, fn: Function) {
        this.addProtocol("status", "serverbound", namespace, fn)
    }

    public static LOGIN(namespace: string, fn: Function) {
        this.addProtocol("login", "serverbound", namespace, fn)
    }

    public static CONFIGURATION(namespace: string, fn: Function) {
        this.addProtocol("configuration", "serverbound", namespace, fn)
    }

    public static PLAY(namespace: string, fn: Function) {
        this.addProtocol("play", "serverbound", namespace, fn)
    }

    private static addProtocol(protocol: string, bound: string, namespace: string, fn: Function) {
        if (!this.protocols[protocol][bound][namespace]) {
            if (!Protocol.DEBUG) return
            error(`${protocol}.${bound}.${namespace} does not exist`, "SERVER")
            return
        }
        
        this.protocols[protocol][bound][namespace]["function"] = fn
    }
}