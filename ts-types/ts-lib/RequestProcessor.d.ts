import { type TS0RawObject } from "@allblue/ts0";
import DataScheme from "./DataScheme.ts";
import Device from "./Device.ts";
import Response from "./Response.ts";
export default abstract class RequestProcessor {
    #private;
    get device(): Device | null;
    get scheme(): DataScheme;
    constructor(dataScheme: DataScheme, device: Device | null);
    processRequest_Async(requestName: string, actionName: string, actionArgs: TS0RawObject, transactionId?: number | null): Promise<Response>;
    processRequestBatch_Async(requests: Array<Request_Parsed>, transactionId?: number | null): Promise<Response>;
    abstract __processRequestBatch_Async(requests: Array<Request_Parsed>, transactioId: number | null): Promise<Response>;
}
export type Request = [
    requestId: string,
    requestName: string,
    actionName: string,
    actionArgs: TS0RawObject
];
export type Request_Parsed = [
    requestId: string,
    requestName: string,
    actionName: string,
    actionArgs: TS0RawObject,
    schemeVersion: number
];
