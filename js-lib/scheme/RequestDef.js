'use strict';

const
    js0 = require('js0')
;

class RequestDef
{

    static ExtendDef(def, extDef) {
        js0.args(arguments, js0.RawObject, js0.RawObject);

        let newDef = {};

        for (let argName in def)
            newDef[argName] = def[argName];

        for (let argName in extDef)
            newDef[argName] = extDef;

        return newDef;
    }

    constructor() {
        this._actionDefs = {};
    }

    defA(actionName, actionType, argsDef, resultDef) {
        this.defAction(actionName, actionType, argsDef, resultDef);

        return this;
    }

    defAction(actionName, actionType, argsDef, resultDef) {
        js0.args(arguments, 'string', js0.Enum([ 'r', 'w' ]), 
                js0.RawObject, js0.RawObject);

        resultDef._type = 'int';
        resultDef._message = 'string';

        // if (actionType === 'w') {
            // if (!('success' in resultDef))
            //     throw new Error(`No 'success' in action result definition.`);

            // if (resultDef.success !== 'boolean')
            //     throw new Error(`'success' part in action result must be a 'boolean'.`);
        // }

        this._actionDefs[actionName] = {
            type: actionType,
            argsDef: argsDef,
            resultDef: resultDef,
        };

        return this;
    }

    getADef(actionName) {
        return this.getActionDef(actionName);
    }

    getActionDef(actionName) {
        js0.args(arguments, 'string');

        if (!(actionName in this._actionDefs))
            throw new Error(`Action '${actionName}' does not exist.`);

        return this._actionDefs[actionName];
    }

    hasActionDef(actionName) {
        return actionName in this._actionDefs;
    }

    undefA(actionName) {
        this.undefAction(actionName);

        return this;
    }

    undefAction(actionName) {
        js0.args(arguments, 'string');

        if (!(actionName in this._actionDefs))
            throw new Error(`Action '${actionName}' does not exist.`);

        delete this._actionDefs[actionName];

        return this;
    }

}
module.exports = RequestDef;