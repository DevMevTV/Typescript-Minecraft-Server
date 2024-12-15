import { Player, Players } from "../../../player";
import { server } from "../../../serverPropeties";
import { NetString, UUID, VarInt } from "../../../datatypes";

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
            if (splayer.username == undefined) return
            status.players.sample.push({name: splayer.username, id: UUID.untrim(splayer.uuid)})
        })
    
        var response_data = NetString.encode(JSON.stringify(status))
        var response: Buffer = Buffer.concat([VarInt.encode(response_data.length + 1), Buffer.from([0x00]), response_data])
        
        player.client().write(response)
    }
}