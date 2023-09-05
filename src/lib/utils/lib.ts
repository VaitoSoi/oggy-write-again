import { ChatInputCommandInteraction } from "discord.js"
import { join } from 'path'
import { lstatSync } from 'fs'

export type Awaitable<T> = T | Promise<T>

export type Execute<P extends any[] = any[], C = any> = (...param: P) => Awaitable<C>

export type CommandInteraction = ChatInputCommandInteraction

export const filesFilter = (dir: string, file: string): boolean => (file.endsWith('.ts') || file.endsWith('.js')) && lstatSync(join(dir, file)).isFile()