import abText from "ab-text";
import ts0, { ts0Assert, type TS0RawArray, type TS0RawObject, type TS0RawValue } from "@allblue/ts0"
import Response from "./Response.ts";
import type { ErrorInfo } from "./ts-types.ts";

export default class ResponseResult<T_ResponseResultData extends ResponseResultData> {
    static get Types_Success(): number {
        return 0;
    }

    static get Types_Failure(): number {
        return 1;
    }

    static get Types_Error(): number {
        return 2;
    }

    #data: T_ResponseResultData|null;
    #response: Response;


    get data(): T_ResponseResultData {
        ts0Assert(this.#data !== null, `Response result data is null.`);

        return this.#data;
    }

    get message(): string {
        return this.#data === null ? 
                (this.#response.errorMessage === null ? 
                "Unknown Error" : this.#response.errorMessage) : 
                String(this.#data._message);
    }


    constructor(response: Response, resultData: ResponseResultData|null, 
            actionError: string|null) {
        if (resultData !== null) {
            ts0.assertType(resultData, ts0.TPreset({
                _type: 'int',
                _message: 'string',
            }, ts0.TObject("string", ts0.TRawValue)));
        }

        this.#response = response;
        this.#data = resultData as T_ResponseResultData;
    }

    getErrorInfo(): ErrorInfo {
        if (!this.#response.isSuccess())
            return this.#response.getErrorInfo();

        return {
             title: abText.$('abData.Errors_Result_Error'),
             message: this.#data === null ? "Unknown Error" : this.#data._message,
        };
    }

    isError(): boolean {
        if (this.#data === null)
            return true;

        return this.#data._type === ResponseResult.Types_Error;
    }

    isFailure(): boolean {
        if (this.#data === null)
            return false;

        return this.#data._type === ResponseResult.Types_Failure;
    }

    isSuccess(): boolean {
        if (this.#data === null)
            return false;

        return this.#data._type === ResponseResult.Types_Success;
    }
}

export type ResponseResultData = {
    _type: 0|1|2,
    _message: string,
    [key: string]: TS0RawValue,
}