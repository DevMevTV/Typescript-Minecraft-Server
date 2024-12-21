import { NetString, VarInt } from "../../datatypes";
import { Vector2, Vector3 } from "../../math/vectors";
import { Player, Players } from "../../player";
import { Protocol } from "../../protocol/reports";
import { LivingEntity } from "../living_entity";

export class PlayerEntity extends LivingEntity {
    protected entity_type = 148
    public skin: string
    private name: string

    private addedPlayer = false
    private listed = false
    private properties: {name: string, value: string}[] = []

    public constructor(name: string, position: Vector3, rotation: Vector2, head_rotation: number, velocity: Vector3) {
        super(position, rotation, head_rotation, velocity)
        this.name = name
        this.skin = ""
    }

    public addProperty(name: string, value: string) {
        this.properties = this.properties.filter(
            (property) => property.name !== name
        )
        if (name == "textures") {
            this.skin = value
        }
        this.properties.push({ name, value })
        if (this.spawned)
            this.updatePlayerInfo(UpdatePlayerInfo.AddPlayer)
        return this
    }

    public spawn(player?: Player, except = false) {
        this.updatePlayerInfo(UpdatePlayerInfo.AddPlayer)
        this.updatePlayerInfo(UpdatePlayerInfo.UpdateListed)
        super.spawn(player, except)
    }

    public setListed(listed: boolean) {
        this.listed = listed
        if (this.spawned)
            this.updatePlayerInfo(UpdatePlayerInfo.UpdateListed)
        return this
    }

    public isListed(): boolean { return this.listed }
    public getName(): string { return this.name }

    public updatePlayerInfo(action: UpdatePlayerInfo) {
        if (this.addedPlayer) {}
        this.addedPlayer = true
        let response_data: Buffer = Buffer.concat([
            Buffer.from([action]),
            VarInt.encode(1),
            this.uuid.toBuffer()
        ])

        switch (action) {
            case UpdatePlayerInfo.AddPlayer:
                let properties: Buffer = Buffer.alloc(0)
                this.properties.forEach((property) => {
                    properties = Buffer.concat([
                        properties,
                        NetString.encode(property.name),
                        NetString.encode(property.value),
                        Buffer.from([0x00])
                    ])
                })
                response_data = Buffer.concat([
                    response_data,
                    NetString.encode(this.name),
                    VarInt.encode(this.properties.length),
                    properties,
                ])
                break
            case UpdatePlayerInfo.UpdateListed:
                response_data = Buffer.concat([
                    response_data,
                    Buffer.from([this.listed ? 0x01 : 0x00])
                ])
                break
        }


        Players.ConnectedPlayers.forEach((player) => {
            Protocol.send(player, "minecraft:player_info_update", response_data)
        })
    }
}

enum UpdatePlayerInfo {
    AddPlayer = 0x01,
    InitializeChat = 0x02,
    UpdateGamemode = 0x04,
    UpdateListed = 0x08,
    UpdateLatency = 0x010,
    UpdateDisplayName = 0x20,
    UpdateListPriority = 0x40,
    UpdateHat = 0x80
}