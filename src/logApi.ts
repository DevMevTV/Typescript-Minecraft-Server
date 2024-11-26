import { writeFileSync, readFileSync, readdirSync, rename, mkdir } from "fs";

let logFileName: string = getLogFile();

function getLogFile (): string {
  const filesInRoot: Array<string> = readdirSync("./")
  let oldLogFileName: string
  for (const file of filesInRoot) {
    if (file.slice(0, 4) == "log ") oldLogFileName = file;
  }
  const logIndex: number = oldLogFileName !== undefined ? parseInt(oldLogFileName.match(/\d+/)[0], 10) : 0
  mkdir("./logs", () => {})
  rename(`./${oldLogFileName}`, `./logs/${oldLogFileName}`, () => {})
  writeFileSync(`./log ${logIndex + 1}`, '')
  return `log ${+logIndex + 1}`
}


export function log(value: string, extraInformation: string) {

  console.log(`[Info] {${extraInformation}} - ${value}`);
  writeFileSync(
    logFileName,
    `${readFileSync(logFileName)}[Info] {${extraInformation}} - ${value}\n`
  );
}

export function error(
  value: string,
  extraInformation: string,
  fatal?: boolean
) {
  writeFileSync(
    logFileName,
    `${readFileSync(logFileName)}[ERROR]: {${extraInformation}} - ${value}\n`
  );
  if (!fatal) console.error(`[ERROR]: {${extraInformation}} - ${value}`);
  else throw new Error(`[ERROR]: {${extraInformation}} - ${value}`);
}