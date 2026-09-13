import { type TS0NotSet, type TS0RawValue } from "@allblue/ts0";
import ResponseResult, { type ResponseResultData } from "./ResponseResult.ts";
import { ApiResult } from "web-ab-api";
import type { ErrorInfo } from "./ts-types.ts";
declare class Response {
    #private;
    static get ResultTypes_Success(): number;
    static get ResultTypes_Failure(): number;
    static get ResultTypes_Error(): number;
    static get Types_Success(): number;
    static get Types_ResultFailure(): number;
    static get Types_ResultError(): number;
    static get Types_ActionError(): number;
    static get Types_Error(): number;
    static Create(responseData: ResponseData): Response;
    get actionErrors(): {
        [actionName: string]: string | null;
    };
    get errorMessage(): string | null;
    get info(): ResponseInfo;
    get requestIds(): Array<string>;
    get type(): number;
    constructor();
    addResult(requestId: string, result: ResponseResultData | null, actionError: string | null): void;
    getErrorInfo(): ErrorInfo;
    getMessage(): string | null;
    getActionResult(requestId?: string | TS0NotSet): ResponseResult;
    isSuccess(): boolean;
    parseRawObject(responseData: ResponseData): void;
    setError(errorMessage: string): void;
    setInfo(info: ResponseInfo): void;
    setType(type: number): void;
}
export default Response;
export type ResponseData = {
    actionErrors: {
        [actionName: string]: string | null;
    };
    type: number;
    errorMessage: string;
    info: ResponseInfo;
    results: ResponseDataResults;
    requestIds: Array<string>;
};
export type ResponseDataResults = {
    [actionName: string]: ResponseResultData | null;
};
type ResponseInfo = {
    webResult?: ApiResult;
} & {
    [key: string]: TS0RawValue | ApiResult;
};
