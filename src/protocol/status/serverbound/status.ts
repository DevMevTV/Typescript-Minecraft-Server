import { StatusResponse } from "../clientbound/status_response";
import { Pong } from "../clientbound/pong";
import { Player } from "../../../player";

export class Status {
    public static handle(player: Player, buffer: Buffer) {
        const packet_id = buffer[0]

        switch (packet_id) {
            case 0x00:
                StatusResponse.send(player)
                break
            case 0x01:
                Pong.send(player, buffer)
                break
        }
    }
}