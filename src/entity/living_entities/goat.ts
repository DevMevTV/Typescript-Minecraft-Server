import { Vector2, Vector3 } from "../../math/vectors";
import { LivingEntity } from "../living_entity";

// You're the GOAT!
export class Goat extends LivingEntity {
    protected entity_type = 60

    public constructor(position: Vector3, rotation: Vector2, head_rotation: number, velocity: Vector3) {
        super(position, rotation, head_rotation, velocity)
    }
}