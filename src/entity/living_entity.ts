import { Vector2, Vector3 } from "../math/vectors";
import { Entity } from "./entity";

export class LivingEntity extends Entity {
    public health: number

    public constructor(position: Vector3, rotation: Vector2, head_rotation: number, velocity: Vector3) {
        super(position, rotation, head_rotation, velocity)
    }
}