import { ConnectionStates, Player, Players } from "../../../player";
import { server } from "../../../serverPropeties";
import { NetString } from "../../../datatypes";
import { Protocol } from "../../reports";

export class StatusResponse {
    public static send(player: Player) {
        
        var status = {
            version: {
                name: server.serverName,
                protocol: server.protocolVersion
            },
            players: {
                max: server.maxPlayers,
                online: Players.ConnectedPlayers.size - 1,
                sample: []
            },
            description: {
                text: server.MOTD
            },
            enforceSecureChat: false
        }

    
        Players.ConnectedPlayers.forEach((splayer) => {
            if (splayer.NextState != ConnectionStates.Play) return
            status.players.sample.push({name: splayer.player_entity.getName(), id: splayer.player_entity.getUUID().toString()})
        })
    
        var response_data = NetString.encode(JSON.stringify(status))
        Protocol.send(player, "minecraft:status_response", response_data)
    }
}