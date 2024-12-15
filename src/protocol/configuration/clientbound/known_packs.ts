import { NetString, VarInt } from "../../../datatypes";
import { Player } from "../../../player";

export class KnownPacks {
    public static send(player: Player) {
        const known_packs = [
            {
                namespace: "minecraft",
                id: "core",
                version: "1.21.3"
            }
        ]

        let response_data = VarInt.encode(known_packs.length)
        known_packs.forEach((pack) => {
            response_data = Buffer.concat([
                response_data, NetString.encode(pack.namespace),
                NetString.encode(pack.id),
                NetString.encode(pack.version)])
        })

        let response = VarInt.encode(response_data.length)
        response = Buffer.concat([
            VarInt.encode(response_data.length + 1),
            Buffer.from([0x0e]),
            response_data
        ])

        player.client().write(response)
    }
}