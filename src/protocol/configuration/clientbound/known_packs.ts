import { NetString, VarInt } from "../../../datatypes";
import { Player } from "../../../player";
import { Protocol } from "../../reports";

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

        Protocol.send(player, "minecraft:select_known_packs", response_data)
    }
}