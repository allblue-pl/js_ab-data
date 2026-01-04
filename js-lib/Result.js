'use strict';

import abText from "ab-text";
import js0 from "js0";
import Response from "./Response.js";

export default class Result {
    static get Types_Success() {
        return 0;
    }

    static get Types_Failure() {
        return 1;
    }

    static get Types_Error() {
        return 2;
    }


    get data() { return js0.fn(
    js0.TRawObject, () => {
        return this._data;
    })}

    get message() { return js0.fn(
    'string', () => {
        return this._data === null ? 
                this._response.message : this._data._message;
    })}


    constructor(response, resultData, actionError) { return js0.fn(arguments,
    require('./Response'), [ js0.TRawObject, js0.Null ], [ 'string', js0.Null ],
    '', () => {
        if (resultData !== null) {
            js0.typeE(resultData, js0.Preset({
                _type: 'int',
                _message: 'string',
            }, true));
        }

        this._response = response;
        this._data = resultData;
    })}

    getErrorInfo() { return js0.fn(arguments,
    js0.Preset({ title: 'string', message: 'string' }), () => {
        if (!this._response.isSuccess())
            return this._response.getErrorInfo();

        return {
             title: abText.$('abData.Errors_Result_Error'),
             message: this.data._message,
        };
    })}

    isError() { return js0.fn(arguments,
    'boolean', () => {
        if (this._data === null)
            return true;

        return this._data._type === Result.Types_Error;
    })}

    isFailure() { return js0.fn(arguments,
    'boolean', () => {
        if (this._data === null)
            return false;

        return this._data._type === Result.Types_Failure;
    })}

    isSuccess() { return js0.fn(arguments,
    'boolean', () => {
        if (this._data === null)
            return false;

        return this._data._type === Result.Types_Success;
    })}
}