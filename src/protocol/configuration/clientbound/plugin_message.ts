import { NetString } from "../../../datatypes";
import { Player } from "../../../player";
import { Protocol } from "../../reports";
import { server } from "../../../serverPropeties";

export class PluginMessage {
    public static send(player: Player) {
        const response_data = Buffer.concat([
            NetString.encode("minecraft:brand"),
            NetString.encode(server.serverName)
        ])

        Protocol.send(player, "minecraft:custom_payload", response_data)
    }
}