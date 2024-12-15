import { VarInt } from "../../../datatypes";
import { Player } from "../../../player";

export class Pong {
    public static send(player: Player, buffer: Buffer) {
        player.client().write(Buffer.concat([VarInt.encode(buffer.length), buffer]))
    }
}