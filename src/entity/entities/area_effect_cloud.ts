import { Vector2, Vector3 } from "../../math/vectors";
import { Entity } from "../entity";

export class AreaEffectCloud extends Entity {
    protected entity_type = 3

    public constructor(position: Vector3, rotation: Vector2, head_rotation: number, velocity: Vector3) {
        super(position, rotation, head_rotation, velocity)
    }
}