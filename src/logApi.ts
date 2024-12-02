import { writeFileSync, readFileSync, readdirSync, rename, mkdir } from "fs"

const date = new Date()
let logFileName: string = `./logs/log_${date.getUTCFullYear()}_${date.getUTCMonth() + 1}_${date.getUTCDate()}`
try {readFileSync(logFileName)}
catch {writeFileSync(logFileName, '')}  

export function log(value: string, extraInformation: string, color?: string) {

  console.log(color == undefined ? `\x1b[32m[Info] {${extraInformation}} - \x1b[37m${value}` : `\x1b[32m[Info] {${extraInformation}} - ${color}${value}`)
  writeFileSync(
    logFileName,
    `${readFileSync(logFileName)}[Info] {${extraInformation}} - ${value}\n`
  )
}

export function error(
  value: string,
  extraInformation: string,
  fatal?: boolean
) {
  writeFileSync(
    logFileName,
    `${readFileSync(logFileName)}[ERROR]: {${extraInformation}} - ${value}\n`
  )
  if (!fatal) console.error(`\x1b[31m[ERROR]: {${extraInformation}} - \x1b[37m${value}`)
  else throw new Error(`[ERROR]: {${extraInformation}} - ${value}`)
}