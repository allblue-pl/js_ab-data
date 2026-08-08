import ts0, { ts0Virtual,                   } from "@allblue/ts0";
import DataScheme from "./DataScheme.js";
import Device from "./Device.js";
import Response from "./Response.js";

export default          class RequestProcessor {
    #device             ;
    #nextProcessingId        ;
    #processingQueue                 ;
    #scheme            ;


    get device()              {
        return this.#device;
    }

    get scheme()             {
        return this.#scheme;
    }


    constructor(dataScheme            , device             ) {
        this.#scheme = dataScheme;
        this.#device = device;

        this.#processingQueue = [];
        this.#nextProcessingId = 0;
    }

    async processRequest_Async(requestName        , actionName        , 
            actionArgs              , transactionId              = null)  
                              {
        let response = await this.processRequestBatch_Async([
            [ 'request', requestName, actionName, actionArgs, this.#scheme.version ],
        ]);

        return response;
    }

    async processRequestBatch_Async(requests                       , 
            transactionId              = null)                     { 
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


   #processRequestBatchHelper_Async(processingId        , requests                       , 
            transactionId             )                    {
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


                                                                          
                                                          
}

;                             
                         
                                    
                               
   

;                      
                      
                         
                        
                             
  

;                             
                      
                         
                        
                             
                          
  