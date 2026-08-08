import abText from "ab-text";
import ts0, { ts0Assert,                                                       } from "@allblue/ts0"
import Response from "./Response.js";
                                               

export default class ResponseResult                                                  {
    static get Types_Success()         {
        return 0;
    }

    static get Types_Failure()         {
        return 1;
    }

    static get Types_Error()         {
        return 2;
    }

    #data                           ;
    #response          ;


    get data()                       {
        ts0Assert(this.#data !== null, `Response result data is null.`);

        return this.#data;
    }

    get message()         {
        return this.#data === null ? 
                (this.#response.errorMessage === null ? 
                "Unknown Error" : this.#response.errorMessage) : 
                String(this.#data._message);
    }


    constructor(response          , resultData                         , 
            actionError             ) {
        if (resultData !== null) {
            ts0.assertType(resultData, ts0.TPreset({
                _type: 'int',
                _message: 'string',
            }, ts0.TObject("string", ts0.TRawValue)));
        }

        this.#response = response;
        this.#data = resultData                        ;
    }

    getErrorInfo()            {
        if (!this.#response.isSuccess())
            return this.#response.getErrorInfo();

        return {
             title: abText.$('abData.Errors_Result_Error'),
             message: this.#data === null ? "Unknown Error" : this.#data._message,
        };
    }

    isError()          {
        if (this.#data === null)
            return true;

        return this.#data._type === ResponseResult.Types_Error;
    }

    isFailure()          {
        if (this.#data === null)
            return false;

        return this.#data._type === ResponseResult.Types_Failure;
    }

    isSuccess()          {
        if (this.#data === null)
            return false;

        return this.#data._type === ResponseResult.Types_Success;
    }
}

;                                 
                 
                     
                               
 