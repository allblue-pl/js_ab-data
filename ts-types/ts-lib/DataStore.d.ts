import { type TS0RawObject } from "@allblue/ts0";
import Response from "./Response.ts";
import RequestProcessor, { type Request } from "./RequestProcessor.ts";
import type Device from "./Device.ts";
import type DataScheme from "./DataScheme.ts";
export default class DataStore {
    #private;
    get device(): Device | null;
    get lastId(): number | null;
    get requestProcessor(): RequestProcessor;
    get scheme(): DataScheme;
    constructor(requestProcessor: RequestProcessor);
    nextId(): number | null;
    request_Async(requestName: string, actionName: string, actionArgs: TS0RawObject, transactionId?: null): Promise<Response>;
    requestB_Async(requests: Array<Request>, transactionId?: null): Promise<Response>;
    requestBatch_Async(requests_: Array<Request>, transactionId?: number | null): Promise<Response>;
}
