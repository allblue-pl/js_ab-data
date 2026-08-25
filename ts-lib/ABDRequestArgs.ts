import { ts0, ts0Assert, type TS0RawObject, type TS0RawValue } from "@allblue/ts0";

export default class ABDRequestArgs {
    static ParseArgs(args: TRequestArgObject): TS0RawObject {
        let obj: TS0RawObject = {};
    for (let key in args)
        obj[key] = ABDRequestArgs.#ParseArgs_Helper(args[key]);
    return obj;
    }

    static #ParseArgs_Helper(arg: TRequestArgValue): TS0RawValue {
        if (arg === null)
            return null;

        if (typeof arg === "object") {
            if (arg instanceof ABDRequestResult)
                return `?{${arg.resultPath}}`;
            else if (arg instanceof Array) {
                let arr = [];
                for (let value of arg)
                    arr.push(ABDRequestArgs.#ParseArgs_Helper(value));
                return arr;
            } else  if (arg.constructor === Object) {
                let obj: TS0RawObject = {};
                for (let key in arg)
                    obj[key] = ABDRequestArgs.#ParseArgs_Helper(arg[key]);
                return obj;
            } else {
                console.error("Unknown request arg type:", arg);
                ts0Assert(false, "Unknown request arg type: " + String(arg));
            }
        }

        return arg;
    }


    #argPath: string;

    get argPath(): string {
        return this.#argPath;
    }

    constructor(argPath: string) {
        this.#argPath = argPath;
    }
}

export class ABDRequestResult {
    #resultPath: string;

    get resultPath(): string {
        return this.#resultPath;
    }

    constructor(argPath: string) {
        this.#resultPath = argPath;
    }
}

export function abdRequestResult(argPath: string): ABDRequestResult {
    return new ABDRequestResult(argPath);
}

export type TRequestArgArray = Array<TRequestArgObject>;
export type TRequestArgObject = {[key:string|number]: TRequestArgValue};
export type TRequestArgValue = boolean|null|number|string|TRequestArgArray|TRequestArgObject|ABDRequestResult;