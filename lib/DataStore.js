import ts0, {                   } from "@allblue/ts0"
import Response, {                   } from "./Response.js";
import RequestProcessor, {                                   } from "./RequestProcessor.js";
                                      
                                              
import abData from "./index.js";

export default class DataStore {
    #requestProcessor                  ;
    #scheme            ;

    get device()              {
        return this.#requestProcessor.device;
    }

    get lastId()              {
        return this.device === null ? null : this.device.lastItemId;
    }

    get requestProcessor()                   {
        return this.#requestProcessor;
    }

    get scheme()             {
        return this.#scheme;
    }


    constructor(requestProcessor                  ) {
        this.#requestProcessor = requestProcessor;
        this.#scheme = requestProcessor.scheme;
    }

    nextId()              {
        return this.device === null ? null : this.device.nextId();
    }

    async request_Async(requestName        , actionName        , 
            actionArgs              , transactionId = null)                    {
        return await this.requestBatch_Async([[ "request", requestName, actionName,
                actionArgs ]], transactionId);
    }

    async requestB_Async(requests                , transactionId = null)  
                              {
        return await this.requestBatch_Async(requests, transactionId);
    }

    async requestBatch_Async(requests_                , transactionId              = null)  
                              {
        let requests                        = [];
        for (let request of requests_) {
            requests.push([ request[0], request[1], request[2], request[3], 
                    this.#scheme.version ]);
        }

        for (let request of requests) {
            try {
                this.scheme.validateRequestArgs(request)
            } catch(err) {
                return Response.Create({
                    actionErrors: {
                        [request[0]]: (err         ).toString(),
                    },
                    errorMessage: `Action '${request[0]}:${request[1]}' error -> ` +
                            String(err         ),
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