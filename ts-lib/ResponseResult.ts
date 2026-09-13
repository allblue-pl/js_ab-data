import abText from "ab-text";
import ts0, { TS0ArrayType, ts0Assert, type TS0RawArray, type TS0RawObject, type TS0RawValue } from "@allblue/ts0"
import Response from "./Response.ts";
import type { ErrorInfo } from "./ts-types.ts";

export default class ResponseResult {
    static get Types_Success(): number {
        return 0;
    }

    static get Types_Failure(): number {
        return 1;
    }

    static get Types_Error(): number {
        return 2;
    }

    #data: ResponseResultData|null;
    #error: string|null;
    #response: Response;


    get data(): ResponseResultData {
        return this.getData_Result();
    }

    get error(): string|null {
        return this.#error;
    }

    get message(): string {
        return this.#data === null ? 
                (this.#response.errorMessage === null ? 
                "Unknown Error" : this.#response.errorMessage) : 
                String(this.#data._message);
    }


    constructor(response: Response, resultData: ResponseResultData|null, 
            error: string|null) {
        if (resultData !== null) {
            ts0.assertType(resultData, ts0.TPreset({
                _type: 'int',
                _message: 'string',
            }, ts0.TObject("string", ts0.TRawValue)));
        }

        this.#error = error;
        this.#response = response;
        this.#data = resultData;
    }



    getData_Failure<T_ResultData extends ResponseResultData>(): T_ResultData {
        ts0Assert(this.isFailure(), `Response result is not a success.`);

        return this.#data as T_ResultData;
    }

    getData_Result<T_ResultData extends ResponseResultData>(): T_ResultData {
        ts0Assert(this.#data !== null, `Result data is null.`);

        return this.#data as T_ResultData;
    }

    getData_Success<T_ResultData extends ResponseResultData>(): T_ResultData {
        ts0Assert(this.isSuccess(), `Response result is not a success.`);

        return this.#data as T_ResultData;
    }

    getData_Raw(): ResponseResultData|null {
        return this.#data;
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
export const p_ResponseResultData = ts0.TPreset({
    _type: ts0.TEnum([ 0, 1, 2 ]),
    _message: "string",
}, ts0.TObject("string", ts0.TRawValue));