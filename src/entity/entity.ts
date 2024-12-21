import { UUID } from "../datatypes/uuid"
import { error } from "../logApi"
import { Vector2, Vector3 } from "../math/vectors"
import { ConnectionStates, Player, Players } from "../player"
import { RemoveEntities } from "../protocol/play/clientbound/remove_entities"
import { SpawnEntity } from "../protocol/play/clientbound/spawn_entity"
import { PlayerEntity } from "./living_entities/player"

export class Entity {
    public static Entities: Entity[] = []
    protected static NextEID = 0

    protected entityId: number
    protected uuid: UUID
    protected entity_type: number
    protected spawned: boolean
    
    public position: Vector3
    public velocity: Vector3
    public rotation: Vector2
    public head_rotation: number

    public constructor(position: Vector3, rotation: Vector2, head_rotation: number, velocity: Vector3) {
        this.position = position
        this.rotation = rotation
        this.head_rotation = head_rotation
        this.velocity = velocity

        this.spawned = false
        
        Entity.Entities.push(this)
    }

    public kill() {
        this.despawn()
        const index = Entity.Entities.indexOf(this)
        if (index !== -1) {
            Entity.Entities.splice(index, 1)
        }
    }

    public despawn() {
        RemoveEntities.send(this)
        this.spawned = false
    }

    public setEntityId(entityId: number) { if(!this.entityId) { this.entityId = entityId } else { error("EntityId already set", "SERVER") } return this }
    public setUUID(uuid: UUID) { if(!this.entityId) { this.uuid = uuid } else { error("UUID already set", "SERVER") } return this }
    public getEntityID(): number { return this.entityId }
    public getUUID(): UUID { return this.uuid }

    public static getFromUUID(uuid: UUID) {
        return Entity.Entities.forEach((entity) => {
            if (entity.getUUID() == uuid) {
                return entity
            }
        })
    }

    public static SpawnEntities(player: Player) {
        Entity.Entities.forEach((entity) => {
            if (!entity.spawned) return
            entity.spawn(player)
        })
    }

    public spawn(player?: Player, except = false) {
        if (!this.entityId) { this.entityId = Entity.NextEID; Entity.NextEID += 1 }
        if (!this.uuid) { this.uuid = UUID.randomUUID() }

        if (player && !except) {
            SpawnEntity.send(player, this.entityId, this.uuid, this.entity_type, this.position, this.rotation, this.head_rotation, 0, this.velocity)
        } else {
            Players.ConnectedPlayers.forEach((splayer) => {
                if (splayer.NextState != ConnectionStates.Play) return
                if (except && player == splayer) return
                SpawnEntity.send(splayer, this.entityId, this.uuid, this.entity_type, this.position, this.rotation, this.head_rotation, 0, this.velocity)
            })
        }
        this.spawned = true
    }
}