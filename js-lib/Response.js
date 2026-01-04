'use strict';

const
    abText = require('ab-text'),
    js0 = require('js0'),    

    abData = require('./index.js'),
    Result = require('./Result')
;

class Response {
    static get ResultTypes_Success() {
        return 0;
    }

    static get ResultTypes_Failure() {
        return 1;
    }

    static get ResultTypes_Error() {
        return 2;
    }

    static get Types_Success() {
        return 0;
    }

    static get Types_ResultFailure() {
        return 1;
    }

    static get Types_ResultError() {
        return 2;
    }

    static get Types_ActionError() {
        return 3;
    }

    static get Types_Error() {
        return 4;
    }


    static Create(response) {
        js0.args(arguments, js0.RawObject);

        let r = new Response();
        r.parseRawObject(response);

        return r;
    }


    constructor() {
        this.actionErrors = {};
        this.type = Response.Types_Success;
        this.errorMessage = null;
        this.info = {};
        this.results = {};
        this.requestIds = [];
    }

    getErrorInfo() {
        if ('webResult' in this.info) {
            let webResult = this.info.webResult;

            let webResultError = webResult.getErrorInfo();
            if (webResultError !== null)
                return webResultError;
        }

        if (this.type === abData.Response.Types_Error) {
            return {
                title: abText.$('abData.Errors_Response_Other'),
                message: this.errorMessage,
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
                        this.errorMessage : actionErrors.join(', '),
            };
        }

        return null;
    }

    getMessage() {
        return this.errorMessage;
    }

    getResult(actionName = js0.NotSet) {
        js0.args(arguments, [ 'string', js0.Default ]);

        if (this.type >= 3)
            return new Result(this, null);

        if (actionName === js0.NotSet) {
            let resultsCount = 0;
            for (let actionName in this.results) {
                if (actionName[0] !== '_')
                    resultsCount++;
            }
            if (resultsCount > 1)
                throw new Error(`You must specify 'actionName' in batch request.`);

            actionName = 'request';
        }

        if (!(actionName in this.results)) {
            if (actionName in this.actionErrors)
                return new Result(this, null, this.actionErrors[actionName]);

            return new Result(this, null, null);
        }

        return new Result(this, this.results[actionName], null);
    }

    isSuccess() {
        return this.type < 2;
    }

    parseRawObject(response) {
        js0.args(arguments, js0.RawObject);

        this.actionErrors = response.actionErrors;
        this.type = response.type;
        this.errorMessage = response.errorMessage;
        this.info = response.info;
        this.results = response.results;
        this.requestIds = response.requestIds;
    }
}
module.exports = Response;