import Response from "./Response.ts";
import RequestProcessor, { type Request, type RequestInfo } from "./RequestProcessor.ts";
import type DataScheme from "./DataScheme.ts";
export default class DataStore {
    #private;
    get lastId(): number | null;
    get scheme(): DataScheme;
    constructor(requestProcessor: RequestProcessor);
    nextId(): number | null;
    request_Async(request: RequestInfo, transactionId?: null): Promise<Response>;
    requestB_Async(requests: Array<Request>, transactionId?: null): Promise<Response>;
    requestBatch_Async(requests_: Array<Request>, transactionId?: number | null): Promise<Response>;
}
