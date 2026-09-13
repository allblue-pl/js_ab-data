import ts0, {                   } from "@allblue/ts0"
import Response, {                   } from "./Response.js";
import RequestProcessor, {                                                     } from "./RequestProcessor.js";
                                      
                                              
import abData from "./index.js";
import ABDRequestArgs from "./ABDRequestArgs.js";

export default class DataStore {
    #device             ;
    #requestProcessor                  ;
    #scheme            ;

    get lastId()              {
        return this.#device === null ? null : this.#device.lastItemId;
    }

    get scheme()             {
        return this.#scheme;
    }


    constructor(requestProcessor                  ) {
        this.#requestProcessor = requestProcessor;
        this.#device = requestProcessor.device;
        this.#scheme = requestProcessor.scheme;
    }

    nextId()              {
        return this.#device === null ? null : this.#device.nextId();
    }

    async request_Async(request             , transactionId = null)                    {
        return await this.requestBatch_Async([[ "request", request ]], transactionId);
    }

    async requestB_Async(requests                , transactionId = null)  
                              {
        return await this.requestBatch_Async(requests, transactionId);
    }

    async requestBatch_Async(requests_                , transactionId              = null)  
                              {
        let requests                        = [];
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

        if (abData.debug) {
            if (!response.isSuccess())
                console.log("DEBUG Response", response.getErrorInfo());
            
            for (let requestId in response.requestIds) {
                let actionName = requests[requestId][0];
                let result = response.getActionResult(actionName);
                if (result.isError()) {
                    console.log(`DEBUG Result Error '${actionName}'`, 
                            result.getErrorInfo());
                } else
                    console.log(`DEBUG Result '${actionName}'`, result.getData_Result());
            }
        }

        return response;
    }
}