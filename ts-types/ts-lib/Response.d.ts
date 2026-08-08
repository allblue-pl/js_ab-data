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
        [actionName: string]: string;
    };
    get errorMessage(): string | null;
    get results(): {
        [actionName: string]: ResponseResultData;
    };
    get type(): number;
    constructor();
    getErrorInfo(): ErrorInfo;
    getMessage(): string | null;
    getResult<T_ResponseResultData extends ResponseResultData>(actionName?: string | TS0NotSet): ResponseResult<T_ResponseResultData>;
    isSuccess(): boolean;
    parseRawObject(responseData: ResponseData): void;
    setError(errorMessage: string): void;
    setInfo(info: ResponseInfo): void;
    setType(type: number): void;
}
export default Response;
export type ResponseData = {
    actionErrors: {
        [actionName: string]: string;
    };
    type: number;
    errorMessage: string;
    info: ResponseInfo;
    results: ResponseDataResults;
    requestIds: Array<number>;
};
export type ResponseDataResults = {
    [actionName: string]: ResponseResultData;
};
type ResponseInfo = {
    webResult?: ApiResult;
} & {
    [key: string]: TS0RawValue | ApiResult;
};
