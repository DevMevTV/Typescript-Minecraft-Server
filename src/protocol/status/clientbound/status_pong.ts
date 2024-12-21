import { Player } from "../../../player";
import { Protocol } from "../../reports";

export class StatusPong {
    public static send(player: Player, buffer: Buffer) {
        Protocol.send(player, "minecraft:pong_response", buffer.subarray(1))
    }
}