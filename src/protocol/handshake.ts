import { NetString, UShort, VarInt } from "../datatypes";
import { ConnectionStates, Player } from "../player";

export class Handshake {
    public static handle(player: Player, buffer: Buffer) {
        var offset = 1
        var {value: protocol_version, offset: offset} = VarInt.decode(buffer, offset)
        var {value: server_adress, offset: offset} = NetString.decode(buffer, offset)
        var {value: server_port, offset: offset} = UShort.decode(buffer, offset)
        var next_state = buffer[offset] as ConnectionStates

        player.handshake(
            next_state, 
            protocol_version, 
            server_adress, 
            server_port
        )
    }
}