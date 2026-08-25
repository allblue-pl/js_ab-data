import ts0, { type TS0RawObject } from "@allblue/ts0"
import Response, { type ResponseData } from "./Response.ts";
import RequestProcessor, { type Request, type Request_Parsed, type RequestInfo } from "./RequestProcessor.ts";
import type Device from "./Device.ts";
import type DataScheme from "./DataScheme.ts";
import abData from "./index.ts";
import ABDRequestArgs from "./ABDRequestArgs.ts";

export default class DataStore {
    #device: Device|null;
    #requestProcessor: RequestProcessor;
    #scheme: DataScheme;

    get lastId(): number|null {
        return this.#device === null ? null : this.#device.lastItemId;
    }

    get scheme(): DataScheme {
        return this.#scheme;
    }


    constructor(requestProcessor: RequestProcessor) {
        this.#requestProcessor = requestProcessor;
        this.#device = requestProcessor.device;
        this.#scheme = requestProcessor.scheme;
    }

    nextId(): number|null {
        return this.#device === null ? null : this.#device.nextId();
    }

    async request_Async(request: RequestInfo, transactionId = null): Promise<Response> {
        return await this.requestBatch_Async([[ "request", request ]], transactionId);
    }

    async requestB_Async(requests: Array<Request>, transactionId = null): 
            Promise<Response> {
        return await this.requestBatch_Async(requests, transactionId);
    }

    async requestBatch_Async(requests_: Array<Request>, transactionId: number|null = null): 
            Promise<Response> {
        let requests: Array<Request_Parsed> = [];
        for (let request of requests_) {
            requests.push([ request[0], [ 
                request[1][0], 
                request[1][1], 
                ABDRequestArgs.ParseArgs(request[1][2]), 
                this.#scheme.version ]]);
        }

        for (let request of requests) {
            try {
                this.scheme.validateRequestArgs(request)
            } catch(err) {
                return Response.Create({
                    actionErrors: {
                        [request[0]]: (err as Error).toString(),
                    },
                    errorMessage: `Action '${request[0]}:${request[1]}' error -> ` +
                            String(err as Error),
                    info: {},
                    requestIds: [],
                    results: {},
                    type: Response.Types_ActionError,
                });
            }
        }

        let response = await this.#requestProcessor.processRequestBatch_Async(
                requests, transactionId);

        for (let request of requests)
            this.scheme.validateRequestResponse(request, response);

        return response;
    }
}