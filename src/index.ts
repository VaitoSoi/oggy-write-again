import { config } from "dotenv";
import { Oggy } from "./lib";
import { ENVConfig } from "./lib/builders/config";
import { join } from "path";

config({ path: join(__dirname, '.env') })
const oggy = new Oggy(new ENVConfig(process.env))
oggy.login()