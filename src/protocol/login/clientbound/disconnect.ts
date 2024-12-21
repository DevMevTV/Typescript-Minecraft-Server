import { NetString, TextComponent, VarInt } from "../../../datatypes";
import { Player } from "../../../player";
import { Protocol } from "../../reports";

export class Disconnect {
    public static send(player: Player, reason: string) {
        let response_data = NetString.encode(JSON.stringify({text: reason}))
        Protocol.send(player, "minecraft:login_disconnect", response_data)
    }
}