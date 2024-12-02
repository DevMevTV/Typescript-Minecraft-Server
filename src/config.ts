import { config } from "dotenv"


config()
export const PORT: number = parseInt(process.env.PORT)
export const VERSION: string = process.env.VERSION
export const PROTOCOL_VERSION: number = parseInt(process.env.PROTOCOL_VERSION)
export const MOTD: string = process.env.MOTD
export const MAX_PLAYERS: number = parseInt(process.env.MAX_PLAYERS)