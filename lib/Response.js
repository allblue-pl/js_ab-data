import abText from "ab-text";
import ts0, {                                                     } from "@allblue/ts0"
import abData from "./index.js";
import ResponseResult, {                         } from "./ResponseResult.js";
import { ApiResult } from "web-ab-api";
                                               

class Response {
    static get ResultTypes_Success()         {
        return 0;
    }

    static get ResultTypes_Failure()         {
        return 1;
    }

    static get ResultTypes_Error()         {
        return 2;
    }

    static get Types_Success()         {
        return 0;
    }

    static get Types_ResultFailure()         {
        return 1;
    }

    static get Types_ResultError()         {
        return 2;
    }

    static get Types_ActionError()         {
        return 3;
    }

    static get Types_Error()         {
        return 4;
    }


    static Create(responseData              )           {
        let r = new Response();
        r.parseRawObject(responseData);

        return r;
    }


    #actionErrors                                ;
    #errorMessage             ;
    #info              ;
    #requestIds               ;
    #results                                            ;
    #type        ;


    get actionErrors()                                 {
        return this.#actionErrors;
    }

    get errorMessage()              {
        return this.#errorMessage;
    }

    get results()                                             {
        return this.#results;
    }

    get type()         {
        return this.#type;
    }


    constructor() {
        this.#actionErrors = {};
        this.#type = Response.Types_Success;
        this.#errorMessage = null;
        this.#info = {};
        this.#results = {};
        this.#requestIds = [];
    }

    getErrorInfo()            {
        if (this.#info.webResult !== undefined) {
            let webResult = this.#info.webResult;

            let webResultError = webResult.getErrorInfo();
            if (webResultError !== null)
                return webResultError;
        }

        if (this.type === abData.Response.Types_Error) {
            return {
                title: abText.$('abData.Errors_Response_Other'),
                message: this.errorMessage === null ? 
                        "Unknown Error" : this.errorMessage,
            };
        } else if (this.type === abData.Response.Types_ActionError) {
            let actionErrors = [];
            for (let actionName in this.actionErrors) {
                actionErrors.push('[ ' + actionName + ' -> ' + 
                        this.actionErrors[actionName] + ' ]');
            }

            return {
                title: abText.$('abData.Errors_Response_ActionError'),
                message: actionErrors.length === 0 ? 
                        (this.errorMessage === null ? 
                        "Unknown Error" : this.errorMessage) : actionErrors.join(', '),
            };
        }

        return {
            title: "Unknown Error",
            message: "Unknown error.",
        };
    }

    getMessage()              {
        return this.errorMessage;
    }

    getResult                                                 (actionName                   = ts0.notSet)  
                                                 {
        if (this.type >= 3)
            return new ResponseResult(this, null, null);

        if (actionName === ts0.notSet) {
            let resultsCount = 0;
            for (let actionName in this.#results) {
                if (actionName[0] !== '_')
                    resultsCount++;
            }
            if (resultsCount > 1)
                throw new Error(`You must specify 'actionName' in batch request.`);

            actionName = 'request';
        }

        if (!(actionName in this.#results)) {
            if (actionName in this.actionErrors)
                return new ResponseResult(this, null, this.actionErrors[actionName]);

            return new ResponseResult(this, null, null);
        }

        return new ResponseResult(this, this.#results[actionName], null);
    }

    isSuccess()          {
        return this.type < 2;
    }

    parseRawObject(responseData              )       {
        this.#actionErrors = responseData.actionErrors;
        this.#type = responseData.type;
        this.#errorMessage = responseData.errorMessage;
        this.#info = responseData.info;
        this.#results = responseData.results;
        this.#requestIds = responseData.requestIds;
    }

    setError(errorMessage        )       {
        this.#errorMessage = errorMessage;
    }

    setInfo(info              )       {
        this.#info = info;
    }

    setType(type        )       {
        this.#type = type;
    }
}
export default Response;


                            
                                                 
                 
                         
                       
                                 
                              
 

                                                                             

                     
                          
                                           