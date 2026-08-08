import ts0, { ts0Virtual, type TS0RawObject } from "@allblue/ts0";
import DataScheme from "./DataScheme.ts";
import Device from "./Device.ts";
import Response from "./Response.ts";

export default abstract class RequestProcessor {
    #device: Device|null;
    #nextProcessingId: number;
    #processingQueue: ProcessingQueue;
    #scheme: DataScheme;


    get device(): Device|null {
        return this.#device;
    }

    get scheme(): DataScheme {
        return this.#scheme;
    }


    constructor(dataScheme: DataScheme, device: Device|null) {
        this.#scheme = dataScheme;
        this.#device = device;

        this.#processingQueue = [];
        this.#nextProcessingId = 0;
    }

    async processRequest_Async(requestName: string, actionName: string, 
            actionArgs: TS0RawObject, transactionId: number|null = null): 
            Promise<Response> {
        let response = await this.processRequestBatch_Async([
            [ 'request', requestName, actionName, actionArgs, this.#scheme.version ],
        ]);

        return response;
    }

    async processRequestBatch_Async(requests: Array<Request_Parsed>, 
            transactionId: number|null = null):  Promise<Response> { 
        let processingId = this.#nextProcessingId;
        this.#nextProcessingId++;

        this.#processingQueue.push({
            processingId: processingId,
            requests: requests,
            transactionId: transactionId,
        });

        let response = await this.#processRequestBatchHelper_Async(processingId, 
                requests, transactionId);

        // let response = await this.#_processRequestBatch_Async(requests, 
        //         transactionId);

        return response;
    }


   #processRequestBatchHelper_Async(processingId: number, requests: Array<Request_Parsed>, 
            transactionId: number|null): Promise<Response> {
        return new Promise((resolve, reject) => {
            if (this.#processingQueue[0].processingId === processingId) {
                this.__processRequestBatch_Async(requests, transactionId)
                        .then((response) => {
                    this.#processingQueue.splice(0, 1);
                    resolve(response);
                });
                return;
            }

            setTimeout(() => {
                console.log("Another test");
                resolve(this.#processRequestBatchHelper_Async(processingId,
                        requests, transactionId));
            }, 50);
        });
    }


    abstract __processRequestBatch_Async(requests: Array<Request_Parsed>, 
            transactioId: number|null): Promise<Response>;
}

type ProcessingQueue = Array<{
    processingId: number,
    requests: Array<Request_Parsed>,
    transactionId: number|null,
}>;

export type Request = [
    requestId: string,
    requestName: string, 
    actionName: string, 
    actionArgs: TS0RawObject,
];

export type Request_Parsed = [
    requestId: string,
    requestName: string, 
    actionName: string, 
    actionArgs: TS0RawObject,
    schemeVersion: number,
];