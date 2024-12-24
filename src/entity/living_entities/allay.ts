import { Vector2, Vector3 } from "../../math/vectors";
import { LivingEntity } from "../living_entity";

export class Allay extends LivingEntity {
    protected entity_type = 2

    public constructor(position: Vector3, rotation: Vector2, head_rotation: number, velocity: Vector3) {
        super(position, rotation, head_rotation, velocity)
    }
}