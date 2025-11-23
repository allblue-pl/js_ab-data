'use strict';

const
    js0 = require('js0')
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

    getMessage() {
        return this.errorMessage;
    }

    getResult(actionName = js0.NotSet) {
        js0.args(arguments, [ 'string', js0.Default ]);

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

        if (!(actionName in this.results))
            throw new Error(`Action '${actionName}' result does not exist.`);

        return this.results[actionName];
    }

    isSuccess() {
        return this.type === Response.Types_Success;
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