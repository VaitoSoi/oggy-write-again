import { Db, MongoClient } from "mongodb";
import { Oggy } from "..";
import { Pool, RowDataPacket, createPool } from "mysql2/promise";
import _ from 'lodash'
import { objectValue } from '../utils/utils'

export interface DatabasePath {
    'guildid': string,
    'guildname': string,
    'config.channels.livechat': string,
    'config.channels.restart': string,
    'config.channels.status': string,
}
interface MongoDocument {
    'guildid': string,
    'guildname': string,
    'config': {
        'channels': {
            'livechat': string,
            'restart': string,
            'status': string,
        }
    }
}
enum SQLPathToColumn {
    'guildid' = 'GuildID',
    'guildname' = 'GuildName',
    'config.channels.livechat' = 'ChannelLivechat',
    'config.channels.restart' = 'ChannelRestart',
    'config.channels.status' = 'ChannelStatus',
}
// const MongooseModel = model('config', new Schema({
//     'guildid': String,
//     'guildname': String,
//     'config': {
//         'channels': {
//             'livechat': String,
//             'restart': String,
//             'status': String,
//         }
//     }
// }))

export class OggyDatabase {
    private mongoClient?: MongoClient
    public database?: Db | Pool
    private collection: string = 'config'
    private table: string = 'GuildConfig'

    constructor(private oggy: Oggy) {
        if (oggy.config.database.type == 'mongodb') {
            if (!oggy.config.database.mongodb.link) oggy.eventEmitter.emit('endProcess', `[DATABASE] [MongoDB] Missing database link`)
            else if (!oggy.config.database.mongodb.database) oggy.eventEmitter.emit('endProcess', `[DATABASE] [MongoDB] Missing database name`)
            else {
                this.mongoClient = new MongoClient(oggy.config.database.mongodb.link, {
                    appName: 'OggyTheCode',
                })
                this.database = this.mongoClient.db(oggy.config.database.mongodb.database)
                this.collection = oggy.config.database.mongodb.collection || this.collection
                oggy.logger.info('[DATABASE] [MongoDB] Connected to database (using "mongodb")')
                if (!this.database.collection(this.collection)) {
                    this.database.createCollection(this.collection)
                    this.oggy.logger.info(`[DATABASE] [MongoDB] Created collection "${this.collection}"`)
                }
            }
        } else if (oggy.config.database.type == 'mysql')
            if (!oggy.config.database.mysql.host) oggy.eventEmitter.emit('endProcess', `[DATABASE] [MySQL] Missing database host`)
            else if (!oggy.config.database.mysql.user) oggy.eventEmitter.emit('endProcess', `[DATABASE] [MySQL] Missing database user`)
            else if (!oggy.config.database.mysql.database) oggy.eventEmitter.emit('endProcess', `[DATABASE] [MySQL] Missing database name`)
            else {
                if (!oggy.config.database.mysql.password) oggy.logger.warn(`[DATABASE] [MySQL] Missing password, this will occur an error in some case.`)
                this.database = createPool({
                    host: this.oggy.config.database.mysql.host,
                    user: this.oggy.config.database.mysql.user,
                    password: this.oggy.config.database.mysql.password,
                    database: this.oggy.config.database.mysql.database,
                })
                this.table = oggy.config.database.mysql.table
                oggy.logger.info('[DATABASE] [MySQL] Connected to database (using mysql2)')
                this.database.execute(`select * from information_schema.tables where table_schema = '${oggy.config.database.mysql.database}' and table_name = '${this.table}';`).then(async (cb) => {
                    if (!cb[0]) {
                        await (<Pool>this.database).execute(
                            `CREATE TABLE ${this.table} ( \n` +
                            '   GuildID bigint \n' +
                            '   GuildName varchar(255) \n' +
                            '   ChannelLivechat bigint \n' +
                            '   ChannelRestart bigint \n' +
                            '   ChannelStatus bigint \n' +
                            ');'
                        )
                        oggy.logger.info(`[DATABASE] [MySQL] Created table "${this.table}"`)
                    }
                })
            }
        else oggy.eventEmitter.emit('endProcess', `[DATABASE] Unknow database type: ${oggy.config.database.type}`)
    }

    public async create(value?: MongoDocument): Promise<void | Error> {
        if (!this.database) return new Error('database is undefined')
        else if (this.database instanceof Db) {
            let collection = this.database.collection<MongoDocument>(this.collection)
            if (!collection) collection = await this.database.createCollection(this.collection)

            if (value) return void await collection.insertOne(value)
        } else {
            if (!value) return new Error('missing value')
            let columns: SQLPathToColumn[] = [], values: string[] = []
            const parsedValue = objectValue(value)

            for (let i in parsedValue) { columns.push(SQLPathToColumn[<keyof DatabasePath>parsedValue[i][1]]); values.push(parsedValue[i][2]) }

            return void await this.database.execute(
                `INSERT INTO ${this.table} (${columns.join(' ')}) \n` +
                `VALUES (${values.join(' ')})`
            )
        }
    }


    public async get<P extends keyof DatabasePath>(guildid: string, path?: P): Promise<DatabasePath[P] | MongoDocument | Error | null> {
        if (!this.database) return new Error('database is undefined')
        else if (this.database instanceof Db) {
            let collection = this.database.collection<MongoDocument>(this.collection)
            if (!collection) return new Error('collection not exist, please create it by using create method')

            const data = await collection.findOne({ guildid })
            return (path ? _.get(data, path) : data) || null
        } else {
            const data = (await this.database.query<RowDataPacket[]>(`select * from '${this.table}' where GuildID = '${guildid}'`))[0][0]
            if (path) return data[SQLPathToColumn[path]]
            else return data == null ? null : {
                guildid: data.GuildID,
                guildname: data.GuildName,
                config: {
                    channels: {
                        livechat: data.ChannelLivechat,
                        restart: data.ChannelRestart,
                        status: data.ChannelStatus,
                    }
                }
            }
        }
    }

    public async set<P extends keyof DatabasePath>(guildid: string, path: P, value: DatabasePath[P]): Promise<void | Error> {
        if (!this.database) return new Error('database is undefined')
        else if (this.database instanceof Db) {
            const collection = this.database.collection<MongoDocument>(this.collection)
            if (!collection) return new Error('collection not exist, please create it by using create method')

            const data = await collection.findOne({ guildid })
            if (data == null) return new Error('data not exist, please create new data using create method')
            _.set(data, path, value)
            return void await collection.updateOne({ guildid }, data)
        } else {
            return void await this.database.query(`UPDATE ${this.table} SET ${SQLPathToColumn[path]} = '${value}' WHERE GuildID = '${guildid}'`)
        }
    }

    public async delete(guildid: string): Promise<void | Error> {
        if (!this.database) return new Error('database is undefined')
        else if (this.database instanceof Db) {
            const collection = this.database.collection<MongoDocument>(this.collection)
            if (!collection) return new Error('collection not exist, please create it by using create method')

            return void await collection.deleteOne({ guildid })
        } else {
            return void await this.database.query(`DELETE FROM ${this.table} WHERE GuildID = '${guildid}'`)
        }
    }

    public async destroy(): Promise<void> {
        if (!this.database) return undefined
        else if (this.mongoClient && this.database instanceof Db) return void await this.mongoClient.close()
        else return void (<Pool>this.database).end()
    }
}
