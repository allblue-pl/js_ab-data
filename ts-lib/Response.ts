import abText from "ab-text";
import ts0, { type TS0NotSet, type TS0RawObject, type TS0RawValue } from "@allblue/ts0"
import abData from "./index.ts";
import ResponseResult, { type ResponseResultData } from "./ResponseResult.ts";
import { ApiResult } from "web-ab-api";
import type { ErrorInfo } from "./ts-types.ts";

class Response {
    static get ResultTypes_Success(): number {
        return 0;
    }

    static get ResultTypes_Failure(): number {
        return 1;
    }

    static get ResultTypes_Error(): number {
        return 2;
    }

    static get Types_Success(): number {
        return 0;
    }

    static get Types_ResultFailure(): number {
        return 1;
    }

    static get Types_ResultError(): number {
        return 2;
    }

    static get Types_ActionError(): number {
        return 3;
    }

    static get Types_Error(): number {
        return 4;
    }


    static Create(responseData: ResponseData): Response {
        let r = new Response();
        r.parseRawObject(responseData);

        return r;
    }


    #actionErrors: {[actionName: string]: string|null};
    #errorMessage: string|null;
    #info: ResponseInfo;
    #requestIds: Array<string>;
    #results: ResponseDataResults;
    #type: number;


    get actionErrors(): {[actionName: string]: string|null} {
        return this.#actionErrors;
    }

    get errorMessage(): string|null {
        return this.#errorMessage;
    }

    get info(): ResponseInfo {
        return this.#info;
    }

    get requestIds(): Array<string> {
        return this.#requestIds;
    }

    // get results(): {[actionName: string]: ResponseResultData} {
    //     return this.#results;
    // }

    get type(): number {
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

    addResult(requestId: string, result: ResponseResultData|null, 
            actionError: string|null): void {
        this.#requestIds.push(requestId);
        this.#actionErrors[requestId] = actionError;
        this.#results[requestId] = result;
    }

    getErrorInfo(): ErrorInfo {
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

    getMessage(): string|null {
        return this.errorMessage;
    }

    getActionResult(requestId: string|TS0NotSet = ts0.notSet): ResponseResult {
        if (this.type >= 3)
            return new ResponseResult(this, null, null);

        if (requestId === ts0.notSet) {
            let resultsCount = 0;
            for (let actionName in this.#results) {
                if (actionName[0] !== '_')
                    resultsCount++;
            }
            if (resultsCount > 1)
                throw new Error(`You must specify 'actionName' in batch request.`);

            requestId = 'request';
        }

        if (!this.#requestIds.includes(requestId)) {
            return new ResponseResult(this, null, `Request with id '${requestId}'` + 
                    ` does not exist.`);
        }

        if (!(requestId in this.#results)) {
            if (requestId in this.actionErrors)
                return new ResponseResult(this, null, this.actionErrors[requestId]);

            return new ResponseResult(this, null, null);
        }

        return new ResponseResult(this, this.#results[requestId], null);
    }

    isSuccess(): boolean {
        return this.type < 2;
    }

    parseRawObject(responseData: ResponseData): void {
        this.#actionErrors = responseData.actionErrors;
        this.#type = responseData.type;
        this.#errorMessage = responseData.errorMessage;
        this.#info = responseData.info;
        this.#results = responseData.results;
        this.#requestIds = responseData.requestIds;
    }

    setError(errorMessage: string): void {
        this.#errorMessage = errorMessage;
    }

    setInfo(info: ResponseInfo): void {
        this.#info = info;
    }

    setType(type: number): void {
        this.#type = type;
    }
}
export default Response;


export type ResponseData = {
    actionErrors: {[actionName: string]: string|null},
    type: number,
    errorMessage: string,
    info: ResponseInfo,
    results: ResponseDataResults,
    requestIds: Array<string>,
}

export type ResponseDataResults = {[actionName: string]: ResponseResultData|null};

type ResponseInfo = {
    webResult?: ApiResult,
} & {[key: string]: TS0RawValue|ApiResult};