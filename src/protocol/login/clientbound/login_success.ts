import { NetString, VarInt } from "../../../datatypes";
import { Player, } from "../../../player";
import { Protocol } from "../../reports";

export class LoginSuccess {
    public static send(player: Player) {
        const response_data = Buffer.concat([
            player.player_entity.getUUID().toBuffer(),
            NetString.encode(player.player_entity.getName()),
            VarInt.encode(1),
            NetString.encode("textures"),
            NetString.encode(player.player_entity.skin),
            Buffer.from([0x00])
        ])
        Protocol.send(player, "minecraft:login_finished", response_data)
    }
}