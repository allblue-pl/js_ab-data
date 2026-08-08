import ts0, { type TS0PresetType, type TS0RawObject, type TS0ValueType } from "@allblue/ts0";
import type { ABDataDefValueType } from "./abDataDefTypes.ts";

class RequestDef {
    #actionDefs: {[actionName: string]: RequestDef_ActionDef};


    constructor() {
        this.#actionDefs = {};
    }

    defA(actionName: string, actionType: "r"|"w",
            argsDef: {[argName: string]: ABDataDefValueType},
            resultDef: {[propertyName: string]: ABDataDefValueType}): RequestDef {
        this.defAction(actionName, actionType, argsDef, resultDef);

        return this;
    }

    defAction(actionName: string, actionType: "r"|"w",
            argsDef: {[argName: string]: ABDataDefValueType},
            resultDef: {[propertyName: string]: ABDataDefValueType}): RequestDef {
        // if (actionType === 'w') {
            // if (!('success' in resultDef))
            //     throw new Error(`No 'success' in action result definition.`);

            // if (resultDef.success !== 'boolean')
            //     throw new Error(`'success' part in action result must be a 'boolean'.`);
        // }

        this.#actionDefs[actionName] = {
            type: actionType,
            argsDef: argsDef,
            resultDef: resultDef,
        };

        return this;
    }

    extA(actionName: string, argsDef: {[argName: string]: ABDataDefValueType},
            resultDef: {[propertyName: string]: ABDataDefValueType}): RequestDef {
        let actionDef = this.getActionDef(actionName);

        for (let argName in argsDef)
            actionDef.argsDef[argName] = argsDef[argName];
        for (let resultName in resultDef)
            actionDef.resultDef[resultName] = resultDef[resultName];

        return this;
    }

    getADef(actionName: string): RequestDef_ActionDef {
        return this.getActionDef(actionName);
    }

    getActionDef(actionName: string): RequestDef_ActionDef {
        if (!(actionName in this.#actionDefs))
            throw new Error(`Action '${actionName}' does not exist.`);

        return this.#actionDefs[actionName];
    }

    getActionNames(): Array<string> {
        return Object.keys(this.#actionDefs);
    }

    hasActionDef(actionName: string): boolean {
        return actionName in this.#actionDefs;
    }

    undefA(actionName: string): RequestDef {
        this.undefAction(actionName);

        return this;
    }

    undefAction(actionName: string): RequestDef {
        if (!(actionName in this.#actionDefs))
            throw new Error(`Action '${actionName}' does not exist.`);

        delete this.#actionDefs[actionName];

        return this;
    }

}
export default RequestDef;

type RequestDef_ActionDef = {
    type: "r"|"w",
    argsDef: {[argName: string]: ABDataDefValueType},
    resultDef: {[propertyName: string]: ABDataDefValueType},
};