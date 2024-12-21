import { Float, Position, VarInt } from "../../../datatypes";
import { Player } from "../../../player";
import { BlockUpdate } from "../clientbound/block_update";

export class UseItemOn {
    public static handle(player: Player, buffer: Buffer) {
        var {value: hand, offset} = VarInt.decode(buffer, 1)
        var {value: position, offset} = Position.decode(buffer, offset)
        var {value: face, offset} = VarInt.decode(buffer, offset)
        var {value: curserPosX, offset} = Float.decode(buffer, offset)
        var {value: curserPosY, offset} = Float.decode(buffer, offset)
        var {value: curserPosZ, offset} = Float.decode(buffer, offset)
        var insideBlock = Number(buffer[offset])
        var worldBorderHit = Number(buffer[offset + 1])
        var sequence = VarInt.decode(buffer, offset + 2).value

        switch (face) {
            case 0: 
                position.y -= 1
                break
            case 1:
                position.y += 1
                break
            case 2: 
                position.z -= 1
                break
            case 3:
                position.z += 1
                break
            case 4: 
                position.x -= 1
                break
            case 5:
                position.x += 1
                break
        }

        BlockUpdate.send(position, 11649)
    }
}