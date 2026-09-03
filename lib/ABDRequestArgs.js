import { ts0, ts0Assert,                                     } from "@allblue/ts0";

export default class ABDRequestArgs {
    static ParseArgs(args                   )               {
        let obj               = {};
    for (let key in args)
        obj[key] = ABDRequestArgs.#ParseArgs_Helper(args[key]);
    return obj;
    }

    static #ParseArgs_Helper(arg                  )              {
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
                let obj               = {};
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


    #argPath        ;

    get argPath()         {
        return this.#argPath;
    }

    constructor(argPath        ) {
        this.#argPath = argPath;
    }
}

export class ABDRequestResult {
    #resultPath        ;

    get resultPath()         {
        return this.#resultPath;
    }

    constructor(argPath        ) {
        this.#resultPath = argPath;
    }
}

export function abdRequestResult(argPath        )                   {
    return new ABDRequestResult(argPath);
}

;                                                      
;                                                                       
;                                                                                                             