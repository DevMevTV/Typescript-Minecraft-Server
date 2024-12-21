import { Position, VarInt } from "../../../datatypes";
import { Player } from "../../../player";
import { BlockUpdate } from "../clientbound/block_update";
import { SetBlockDestroyStage } from "../clientbound/set_block_destroy_stage";

export class PlayerAction {
    public static handle(player: Player, buffer: Buffer) {
        var {value: status, offset} = VarInt.decode(buffer, 1)
        var {value: position, offset} = Position.decode(buffer, offset)

        //SetBlockDestroyStage.send(player, position)
        BlockUpdate.send(position, 0)
    }
}