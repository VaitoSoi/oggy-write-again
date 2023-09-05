import { Oggy } from "..";
import { Execute } from "../utils/lib";

type EventExecute = Execute<[oggy: Oggy, ...args: any[]], void>

export class EventBuilder {
    public name: string = '';
    public once: boolean = false;
    public execute: EventExecute = () => { };

    constructor () { }

    public setName(name: string): EventBuilder { this.name = name; return this }
    public setOnce(once: boolean): EventBuilder { this.once = once; return this }
    public setExecute(execute: EventExecute): EventBuilder { this.execute = execute; return this }
}