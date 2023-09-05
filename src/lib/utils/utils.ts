import util from 'node:util'
import dayjs from 'dayjs'
import fs from 'node:fs'

type LoggerInfo = string | object | Array<any> | Error
type LoggerLevel =
    | 'info'
    | 'debug'
    | 'warn'
    | 'error'
interface LoggerOption {
    depth?: number | null
}

export class Logger {
    private fileStream?: fs.WriteStream;

    constructor(private filePath?: fs.PathLike) {
        if (!filePath || filePath == '') return
        this.fileStream = fs.createWriteStream(filePath)
    }

    open(filePath: fs.PathLike) {
        this.filePath = filePath
        this.fileStream = fs.createWriteStream(filePath)
    }

    log(info: LoggerInfo, level: LoggerLevel = 'info', option: LoggerOption = { depth: null }): boolean {
        const bufferParse = (info: LoggerInfo) => `[${dayjs().format('HH:mm:ss - DD/MM/YY')}] [${level.toUpperCase()}] ${info} \n`
        let buffer: string = ''
        if (typeof info == 'string') { 
            const array = info.replace(/\t/gi, '').split('\n')
            array.forEach((info) => buffer += bufferParse(info))
        }
        else if (info instanceof Error) buffer = bufferParse(info.stack || '')
        else buffer = bufferParse(util.inspect(info, { depth: option.depth }))

        if (this.fileStream) this.fileStream.write(buffer)
        return process.stdout.writable ? process.stdout.write(buffer) : false
    }

    info(info: LoggerInfo, option: LoggerOption = { depth: null }): boolean { return this.log(info, 'info', option) }
    debug(debug: LoggerInfo, option: LoggerOption = { depth: null }): boolean { return this.log(debug, 'debug', option) }
    warn(warn: LoggerInfo, option: LoggerOption = { depth: null }): boolean { return this.log(warn, 'warn', option) }
    error(error: LoggerInfo, option: LoggerOption = { depth: null }): boolean { return this.log(error, 'error', option) }
}

export const log = new Logger('./logs/debug.log')

export function distance(obj1: { x: number, y: number, z: number }, obj2: { x: number, y: number, z: number }): number {
    return Math.hypot(obj1.x - obj2.x, obj1.y - obj2.y, obj1.z - obj2.z);
}

export function objectValue(obj: { [key: string]: any }, prefix: string = ''): string[][] {
    let output: string[][] = []
    Object.keys(obj).forEach(val => <any>obj[val] instanceof Object ? output.push(...objectValue(obj[val], `${prefix == '' ? '' : `${prefix}.`}${val}`)) : output.push([`${prefix == '' ? '' : `${prefix}.`}${val}`, obj[val]]))
    return output
}