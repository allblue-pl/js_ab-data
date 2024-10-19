'use strict';

const
    js0 = require('js0')
;

export default class Response
{

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


    constructor() {
        this.actionErrors = {};
        this.type = Response.Types_Success;
        this.errorMessage = null;
        this.info = {};
        this.results = {};
        this.requestIds = [];
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