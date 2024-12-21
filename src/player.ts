import { Socket } from "net";
import { Int, VarInt } from "./datatypes";
import { UUID } from "./datatypes/uuid";
import { PlayerEntity } from "./entity/living_entities/player";
import { Vector2, Vector3 } from "./math/vectors";

export class Players {
  public static ConnectedPlayers: Map< Socket, Player > = new Map();

  public static EID = 0
}

export class Player {
  private socket: Socket

  public NextState: ConnectionStates

  // Protocol stuff
  public server_adress: string
  public server_port: number
  public protocol_version: number

  public player_entity: PlayerEntity

  private pingProcess: NodeJS.Timeout;

  public constructor(client: Socket) {
    this.socket = client
    this.NextState = ConnectionStates.Handshake

    this.pingProcess = setInterval(() => { this.ping() }, 13000)
  }

  public end() {
    clearInterval(this.pingProcess)
  }

  private ping() {
    const packetId = this.NextState == ConnectionStates.Configuration ? Buffer.from([0x04]) : this.NextState == ConnectionStates.Play ? Buffer.from([0x37]) : undefined
    if (packetId == undefined) return
    const ping_data = Int.encode(12345)
    const ping = Buffer.concat([
      VarInt.encode(ping_data.length + 1),
      packetId,
      ping_data
    ])

    this.socket.write(ping)
  }

  public handshake(
    next_state: ConnectionStates,
    protocol_version: number,
    server_adress: string,
    server_port: number
  ) {
    this.NextState = next_state
    this.protocol_version = protocol_version
    this.server_adress = server_adress
    this.server_port = server_port
  }

  public login(username: string, uuid: UUID) {
    this.player_entity = new PlayerEntity(username,
      new Vector3(8.5, 330, 8.5),
      new Vector2(0, 0),
      0,
      new Vector3(0, 0, 0)
    ).setUUID(uuid)
  }

  public client(): Socket { return this.socket }
}

export enum ConnectionStates {
  Handshake = 0,
  Status = 1,
  Login = 2,
  Configuration = 3,
  Play = 4,
  Disconnect = 5,
}
