import { Vector2, Vector3 } from "../../math/vectors";
import { Entity } from "../entity";

export class Boat extends Entity {
    protected entity_type = 0

    public constructor(boat_type: BoatTypes, position: Vector3, rotation: Vector2, head_rotation: number, velocity: Vector3) {
        super(position, rotation, head_rotation, velocity)
        this.entity_type = boat_type
    }
}

export enum BoatTypes {
    Acacia = 0,
    Acacia_Chest = 1,
    Bamboo = 9,
    Bamboo_Chest = 8,
    Birch = 12,
    Birch_Chest = 13,
    Cherry = 22,
    Cherry_Chest = 23,
    Dark_Oak = 32,
    Dark_Oak_Chest = 33,
    Jungle = 72,
    Jungle_Chest = 73,
    Mangrove = 79,
    Mangrove_Chest = 80,
    Oak = 85,
    Oak_Chest = 86,
    Pale_Oak = 90,
    Pale_Oak_Chest = 91,
    Spruce = 119,
    Spruce_Chest = 120
}