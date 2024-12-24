import { NetString, VarInt } from "../../../datatypes";
import { Player } from "../../../player";
import { Protocol } from "../../reports";

export class Commands {
    public static send(player: Player) {
        const nodes: Buffer[] = []

        nodes.push(
            Buffer.concat([
                Buffer.from([0x00]),
                VarInt.encode(1),
                VarInt.encode(1),
            ])
        )

        nodes.push(
            Buffer.concat([
                Buffer.from([0x01]),
                VarInt.encode(1),
                VarInt.encode(2),
                NetString.encode("summon"),
            ])
        )

        nodes.push(
            Buffer.concat([
                Buffer.from([0x02]),
                VarInt.encode(0),
                NetString.encode("entity"),
                VarInt.encode(45),
                NetString.encode("minecraft:entity_type")
                //Buffer.from([0x01])
            ])
        )

        const response_data = Buffer.concat([
            VarInt.encode(nodes.length),
            Buffer.concat(nodes),
            VarInt.encode(0)
        ])

        Protocol.send(player, "minecraft:commands", response_data)
    }
}