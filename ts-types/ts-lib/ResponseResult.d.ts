import { type TS0RawValue } from "@allblue/ts0";
import Response from "./Response.ts";
import type { ErrorInfo } from "./ts-types.ts";
export default class ResponseResult<T_ResponseResultData extends ResponseResultData> {
    #private;
    static get Types_Success(): number;
    static get Types_Failure(): number;
    static get Types_Error(): number;
    get data(): T_ResponseResultData;
    get error(): string | null;
    get message(): string;
    constructor(response: Response, resultData: ResponseResultData | null, error: string | null);
    getErrorInfo(): ErrorInfo;
    isError(): boolean;
    isFailure(): boolean;
    isSuccess(): boolean;
}
export type ResponseResultData = {
    _type: 0 | 1 | 2;
    _message: string;
    [key: string]: TS0RawValue;
};
export declare const p_ResponseResultData: import("@allblue/ts0").TS0PresetType;
