import type { ABDataDefValueType } from "./abDataDefTypes.ts";
declare class RequestDef {
    #private;
    constructor();
    defA(actionName: string, actionType: "r" | "w", argsDef: {
        [argName: string]: ABDataDefValueType;
    }, resultDef: {
        [propertyName: string]: ABDataDefValueType;
    }): RequestDef;
    defAction(actionName: string, actionType: "r" | "w", argsDef: {
        [argName: string]: ABDataDefValueType;
    }, resultDef: {
        [propertyName: string]: ABDataDefValueType;
    }): RequestDef;
    extA(actionName: string, argsDef: {
        [argName: string]: ABDataDefValueType;
    }, resultDef: {
        [propertyName: string]: ABDataDefValueType;
    }): RequestDef;
    getADef(actionName: string): RequestDef_ActionDef;
    getActionDef(actionName: string): RequestDef_ActionDef;
    getActionNames(): Array<string>;
    hasActionDef(actionName: string): boolean;
    undefA(actionName: string): RequestDef;
    undefAction(actionName: string): RequestDef;
}
export default RequestDef;
type RequestDef_ActionDef = {
    type: "r" | "w";
    argsDef: {
        [argName: string]: ABDataDefValueType;
    };
    resultDef: {
        [propertyName: string]: ABDataDefValueType;
    };
};
