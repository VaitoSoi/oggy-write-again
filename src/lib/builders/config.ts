import ms from "ms"

export class Config {
    public discord: {
        token: string
    } = {
            token: ''
        }
    public mineflayer: {
        account: {
            username: string,
            password?: string,
            pin?: string,
            chatPassword?: string,
        },
        server: {
            host: string,
            port?: number,
            version: string,
            reconnectTimeout: number,
            loginType: 'pin' | 'chat' | 'auth',
            chatPattern?: string,
            pinPattern?: Array<{ slot: number, pin: number }>
        },
    } = {
            account: {
                username: 'Player'
            },
            server: {
                host: 'localhost',
                port: 25565,
                version: '1.16.5',
                reconnectTimeout: 5 * 60 * 1000,
                loginType: 'chat',
                chatPattern: '/login {password}',
                pinPattern: [
                    { slot: 1, pin: 1 }, 
                    { slot: 2, pin: 2 },
                    { slot: 3, pin: 3 },
                    { slot: 4, pin: 4 },
                    { slot: 5, pin: 5 },
                    { slot: 6, pin: 6 },
                    { slot: 7, pin: 7 },
                    { slot: 8, pin: 8 },
                    { slot: 9, pin: 9 }
                ]
            }
        }
    public system: {
        path: {
            debug: string,
            event: Record<'discord' | 'mineflayer', string>,
            command: Record<'discord' | 'mineflayer' | 'script', string>,
            customScript: string
        },
        env?: string
    } = {
            path: {
                debug: 'debug.log',
                event: {
                    discord: 'events/discord/',
                    mineflayer: 'events/mineflayer/',
                },
                command: {
                    discord: 'commands/discord/',
                    mineflayer: 'commands/mineflayer/',
                    script: 'srcipts/commands/'
                },
                customScript: 'srcipt/default.txt'
            }
        }
    public database: {
        type: string,
        mongodb: {
            link?: string,
            database: string,
            collection: string
        },
        mysql: {
            host?: string,
            user: string,
            password?: string,
            database: string,
            table: string
        }
    } = {
        type: 'mongodb',
        mongodb: {
            link: 'mongodb://localhost:27017',
            database: 'data',
            collection: 'config'
        },
        mysql: {
            host: 'localhost',
            user: 'root',
            database: 'data',
            table: 'GuildConfig'
        }
    }
}

export class ENVConfig extends Config {
    constructor(env: Record<string, string | undefined>) {
        super()

        this.discord.token = env.DISCORD_TOKEN || this.discord.token

        this.mineflayer.account.username = env.MINEFLAYER_ACCOUNT_USERNAME || this.mineflayer.account.username
        this.mineflayer.account.password = env.MINEFLAYER_ACCOUNT_PASSWORD || this.mineflayer.account.password
        this.mineflayer.account.chatPassword = env.MINEFLAYER_ACCOUNT_CHATPASSWORD || this.mineflayer.account.chatPassword
        this.mineflayer.account.pin = env.MINEFLAYER_ACCOUNT_PIN || this.mineflayer.account.pin
        this.mineflayer.server.version = env.MINEFLAYER_SERVER_VERSION || this.mineflayer.server.version
        this.mineflayer.server.host = env.MINEFLAYER_SERVER_HOST || this.mineflayer.server.host
        this.mineflayer.server.port = Number(env.MINEFLAYER_SERVER_PORT) || this.mineflayer.server.port
        this.mineflayer.server.reconnectTimeout = env.MINEFLAYER_SERVER_RECCONECTTIMEOUT ? ms(env.MINEFLAYER_SERVER_RECCONECTTIMEOUT) : this.mineflayer.server.reconnectTimeout
        this.mineflayer.server.chatPattern = env.MINEFLAYER_SERVER_CHATPATTERN || this.mineflayer.server.chatPattern
        this.mineflayer.server.pinPattern = JSON.parse(env.MINEFLAYER_SERVER_PINPATTERN || '[]') || this.mineflayer.server.pinPattern

        this.system.path.debug = env.SYSTEM_PATH_DEBUG || this.system.path.debug
        this.system.path.command.discord = env.SYSTEM_PATH_COMMAND_DISCORD || this.system.path.command.discord
        this.system.path.command.mineflayer = env.SYSTEM_PATH_COMMAND_MINEFLAYER || this.system.path.command.mineflayer
        this.system.path.command.script = env.SYSTEM_PATH_COMMAND_SCRIPT || this.system.path.command.script
        this.system.path.event.discord = env.SYSTEM_PATH_EVENT_DISCORD || this.system.path.event.discord
        this.system.path.event.mineflayer = env.SYSTEM_PATH_EVENT_MINEFLAYER || this.system.path.event.mineflayer
        this.system.path.customScript = env.SYSTEM_PATH_CUSTOMSCRIPT || this.system.path.customScript
        this.system.env = env.SYSTEM_ENV

        this.database.type = env.DATABASE_TYPE || this.database.type
        this.database.mongodb.link = env.DATABASE_MONGODB_LINK
        this.database.mongodb.database = env.DATABASE_MONGODB_DATABASE || this.database.mongodb.database
        this.database.mongodb.collection = env.DATABASE_MONGODB_COLLECTION || this.database.mongodb.collection
        this.database.mysql.host = env.DATABASE_MYSQL_HOST
        this.database.mysql.user = env.DATABASE_MYSQL_USER || this.database.mysql.user
        this.database.mysql.password = env.DATABASE_MYSQL_PASSWORD
        this.database.mysql.database = env.DATABASE_MYSQL_DATABASE || this.database.mysql.database
        this.database.mysql.table = env.DATABASE_MYSQL_TABLE || this.database.mysql.table
    }
}